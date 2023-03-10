/* tslint:disable */
/* eslint-disable */
/**
 * Timetable
 * What have you done today?
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  Event,
  GetEventCategories200Response,
  GetEventList200Response,
  SaveEvent200Response,
} from '../models';
import {
    EventFromJSON,
    EventToJSON,
    GetEventCategories200ResponseFromJSON,
    GetEventCategories200ResponseToJSON,
    GetEventList200ResponseFromJSON,
    GetEventList200ResponseToJSON,
    SaveEvent200ResponseFromJSON,
    SaveEvent200ResponseToJSON,
} from '../models';

export interface DeleteEventRequest {
    id?: number;
}

export interface GetEventListRequest {
    start?: Date;
    end?: Date;
}

export interface SaveEventRequest {
    event: Event;
}

/**
 * 
 */
export class EventApi extends runtime.BaseAPI {

    /**
     * Delete event.
     */
    async deleteEventRaw(requestParameters: DeleteEventRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SaveEvent200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const consumes: runtime.Consume[] = [
            { contentType: 'application/x-www-form-urlencoded' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters.id !== undefined) {
            formParams.append('id', requestParameters.id as any);
        }

        const response = await this.request({
            path: `/api/event/delete`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SaveEvent200ResponseFromJSON(jsonValue));
    }

    /**
     * Delete event.
     */
    async deleteEvent(requestParameters: DeleteEventRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SaveEvent200Response> {
        const response = await this.deleteEventRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get event categories.
     */
    async getEventCategoriesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetEventCategories200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/event/categories`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetEventCategories200ResponseFromJSON(jsonValue));
    }

    /**
     * Get event categories.
     */
    async getEventCategories(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetEventCategories200Response> {
        const response = await this.getEventCategoriesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get event list.
     */
    async getEventListRaw(requestParameters: GetEventListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetEventList200Response>> {
        const queryParameters: any = {};

        if (requestParameters.start !== undefined) {
            queryParameters['start'] = (requestParameters.start as any).toISOString();
        }

        if (requestParameters.end !== undefined) {
            queryParameters['end'] = (requestParameters.end as any).toISOString();
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/event/list`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetEventList200ResponseFromJSON(jsonValue));
    }

    /**
     * Get event list.
     */
    async getEventList(requestParameters: GetEventListRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetEventList200Response> {
        const response = await this.getEventListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Save event.
     */
    async saveEventRaw(requestParameters: SaveEventRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SaveEvent200Response>> {
        if (requestParameters.event === null || requestParameters.event === undefined) {
            throw new runtime.RequiredError('event','Required parameter requestParameters.event was null or undefined when calling saveEvent.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/event/save`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: EventToJSON(requestParameters.event),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SaveEvent200ResponseFromJSON(jsonValue));
    }

    /**
     * Save event.
     */
    async saveEvent(requestParameters: SaveEventRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SaveEvent200Response> {
        const response = await this.saveEventRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
