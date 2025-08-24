import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}, testInfo) => {
    await page.goto(process.env.URL);
    await page.getByText('Button Triggering AJAX Request').click();
    testInfo.setTimeout(testInfo.timeout + 2000); // Increase timeout for this test

})

test('Auto waiting for AJAX requests', async ({page}) => {
    const successButton = page.locator('.bg-success');
    //await successButton.click();

    //const text = await successButton.textContent();
    // await successButton.waitFor({state: 'attached'});
    // const text = await successButton.allTextContents();

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000});

})

test.skip('alternative waits', async ({page}) => {

    const successButton = page.locator('.bg-success');

    //wait for element
    //await page.waitForSelector('.bg-success')

    //wait for particular response
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //wait for network calls to be completed (NOT RECOMMENDED)
    await page.waitForLoadState('networkidle');
    
    
    const text = await successButton.allTextContents();
    expect(text).toContain('Data loaded with AJAX get request.');


})

test.skip('timeouts', async ({page}) => {
    //test.setTimeout(10000); // 10 seconds, the value by default is 30 seconds
    test.slow(); //Multiply the timeout by 3
    const successButton = page.locator('.bg-success');

    await successButton.click({timeout: 16000}); // 5 seconds, the value by default is 0 (no timeout)

})