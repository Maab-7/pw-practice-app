import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
})

test('Locator syntax rules', async({page}) => {

    //By tag name
    page.locator('input')
    //await page.locator('input').first().click()

    //by ID
    //page.locator('#inputEmail1')
    //Realizando acciones con los elementos y considerando que son promesas que debe esperar su ejecucion
    page.locator('#inputEmail1')

    //by class value
    page.locator('.shape-rectangle')

    //by attribute
    page.locator('[placeholder="Email"]')

    //by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine different selectors
    page.locator('input[placeholder="Email"][nbinput]') //Se puede utilizar varios identificadores de elementos, juntos
    
    //by Xpath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')

    //by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the grid")')

})

test('User facing locators', async({page}) => {
    await page.getByRole('textbox', {name: 'Email'}).first().click();
    await page.getByRole('button', {name: 'Sign in'}).first().click();

    await page.getByLabel('Email').first().click();
    await page.getByPlaceholder('Jane Doe').click();
    await page.getByText('Using the grid').click();

    //para usar el getByTestId, se debe agregar el atributo data-testid en el HTML
    await page.getByTestId('Signin').click();

    await page.getByTitle('IoT Dashboard').click();
})

test('locating child elements', async({page}) => {

    await page.locator('nb-card nb-radio :text-is("Option 1")').click();
    //Esto es lo mismo que la anterior linea, pero con un selector mas largo
    //await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 1")').click();

    //Se puede usar regular locators y facing locators juntos
    await page.locator('nb-card').getByRole('button', {name: 'Sign in'}).first().click();

    await page.locator('nb-card').nth(3).getByRole('button').click();


});

test('locating parent elements', async({page}) => {

    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click();
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click();

    //Usando filter
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click();

    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click();
    //Se puede usar filter varias veces
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"})
        .getByRole('textbox', {name: "Email"}).click();

    //Utilizando xpath para localizar el padre
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click();

})

test('Reusing locators', async({page}) => {

    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"});
    const emailField = basicForm.getByRole('textbox', {name: "Email"});

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click();
    await basicForm.getByRole('button').click();

    await expect(emailField).toHaveValue('test@test.com');


})

test('extracting values', async({page}) => {
    //Single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"});
    const buttonText = await basicForm.locator('button').textContent();
    expect(buttonText).toEqual('Submit');

    //all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents();
    expect(allRadioButtonsLabels).toContain("Option 1");

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"});
    await emailField.fill('test@test.com');
    const emailValue = await emailField.inputValue();
    expect(emailValue).toEqual('test@test.com');

    const placeholderValue = await emailField.getAttribute('placeholder');
    expect(placeholderValue).toEqual('Email');
})

test('assertions', async({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button');

    //General assertions
    const value = 5
    expect(value).toEqual(5);

    const text = await basicFormButton.textContent();
    expect(text).toEqual('Submit');

    //Locator assertions
    await expect(basicFormButton).toHaveText('Submit');

    //Soft assertions, a pesar de que falle, el test no se detendra
    //await expect.soft(basicFormButton).toHaveText('Submit2') si se quita el soft, el test se detendra
    //No se considera una buena practica usar soft assertions, ya que puede generar confusiones y errores en el futuro
    await expect(basicFormButton).toHaveText('Submit5');
    await basicFormButton.click();
})




