// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands'

import './commands'
import 'cypress-localstorage-commands'
import 'cypress-mochawesome-reporter/register'
import '@4tw/cypress-drag-drop'
import 'cypress-file-upload'
const registerCypressGrep = require('@cypress/grep')
registerCypressGrep()
import 'cypress-plugin-xhr-toggle'

// Alternatively you can use CommonJS syntax:
// require('./commands')


