import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';
//Se limpia, elimina todo lo que es necesario, lo que ya sabemos que tiene un valor por defecto, no es necesario especificarlo

require('dotenv').config(); // Automatically loads .env file in the root directory

export default defineConfig<TestOptions>({
  timeout: 40000, // 10 seconds, the value by default is 30 seconds
  // globalTimeout: 60000, // 60 seconds, the value by default is 90 seconds
  expect: {
    timeout: 2000,
    toMatchSnapshot: {maxDiffPixels: 50} // 2 seconds, the value by default is 5000 milliseconds
  },
  retries: 1,
  // /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['json', { outputFile: 'test-results/jsonReport.json'}],
    ['junit', { outputFile: 'test-results/junitReport.xml'}],
    //['allure-playwright'],
    ['html']
  ],
  use: {
    // baseURL: 'http://localhost:4200/',
    // viewport: { width: 720, height: 1080 },
     globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
     baseURL: process.env.DEV === '1' ? 'http://localhost:4200/'
      : process.env.STAGING == '1' ? 'http://localhost:4202/' 
      : 'http://localhost:4200/',

    trace: 'on-first-retry',
    actionTimeout: 20000, // 5 seconds, the value by default is 0 (no timeout)
    navigationTimeout: 25000,// 10 seconds, the value by default is
    video: {mode: 'off',
      size: { width: 1920, height: 1080 } // Set video size
    },
  },

  projects: [
    {name: 'dev', 
      use: { ...devices['Desktop Chrome'], 
      baseURL: 'http://localhost:4200/' }
    },
    {
      name: 'chromium',
      // use: { ...devices['Desktop Chrome']}
    },

    {
      name: 'firefox',
      use: { browserName: 'firefox',
        video: {
          mode:'off',
          size: { width: 1920, height: 1080 } // Set video size
        }
       }
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 13 Pro Max'],
        //viewport: { width: 414, height: 800 },
      }}
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200'
  }
});
