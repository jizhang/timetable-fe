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

/**
 * 
 */
export class CommonApi extends runtime.BaseAPI {

    /**
     * Ping API server.
     */
    async pingRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/ping`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Ping API server.
     */
    async ping(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.pingRaw(initOverrides);
        return await response.value();
    }

}