import {expect, test, devices} from '@playwright/test';
test.use({ ...devices['iPhone 13 Pro Max'] });
//test.use({ viewport: { width: 414, height: 800 } });
test('input fields', async ({page}, testInfo) => {
    await page.goto('/');
    if(testInfo.project.name == 'mobile'){
         await page.locator('.sidebar-toggle').click();
    }
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();  
    if(testInfo.project.name == 'mobile'){
         await page.locator('.sidebar-toggle').click();
    }
    const usingTheGridEmailInput = page.locator('nb-card', {hasText: 'Using the grid'}).getByRole('textbox', {name: 'Email'});
    await usingTheGridEmailInput.fill('test@test.com');
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially('test2@test.com');
    })