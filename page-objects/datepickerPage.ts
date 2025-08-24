import {Page, expect} from '@playwright/test';
import { HelperBase } from './helperBase';

export class DatepickerPage extends HelperBase{

    constructor(page: Page) {
        super(page);
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        
            const calendarInputField = this.page.getByPlaceholder('Form Picker')
            await calendarInputField.click()
            const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday);
            await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatepickerWithRangeFromToday(startDaysFromToday: number, endDaysFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()

        const dateToAssertStart = await this.selectDateInTheCalendar(startDaysFromToday);
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDaysFromToday);

        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`;

        await expect(calendarInputField).toHaveValue(dateToAssert)
    }



    private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
            let date = new Date();
            date.setDate(date.getDate() + numberOfDaysFromToday) //Set the date to tomorrow
            const expectedDate = date.getDate().toString()
        
            const expectedMonthShort = date.toLocaleString('En-Us', { month: 'short' });
            const expectedMonthLong = date.toLocaleString('En-Us', { month: 'long' });
            //The month is returned in short format, so we need to convert it to long format
            const exoectedYear = date.getFullYear();
            const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${exoectedYear}`;
        
            let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
            const expectedMonthAndYear = `${expectedMonthLong} ${exoectedYear}`;
            while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
                await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
                calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
            }
            //await page.locator('[class="day-cell ng-star-inserted"]').getByText('14').click()
            await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).click()
            return dateToAssert;
    }
}
