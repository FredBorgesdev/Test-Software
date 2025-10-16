import { test as baseTest, expect, APIRequestContext } from '@playwright/test'; 
import { NEW_BOOKING_DATA } from '../../src/data/testData';

type MyAPIFixtures = {
    createdBookingId: number; 
};
export const test = baseTest.extend<MyAPIFixtures>({
    createdBookingId: async ({ request }, use) => {
        
        const response = await request.post('/booking', { data: NEW_BOOKING_DATA });
        
        if (response.status() !== 200) {
            throw new Error(`Falha ao criar reserva para fixture. Status: ${response.status()}`);
        }
        
        const responseBody = await response.json();
        const bookingId = responseBody.bookingid;

        await use(bookingId);
    },
});
export { expect };