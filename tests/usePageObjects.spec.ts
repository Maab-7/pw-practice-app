import {expect, test} from '@playwright/test';
import {PageManager} from '../page-objects/pageManager';
import {faker} from '@faker-js/faker';

test.beforeEach(async ({page}) => {
    await page.goto('/');
});

test('Navigate to form page @smoke @regression', async ({page}) => {
    const pm = new PageManager(page);
    await pm.navigateTo().smartTablePage();
    await pm.navigateTo().toastrPage();
    await pm.navigateTo().tooltipPage();
    await pm.navigateTo().formLayoutsPage();
    await pm.navigateTo().datepickerPage(); 
})

test('Parametrized Methods @smoke', async ({page}) => {
    const pm = new PageManager(page);
    const randomFullName = faker.name.fullName();
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`;

    await pm.navigateTo().formLayoutsPage();
    await pm.onFormLayoutPage().submitUsingTheGridFormWithCredentialAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1');
    //Para sacar un screenshot de la página
    await page.screenshot({path: 'screenshots/formsLayoutPage.png'});
    const buffer = await page.screenshot();
    console.log(buffer.toString('base64'));
    
    await pm.onFormLayoutPage().submitInLineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
    
    //Tambien se puede sacar un screenshot de un elemento específico
    await page.locator('nb-card', {hasText: 'InLine form'}).screenshot({path: 'screenshots/inlineForm.png'});
    // await pm.navigateTo().datepickerPage();
    // await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(10);
    // await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6, 15);
})

test.only('testing with argos CI', async ({page}) => {
    const pm = new PageManager(page);
    await pm.navigateTo().formLayoutsPage();
    await pm.navigateTo().datepickerPage(); 
})