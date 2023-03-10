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

import { exists, mapValues } from '../runtime';
import type { Event } from './Event';
import {
    EventFromJSON,
    EventFromJSONTyped,
    EventToJSON,
} from './Event';

/**
 * 
 * @export
 * @interface GetEventList200Response
 */
export interface GetEventList200Response {
    /**
     * 
     * @type {Array<Event>}
     * @memberof GetEventList200Response
     */
    events?: Array<Event>;
}

/**
 * Check if a given object implements the GetEventList200Response interface.
 */
export function instanceOfGetEventList200Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function GetEventList200ResponseFromJSON(json: any): GetEventList200Response {
    return GetEventList200ResponseFromJSONTyped(json, false);
}

export function GetEventList200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetEventList200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'events': !exists(json, 'events') ? undefined : ((json['events'] as Array<any>).map(EventFromJSON)),
    };
}

export function GetEventList200ResponseToJSON(value?: GetEventList200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'events': value.events === undefined ? undefined : ((value.events as Array<any>).map(EventToJSON)),
    };
}

