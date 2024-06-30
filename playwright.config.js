import { defineConfig } from '@playwright/test';

export default defineConfig({
    
  use: {
    browserName: 'chromium', // This includes both Chrome and Edge
    channel: 'chrome', // To run scripts in Chrome browser
    headless: false, // To run scripts in headed mode
  },
  projects: [
    {
      name: 'chrome',
      use: {
        channel: 'chrome',
      },
    },
  ],
  reporter: [['list'], ['html', { outputFolder: 'test-results', open: 'never' }]]
});