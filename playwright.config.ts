import { defineConfig, devices } from '@playwright/test';
import * as os from "node:os";
import { defineBddConfig } from "playwright-bdd";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

const defTestDir = "./e2e/playwright-tests";
const defOutDir = "./playwright-test-results";
const setupDir = "./e2e/playwright-tests/setup";

// Todo introduce gherkin into config
// https://vitalets.github.io/playwright-bdd/#/blog/whats-new-in-v8?id=improved-configuration-options
// Todo introduce advanced timeouts into config
// Todo introduce storageState into config

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: defTestDir,
  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: defOutDir,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [["list"], ["github"],
    ["allure-playwright",
      {
        resultsDir: defOutDir + "/allure-results",
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ],
  ]: [["list"],
        ["allure-playwright",
          {
            resultsDir: defOutDir + "/allure-results",
            detail: true,
            suiteTitle: true,
            environmentInfo: {
              os_platform: os.platform(),
              os_release: os.release(),
              os_version: os.version(),
              node_version: process.version,
            },
          },
        ],
      ],

  // globalSetup for: Locale Determination
  globalSetup: require.resolve(setupDir + "/global-setup.ts"),

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    // Capture screenshot after each test failure. 'off', 'on' and 'only-on-failure'
    screenshot: 'only-on-failure',

    // Record trace only when retrying a test for the first time. 'off', 'on', 'retain-on-failure' and 'on-first-retry'
    trace: 'on-first-retry',

    // Record video only when retrying a test for the first time. 'off', 'on', 'retain-on-failure' and 'on-first-retry'
    video: 'retain-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'preconditions',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*preconditions.ts/,
      retries: 0,
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['preconditions'],
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['preconditions'],
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['preconditions'],
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
