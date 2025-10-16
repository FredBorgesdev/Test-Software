import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';
import { AUTH_CREDENTIALS } from '../../src/data/testData';

const API_BASE_URL = 'https://restful-booker.herokuapp.com';
const authFile = 'playwright/.auth/user.json'; 

setup('Autenticação para API', async ({ playwright }) => {
    const request = await playwright.request.newContext({
        baseURL: API_BASE_URL,
    });

    const response = await request.post('/auth', {
        data: AUTH_CREDENTIALS,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('token');

    const authState = {
        cookies: [
            {
                name: 'token',
                value: responseBody.token,
                domain: 'restful-booker.herokuapp.com',
                path: '/',
                expires: -1, httpOnly: false, secure: false, sameSite: 'Lax',
            },
        ],
        origins: [] as any,
    };
    fs.mkdirSync('playwright/.auth', { recursive: true });
    fs.writeFileSync(authFile, JSON.stringify(authState, null, 2));

    await request.dispose();
});