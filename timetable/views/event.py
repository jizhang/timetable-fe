import dateutil.parser

from flask import request, jsonify, Response
from marshmallow import ValidationError

from timetable import app, db, auth, AppError
from timetable.consts import CATEGORIES
from timetable.models.event import Event
from timetable.services import event as event_service
from timetable.schemas.event import categories_schema, event_schema, event_schema



@app.get('/api/event/categories')
@auth.login_required
def get_event_categories() -> Response:
    """
    ---
    get:
      summary: Get event categories.
      tags: [event]
      x-swagger-router-controller: timetable.views.event
      operationId: get_event_categories
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  categories:
                    type: array
                    items:
                      $ref: '#/components/schemas/Category'
    """
    return jsonify(categories=categories_schema.dump(CATEGORIES)) # TODO Use schema


@app.post('/api/event/ping')
@auth.login_required
def event_ping():
    return jsonify('pong')


@app.get('/api/event/list')
@auth.login_required
def get_event_list():
    """
    ---
    get:
      summary: Get event list.
      tags: [event]
      x-swagger-router-controller: timetable.views.event
      operationId: get_event_list
      parameters:
        - in: query
          name: start
          schema:
            type: datetime
        - in: query
          name: end
          schema:
            type: datetime
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  events:
                    type: array
                    items:
                      $ref: '#/components/schemas/Event'
    """
    try:
        start = dateutil.parser.parse(request.args['start'])
        end = dateutil.parser.parse(request.args['end'])
    except Exception as e:
        raise AppError('Invalid start or end time.') from e

    events = event_service.get_event_list(start, end)
    return jsonify(events=event_schema.dump(events, many=True))


def get_category_color(category_id):
    for item in CATEGORIES:
        if item['id'] == category_id:
            return item['color']
    return ''


@app.post('/api/event/save')
@auth.login_required
def save_event():
    """
    ---
    post:
      summary: Save event.
      tags: [event]
      x-swagger-router-controller: timetable.views.event
      operationId: save_event
      requestBody:
        required: true
        content:
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/Event'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
    """
    try:
        event_form = event_schema.load(request.form)
    except ValidationError as e:
        raise AppError(e.messages)

    event = Event(**event_form)
    event_id = event_service.save(event)
    db.session.commit()

    return jsonify({'id': event_id})


@app.post('/api/event/delete')
@auth.login_required
def delete_event() -> Response:
    if not request.form.get('id'):
        raise AppError('ID cannot be empty.')

    row = db.session.query(Event).get(request.form['id'])
    if row is None:
        raise AppError('Event not found.')

    db.session.delete(row)
    db.session.commit()
    return jsonify('ok')
