const { test, expect } = require("@playwright/test");


test("Salesforce application automation using playwright and Javascript", async ({ page }) => {
    //Login Automation:
    //Getting URl, username and password from enviornment file
    await page.goto(process.env.url);
    await page.getByLabel('Username').fill(process.env.userName);
    await page.getByLabel('Password').fill(process.env.password);
    await page.getByRole('button', { name: 'Log In' }).click();

    //Navigate and Interact:
    const homeTab = await page.getByRole('tab', { name: 'Home' });
    await expect(homeTab).toBeVisible();
    await page.getByRole('button', { name: 'App Launcher' }).click();
    const searchInputs = await page.getByPlaceholder('Search apps and items...');
    await searchInputs.fill("leads");
    await page.click('a[data-label="Leads"]');
    await page.waitForLoadState('load');
    const myLeads = await page.getByText('My Leads');
    await expect(myLeads).toBeVisible();
    await page.getByRole('button', { name: 'Show filters' }).click();
    await page.getByRole('link', { name: 'Created Date greater or equal' }).click();
    const endDate = await page.getByLabel('*End Date');
    await endDate.click();
    await page.getByRole('button', { name: 'Today', exact: true }).click();
    await page.getByRole('button', { name: 'Done' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    const verifyItems = page.getByText('22 items • Filtered by');
    await expect(verifyItems).toBeVisible();

    // Lead Interaction and Task Creation:
    await page.getByRole('link', { name: 'Betty Bair' }).click();
    await page.getByLabel('New Task').click();
    await page.getByLabel('Subject').fill('Create Budget Plan');
    await page.getByLabel('Due Date').click();
    await page.getByRole('button', { name: 'Today' }).click();
    await page.getByRole('option', { name: 'In Progress' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('[id*="toastDescription"]')).toContainText('Task "Create Budget Plan" was created.');
    await page.getByLabel('New Task').click();
    await page.getByLabel('New Task').click();
    await page.getByLabel('Subject').fill('Submit Budget Plan for Review');
    await page.getByLabel('Due Date').click();
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const day = String(nextWeek.getDate()).padStart(2, '0');
    await page.getByRole('button', { name: `${day}` }).click(); //Getting date to choose from date picker
    await page.getByRole('option', { name: 'Not Started' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('[id*="toastDescription"]')).toContainText('Task "Submit Budget Plan for Review" was created.');

    //Activity Tab and Task Validation:
    await expect(page.locator('[id*="upcoming-activities-section-"]')).toHaveText('Create Budget Plan');
    await expect(page.locator('[id*="upcoming-activities-section-"]')).toHaveText('Submit Budget Plan for Review');
    await expect(page.locator('[id*="recordLayoutPlaceholder-"]')).toHaveText('Description');
    await page.locator('[id*="upcoming-activities-section"]').filter({ hasText: /^Create Budget Plan$/ }).click();
    await page.getByLabel('Highlights panel header').getByRole('button', { name: 'Edit Comments' }).click();
    await page.getByLabel('Comments', { exact: true }).click();
    await page.getByLabel('Comments', { exact: true }).fill('Budget for Q4');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.goBack();
    await page.locator('[id*="upcoming-activities-section"]').filter({ hasText: 'Details for Create Budget Plan' }).click();
    await page.locator('[id*="recordLayoutPlaceholder"]').toHaveText('Budget for Q4');
    await page.getByTitle('Timeline Settings').click();
    await page.locator('label').filter({ hasText: 'Next 7 days' }).locator('span').nth(1).click();
    await page.getByRole('button', { name: 'Apply', exact: true }).click();
    await expect(page.locator('[id*="upcoming-activities-section"]')).toContainText('Create Budget Plan');
    await page.getByText('View More', { exact: true }).click();
    await expect(page.locator('[id*="upcoming-activities-section"]')).toContainText('Create Budget Plan');
    await expect(page.locator('[id*="upcoming-activities-section"]')).toContainText('Submit Budget Plan for Review');
})