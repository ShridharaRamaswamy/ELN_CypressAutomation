const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "ys5o1g",
  reporter: "cypress-mochawesome-reporter",

  reporterOptions: {
    charts: true,
    reportPageTitle: "ELN Automation Suite",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: false,
    html: false,
    json: true,
  },

  e2e: {
    testIsolation: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here

      require("cypress-localstorage-commands/plugin")(on, config);
      require("cypress-mochawesome-reporter/plugin")(on, config);

      return config;
    },
  },
  requestTimeout: 15000,
  defaultCommandTimeout: 60000,
  pageLoadTimeout: 450000,
  video: false,

  chromeWebSecurity: false,

  env: {
    // url: "http://cloud.msa2.apps.yokogawa.build/eln-webapp/elndev/",
    url: "http://cloud.msa2.apps.yokogawa.build/eln-webapp-test/elndev/",
    email: "shridhara.ramaswamy@yokogawa.com",
    password: "June@2022",
  },

  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 1,
  },
});
