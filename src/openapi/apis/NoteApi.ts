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
  Note,
  NoteForm,
} from '../models';
import {
    NoteFromJSON,
    NoteToJSON,
    NoteFormFromJSON,
    NoteFormToJSON,
} from '../models';

export interface SaveNoteRequest {
    content?: string;
}

/**
 * 
 */
export class NoteApi extends runtime.BaseAPI {

    /**
     * Get note content.
     */
    async getNoteContentRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<NoteForm>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/note/content`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => NoteFormFromJSON(jsonValue));
    }

    /**
     * Get note content.
     */
    async getNoteContent(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<NoteForm> {
        const response = await this.getNoteContentRaw(initOverrides);
        return await response.value();
    }

    /**
     * Save note.
     */
    async saveNoteRaw(requestParameters: SaveNoteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Note>> {
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

        if (requestParameters.content !== undefined) {
            formParams.append('content', requestParameters.content as any);
        }

        const response = await this.request({
            path: `/api/note/save`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => NoteFromJSON(jsonValue));
    }

    /**
     * Save note.
     */
    async saveNote(requestParameters: SaveNoteRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Note> {
        const response = await this.saveNoteRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
