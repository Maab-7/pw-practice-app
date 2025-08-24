import {Page} from '@playwright/test';
import { HelperBase } from './helperBase';
export class NavigationPage extends HelperBase{

    constructor(page: Page){
        super(page);
    }

    async formLayoutsPage() {
        await this.selectGroupMenuOption('Forms');
        await this.page.getByText('Form Layouts').click();
        await this.waitForNumberOfSeconds(2);
    }

    async datepickerPage() {
        await this.selectGroupMenuOption('Forms');
        //await this.page.waitForTimeout(1000);
        await this.page.getByText('Datepicker').click();
    }

    async smartTablePage() {
        await this.selectGroupMenuOption('Tables & Data');
        await this.page.getByText('Smart Table').click();
    }

    async toastrPage() {
        await this.selectGroupMenuOption('Modal & Overlays');
        await this.page.getByText('Toastr').click();
    }

    async tooltipPage() {
        await this.page.getByText('Modal & Overlays').click();
        await this.page.getByText('Tooltip').click();
    }
    private async selectGroupMenuOption(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle);
        const expandedState = await groupMenuItem.getAttribute('aria-expanded');
        if (expandedState == 'false') {
            await groupMenuItem.click();
        }
    }
}