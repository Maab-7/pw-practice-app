import {expect, test} from '@playwright/test';

test('applitools VIsual test', async ({page}) => {
  await page.goto('/');
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();
});