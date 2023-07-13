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
/**
 * 
 * @export
 * @interface EventId
 */
export interface EventId {
    /**
     * 
     * @type {number}
     * @memberof EventId
     */
    id: number;
}

/**
 * Check if a given object implements the EventId interface.
 */
export function instanceOfEventId(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;

    return isInstance;
}

export function EventIdFromJSON(json: any): EventId {
    return EventIdFromJSONTyped(json, false);
}

export function EventIdFromJSONTyped(json: any, ignoreDiscriminator: boolean): EventId {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
    };
}

export function EventIdToJSON(value?: EventId | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
    };
}
