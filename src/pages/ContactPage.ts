import { Page, expect } from '@playwright/test';
import { VALID_CONTACT_DATA } from '../data/testData';

export class ContactPage {
    private readonly nameInput = 'input#name';
    private readonly emailInput = 'input#email';
    private readonly phoneInput = 'input#phone';
    private readonly subjectInput = 'input#subject';
    private readonly submitButtonSelector = 'button:has-text("Submit")'; 
    private readonly messageTextarea = '#description';  
    private readonly errorMessageContainer = 'div.alert-danger'; 

    constructor(private page: Page) {}

    public get submitButton(): string {
        return this.submitButtonSelector;
    }

    async goto() {
        await this.page.goto('/', { waitUntil: 'networkidle' }); 
        
        await expect(this.page.locator(this.submitButtonSelector)).toBeVisible();
    }

    async fillContactForm(data: { name: string, email: string, phone: string, subject: string, message: string }) {
        await this.page.fill(this.nameInput, data.name);
        await this.page.fill(this.emailInput, data.email);
        await this.page.fill(this.phoneInput, data.phone);
        await this.page.fill(this.subjectInput, data.subject);
        await this.page.fill(this.messageTextarea, data.message);
    }

    async submit() {
        await this.page.click(this.submitButtonSelector);
    }

    async verifySuccessMessage() {
        const successTextLocator = this.page.locator(`text=Thanks for getting in touch ${VALID_CONTACT_DATA.name}!`);
        await expect(successTextLocator).toBeVisible({ timeout: 10000 }); 
    }
    
    async getErrorMessageText() {
        await expect(this.page.locator(this.errorMessageContainer)).toBeVisible({timeout: 15000});
        return this.page.locator(this.errorMessageContainer).innerText();
    }
}