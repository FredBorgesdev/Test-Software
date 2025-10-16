import { test, expect } from '@playwright/test';
import { ContactPage } from '../../src/pages/ContactPage';
import { VALID_CONTACT_DATA } from '../../src/data/testData';

test.describe('Interface Web - Contato e Validações', () => {

    test('1. Deve enviar mensagem de contato válida e exibir sucesso', async ({ page }) => {
        const contactPage = new ContactPage(page);
        await contactPage.goto(); 
        await contactPage.fillContactForm(VALID_CONTACT_DATA);
        await contactPage.submit();
        await contactPage.verifySuccessMessage(); 
    });

    test('2. Deve mostrar erro ao enviar com Nome em branco', async ({ page }) => {
        const contactPage = new ContactPage(page);
        await contactPage.goto(); 
        const invalidData = { ...VALID_CONTACT_DATA, name: "" }; 
        await contactPage.fillContactForm(invalidData);
        await contactPage.submit();
        
        const errorMessage = await contactPage.getErrorMessageText();
        await expect(errorMessage).toContain('Name may not be blank'); 
    });
    
    test('3. Deve mostrar erro ao enviar com e-mail inválido', async ({ page }) => {
        const contactPage = new ContactPage(page);
        await contactPage.goto(); 
        const invalidData = { ...VALID_CONTACT_DATA, email: "email_sem_arroba.com" }; 
        await contactPage.fillContactForm(invalidData);
        await contactPage.submit();
        
        const errorMessage = await contactPage.getErrorMessageText();
        await expect(errorMessage).toContain('must be a well-formed email address'); 
    });
    
    test('4. Deve mostrar erro com telefone muito curto (Edge Case)', async ({ page }) => {
        const contactPage = new ContactPage(page);
        await contactPage.goto(); 
        const invalidData = { ...VALID_CONTACT_DATA, phone: "12345" };
        await contactPage.fillContactForm(invalidData);
        await contactPage.submit();
        
        const errorMessage = await contactPage.getErrorMessageText();
        await expect(errorMessage).toContain('Phone must be between 11 and 21 characters'); 
    });

    test('5. Deve mostrar erro com assunto muito longo (Edge Case)', async ({ page }) => {
        const contactPage = new ContactPage(page);
        await contactPage.goto(); 
        const longSubject = "A".repeat(101);
        const invalidData = { ...VALID_CONTACT_DATA, subject: longSubject }; 
        await contactPage.fillContactForm(invalidData);
        await contactPage.submit();
        
        const errorMessage = await contactPage.getErrorMessageText();
        await expect(errorMessage).toContain('Subject must be between 5 and 100 characters'); 
    });

    test('6. Deve mostrar erro com mensagem muito curta', async ({ page }) => {
        const contactPage = new ContactPage(page);
        await contactPage.goto(); 
        const invalidData = { ...VALID_CONTACT_DATA, message: "Curta" };
        await contactPage.fillContactForm(invalidData);
        await contactPage.submit();
        
        const errorMessage = await contactPage.getErrorMessageText();
        await expect(errorMessage).toContain('Message must be between 20 and 2000 characters'); 
    });

    test('7. Deve ser possível limpar os campos preenchidos', async ({ page }) => {
        await new ContactPage(page).goto(); 
        await page.fill('input#name', 'TestName');
        await page.locator('input#name').clear();
        await expect(page.locator('input#name')).toBeEmpty();
    });

    test('8. Não deve mostrar a container de erro ao acessar a página', async ({ page }) => {
        await new ContactPage(page).goto(); 
        await expect(page.locator('.alert-danger')).not.toBeVisible();
    });

    test('9. Deve falhar com múltiplos erros ao enviar vazio', async ({ page }) => {
        const contactPage = new ContactPage(page);
        await contactPage.goto(); 
        await contactPage.submit(); 
        
        const errorMessage = await contactPage.getErrorMessageText();
        await expect(errorMessage).toContain('Name may not be blank');
        await expect(errorMessage).toContain('Email may not be blank');
    });

    test('10. O botão de submissão deve estar visível e habilitado', async ({ page }) => {
        const contactPage = new ContactPage(page);
        await contactPage.goto(); 
        await expect(page.locator(contactPage.submitButton)).toBeVisible(); 
        await expect(page.locator(contactPage.submitButton)).toBeEnabled();
    });
});