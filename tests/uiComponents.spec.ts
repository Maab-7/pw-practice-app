import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/');
});

test.describe('Form Layouts page', () => {
    test.describe.configure({retries: 0}); //This will retry all tests in this describe block 2 times if they fail
    test.beforeEach(async ({page}) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    });

    test('input fields', async ({page}, testInfo) => {
        if (testInfo.retry) {
            //do something
        }
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: 'Using the grid'}).getByRole('textbox', {name: 'Email'});
        await usingTheGridEmailInput.fill('test@test.com');
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially('test2@test.com');
        //pressSequentially is useful for simulating user typing with a delay

        //Generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue();
        //inputValue is a method that returns the current value of the input field
        expect(inputValue).toEqual('test2@test.com');

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');
    })

    test.only('radio buttons', async ({page}) => {

        const usingTheGridForm = page.locator('nb-card', {hasText: 'Using the grid'});
        //await usingTheGridForm.getByLabel('Option 1').check({force: true});

        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true});
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked();
        await expect(usingTheGridForm).toHaveScreenshot();
        // expect(radioStatus).toBeTruthy();
        // await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked();

        // await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true});
        // expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy();
        // expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy();
    })
})

test('Checkboxes', async ({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true});
    await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true});   

    const allBoxes = page.getByRole('checkbox');
    //El metodo all() devuelve un array de elementos que coinciden con el selector
    for (const box of await allBoxes.all()) {
        await box.uncheck({force: true});
        expect(await box.isChecked()).toBeFalsy();
    }

})

test('list. and dropdowns', async ({page}) => {

    const dropDownMenu = page.locator('ngx-header nb-select');
    await dropDownMenu.click();

    page.getByRole('list') //When the list has a UL tag
    page.getByRole('listbox') //When the list has a UL tag with role="listbox"

    //const optionList = page.getByRole('list').locator('nb-option');
    const optionList = page .locator('nb-option-list nb-option');
    await expect(optionList).toHaveText(['Light','Dark', 'Cosmic', 'Corporate']);

    await optionList.filter({hasText: "Cosmic"}).click();
    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

  
    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"   
    }

    await dropDownMenu.click();
    for (const color in colors){
        await optionList.filter({hasText: color}).click();
        await expect(header).toHaveCSS('background-color', colors[color]);
        if (color != "Corporate")
            await dropDownMenu.click();

    }

})

test('tooltips', async({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click(); 

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"});
    await toolTipCard.getByRole('button', {name: "Top"}).hover();

    page.getByRole('tooltip') //if you have a role tooltip created
    const tooltip = await page.locator('nb-tooltip').textContent();
    expect(tooltip).toEqual('This is a tooltip');
    
})

test('dialog box', async({page}) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();
    
    //Por defecto playwright cancela un diagolo que se abra
    //Para aceptar el mensaje del dialogo, utilizamos el siguiente listener
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept();
    })
    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    //Una vez que se borro, hacemos una asercion para verificar que efectivamente fue borrado.
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');

})

test('web tables', async({page}) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    //1 get the row by any test in this row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"});
    await targetRow.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('Age').clear();
    await page.locator('input-editor').getByPlaceholder('Age').fill('35');
    await page.locator('.nb-checkmark').click();

    //2 get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click();
    const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click();

    await page.locator('input-editor').getByPlaceholder('E-mail').clear();
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com');
    await page.locator('.nb-checkmark').click();
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    //3 test filter of the table
    const ages = ["20", "38", "48", "200"]
    for (let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear();
        await page.locator('input-filter').getByPlaceholder('Age').fill(age);
        await page.waitForTimeout(500)

        //Obteniendo todas las coincidencias del resultado
        const ageRows = page.locator('tbody tr')
        //Iterando entre los registros de cada resultado
        for(let row of await ageRows.all()){
            //Obteniendo la ultima columna del resultado, array
            const cellValue = await row.locator('td').last().textContent()

            if(age == "200"){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } 
            else {
                //Haciendo la asercion con el valor obtenido
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('datepicker', async({page}) => {

    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    let date = new Date();
    date.setDate(date.getDate() + 300) //Set the date to tomorrow
    const expectedDate = date.getDate().toString()

    const expectedMonthShort = date.toLocaleString('En-Us', { month: 'short' });
    const expectedMonthLong = date.toLocaleString('En-Us', { month: 'long' });
    //The month is returned in short format, so we need to convert it to long format
    const exoectedYear = date.getFullYear();
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${exoectedYear}`;

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    const expectedMonthAndYear = `${expectedMonthLong} ${exoectedYear}`;
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    }
    //await page.locator('[class="day-cell ng-star-inserted"]').getByText('14').click()
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)

})

test('sliders', async({page}) => {
    //Update attribute to the slider
    //const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    // await tempGauge.evaluate( node => {
    //     node.setAttribute('cx', '232.630');
    //     node.setAttribute('cy', '232.630');
    // })
    // await tempGauge.click();

    //Mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded();

    const box = await tempBox.boundingBox();
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 100, y);
    await page.mouse.move(x+100, y + 100);
    await page.mouse.up();

    await expect(tempBox).toHaveText(' 30 Celsius');

})

