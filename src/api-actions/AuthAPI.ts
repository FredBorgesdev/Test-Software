import { APIRequestContext, expect } from '@playwright/test';
import { AUTH_CREDENTIALS } from '../data/testData';

export class AuthAPI {
    constructor(private request: APIRequestContext) {}

    async createToken(): Promise<string> {
        const response = await this.request.post('/auth', {
            data: AUTH_CREDENTIALS,
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('token');
        expect(typeof responseBody.token).toBe('string');

        return responseBody.token;
    }
}