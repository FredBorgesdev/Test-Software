import { test, expect } from './api.fixtures';
import { NEW_BOOKING_DATA } from '../../src/data/testData';

test.describe('Restful Booker API - Funcional e Negativo', () => {

    test('1. Deve buscar a reserva criada pela Fixture (GET)', async ({ request, createdBookingId }) => {
        const response = await request.get(`/booking/${createdBookingId}`);
        expect(response.status()).toBe(200); 

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('depositpaid');
        expect(responseBody.lastname).toBe(NEW_BOOKING_DATA.lastname); 
    });


    test('2. Deve atualizar totalmente a reserva existente (PUT)', async ({ request, createdBookingId }) => {
        const updatedData = { ...NEW_BOOKING_DATA, firstname: "UPDATED", totalprice: 999 };
        const response = await request.put(`/booking/${createdBookingId}`, { data: updatedData });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.firstname).toBe("UPDATED");
        expect(responseBody.totalprice).toBe(999);
    });

    test('3. Deve retornar 403 Forbidden ao tentar ATUALIZAR sem token (Segurança)', async ({ request, createdBookingId }) => {
        
        const invalidToken = 'invalid-token-12345';

        const response = await request.put(`/booking/${createdBookingId}`, {
            data: {
                "firstname" : "Unauthorized",
                "lastname" : "Attempt",
                "totalprice" : 111,
                "depositpaid" : true,
                "bookingdates" : { "checkin" : "2018-01-01", "checkout" : "2019-01-01" },
                "additionalneeds" : "Breakfast"
            },
            headers: {
                'Cookie': `token=${invalidToken}`,
            }
        });

        expect(response.status()).toBe(403); 
    });

    test('4. Deve atualizar parcialmente o nome da reserva (PATCH)', async ({ request, createdBookingId }) => {
        const response = await request.patch(`/booking/${createdBookingId}`, {
            data: { firstname: "PartialUpdate" }
        });
        
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.firstname).toBe("PartialUpdate");
    });
    
    test('5. Deve excluir a reserva e confirmar a exclusão', async ({ request, createdBookingId }) => {
        const deleteResponse = await request.delete(`/booking/${createdBookingId}`);
        expect(deleteResponse.status()).toBe(201);

        const getResponse = await request.get(`/booking/${createdBookingId}`);
        expect(getResponse.status()).toBe(404);
    });

    test('6. Não deve criar reserva sem o campo totalprice (Validação)', async ({ request }) => {
        const invalidData = { ...NEW_BOOKING_DATA };
        delete (invalidData as any).totalprice;
        const response = await request.post('/booking', { data: invalidData });
        expect(response.status()).toBeGreaterThanOrEqual(400); 
    });
    
    test('7. Deve retornar 404 ao tentar buscar reserva com ID inexistente (Edge Case)', async ({ request }) => {
        const response = await request.get('/booking/99999999');
        expect(response.status()).toBe(404);
    });

    test('8. Deve verificar o status da API (HealthCheck)', async ({ request }) => {
        const response = await request.get('/ping');
        expect(response.status()).toBe(201);
    });

    test('9. Deve obter IDs de reserva com sucesso', async ({ request }) => {
        const response = await request.get('/booking');
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(Array.isArray(responseBody)).toBe(true);
    });
    
    test('10. Deve criar uma reserva com sucesso (POST Happy Path)', async ({ request }) => {
        const response = await request.post('/booking', { data: NEW_BOOKING_DATA });
        expect(response.status()).toBe(200); 
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('bookingid'); 
    });
});