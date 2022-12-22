/// <reference types="Cypress" />
/// <reference types="cypress-iframe" />
/// <reference types="cypress-xpath" />

import 'cypress-iframe'
import 'cypress-xpath'

import taskpage from '../support/PageObjects/taskpage'




before(() => {


    cy.fixture("../fixtures/testdata.json").as("data");
    cy.get("@data").then((data) => {


        Cypress.Commands.add('accepttask', () => {

            const taskPage = new taskpage()
            taskPage.accptTaskActBtn().eq(0).click()
            cy.wait(1000)
            taskPage.accpttaskBtn().click({force: true})
            cy.wait(1000)
            cy.get('.e-toast-content').should('have.text', 'Task Accepted.')
            cy.wait(1000)
            taskPage.accptCloseBtn().click({force: true})
            cy.wait(1000)
            taskPage.tasksavBtn().click({force: true})
            cy.wait(1000)
            taskPage.taskCloseBtn().click()

        })

        Cypress.Commands.add('rejecttask', () => {

            const taskPage = new taskpage()

            taskPage.accptTaskActBtn().eq(0).click()
            cy.wait(1000)
            taskPage.rejctTaskActBtn().click({force: true})
            cy.wait(1000)
            taskPage.rejctTaskCmnt().type("rejecting task")
            taskPage.rejctTaskBtn().click()
            cy.wait(1000)
            cy.get('.e-toast-content').should('have.text', 'Task Rejected')
            cy.wait(1000)
            taskPage.accptCloseBtn().click({force: true})
            cy.wait(1000)
            taskPage.tasksavBtn().click()
            cy.wait(1000)
            taskPage.taskCloseBtn().click()

        })


    })

})
