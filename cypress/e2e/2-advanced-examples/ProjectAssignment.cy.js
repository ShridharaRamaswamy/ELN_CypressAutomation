/// <reference types="Cypress" />
/// <reference types="cypress-iframe" />
/// <reference types="cypress-xpath" />

import 'cypress-iframe'
import 'cypress-xpath'



import loginpage from '../../support/PageObjects/loginpage'
import projectpage from '../../support/PageObjects/projectpage'
import logoutpage from '../../support/PageObjects/logoutpage'





describe('ELN Project Assignment Suite', function () {

    this.beforeAll(function () {
        cy.clearLocalStorage()
        cy.removeLocalStorage()
        cy.login(Cypress.env('email'), Cypress.env('password'))
        cy.wait(3000)
    })

    this.beforeEach(function () {
        cy.fixture('testdata').then(function (data) {
            this.data = data
        })
        cy.restoreLocalStorage()

    })
    this.afterAll(function () {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.removeLocalStorage()

    })

    this.afterEach(function () {
        cy.saveLocalStorage()
    })



    it('TC43_ELN_Validate Single User for project Assignment', function () {
        const projectPage = new projectpage()
        cy.addProjwithcollaborator(this.data.TC43.name, this.data.TC43.priority, this.data.TC43.collaboratorlist)
        projectPage.validateProjectName().eq(0).then(function (element) {
            const actualText = element.text()
            var actualText1 = actualText.split('-')
            cy.log(actualText1[0])
            cy.log(actualText1[1].trim())
            var projID = actualText1[1].trim()
            expect(actualText.includes(this.data.TC43.name)).to.be.true
            cy.log(projID)
            projectPage.closeBtn().click()

        })

        cy.Filtering(this.data.TC43.name, this.data.TC43.name, this.data.all.loc_Projname)

        cy.DeleteProj(this.data.TC43.name)

    })


    it('TC44_ELN_Multiple Users Project Assignment', function () {
        const projectPage = new projectpage()
        cy.addProjwithcollaborator(this.data.TC44.name, this.data.TC44.priority, this.data.TC44.collaboratorlist, "user")
        projectPage.validateProjectName().eq(0).then(function (element) {
            const actualText = element.text()
            var actualText1 = actualText.split('-')
            cy.log(actualText1[0])
            cy.log(actualText1[1].trim())
            var projID = actualText1[1].trim()
            expect(actualText.includes(this.data.TC44.name)).to.be.true
            cy.log(projID)
            projectPage.closeBtn().click()

        })

        cy.Filtering(this.data.TC44.name, this.data.TC44.name, this.data.all.loc_Projname)
        cy.DeleteProj(this.data.TC44.name)

    })

    it('TC45_ELN_Single User Group selection', function () {
        const projectPage = new projectpage()
        cy.addProjwithcollaborator(this.data.TC45.name, this.data.TC45.priority, this.data.TC45.grouplist, "group")
        projectPage.validateProjectName().eq(0).then(function (element) {
            const actualText = element.text()
            var actualText1 = actualText.split('-')
            cy.log(actualText1[0])
            cy.log(actualText1[1].trim())
            var projID = actualText1[1].trim()
            expect(actualText.includes(this.data.TC45.name)).to.be.true
            cy.log(projID)
            projectPage.closeBtn().click()

        })
        cy.Filtering(this.data.TC45.name, this.data.TC45.name, this.data.all.loc_Projname)
        cy.DeleteProj(this.data.TC45.name)

    })


    it('TC46_ELN_verify maxiumum Number of users assigned to Project', function () {
        const projectPage = new projectpage()
        cy.addProjwithcollaborator(this.data.TC46.name, this.data.TC46.priority, this.data.TC46.collaboratorlist, "all")
        projectPage.validateProjectName().eq(0).then(function (element) {
            const actualText = element.text()
            var actualText1 = actualText.split('-')
            cy.log(actualText1[0])
            cy.log(actualText1[1].trim())
            var projID = actualText1[1].trim()
            expect(actualText.includes(this.data.TC46.name)).to.be.true
            cy.log(projID)
            projectPage.closeBtn().click()

        })
        cy.Filtering(this.data.TC46.name, this.data.TC46.name, this.data.all.loc_Projname)
        cy.DeleteProj(this.data.TC46.name)

    })

    it('TC47_ELN_Edit Project - Add users', function () {
        const projectPage = new projectpage()
        cy.addProjwithcollaborator(this.data.TC47.name, this.data.TC47.priority, this.data.TC47.collaboratorlist, "user")
        projectPage.validateProjectName().eq(0).then(function (element) {
            const actualText = element.text()
            var actualText1 = actualText.split('-')
            cy.log(actualText1[0])
            cy.log(actualText1[1].trim())
            var projID = actualText1[1].trim()
            expect(actualText.includes(this.data.TC47.name)).to.be.true
            cy.log(projID)
            projectPage.closeBtn().click()
            cy.Updatecollbarator(this.data.TC47.name, this.data.TC47.editlist,"user")

        })
        cy.Filtering(this.data.TC47.name, this.data.TC47.name, this.data.all.loc_Projname)
        cy.DeleteProj(this.data.TC47.name)

    })

    it('TC48_ELN_Edit Project - Add group', function () {
        const projectPage = new projectpage()
        cy.addProjwithcollaborator(this.data.TC48.name, this.data.TC48.priority, this.data.TC48.collaboratorlist, "user")
        projectPage.validateProjectName().eq(0).then(function (element) {
            const actualText = element.text()
            var actualText1 = actualText.split('-')
            cy.log(actualText1[0])
            cy.log(actualText1[1].trim())
            var projID = actualText1[1].trim()
            expect(actualText.includes(this.data.TC48.name)).to.be.true
            cy.log(projID)
            projectPage.closeBtn().click()
            cy.Updatecollbarator(this.data.TC48.name, this.data.TC48.editlist, "group")

        })
        cy.Filtering(this.data.TC48.name, this.data.TC48.name, this.data.all.loc_Projname)
        cy.DeleteProj(this.data.TC48.name)

    })
    it('TC49_ELN_Remove Users - Project page', function () {
        const projectPage = new projectpage()
        cy.addProjwithcollaborator(this.data.TC49.name, this.data.TC49.priority, this.data.TC49.grouplist, "group")
        projectPage.validateProjectName().eq(0).then(function (element) {
            const actualText = element.text()
            var actualText1 = actualText.split('-')
            cy.log(actualText1[0])
            cy.log(actualText1[1].trim())
            var projID = actualText1[1].trim()
            expect(actualText.includes(this.data.TC49.name)).to.be.true
            cy.log(projID)
            projectPage.closeBtn().click()


        })
        cy.removecollabarator(this.data.TC49.name)
        cy.Filtering(this.data.TC49.name, this.data.TC49.name, this.data.all.loc_Projname)

        cy.DeleteProj(this.data.TC49.name)

    })
    it('TC50_ELN_Validation_Filter using User Groups - Project Assignment page ', function () {
        const projectPage = new projectpage()

        projectPage.clickProject().click()
        cy.wait(2000)
        projectPage.addProject().click()
        cy.wait(1000)
        projectPage.enterProjectName().type(this.data.TC50.name)
        cy.get(':nth-child(2) > .select').select(this.data.all.Project_Owner)
   

        cy.addgroupCollaborator(this.data.TC50.grouplist)
        cy.wait(2000)
        projectPage.selectgroup().then(function (elem) {

            expect(elem.length).not.equal(0)
            cy.wait(3000)
            projectPage.collaboratorCloseBtn().click({ force: true })

        })

        
        projectPage.clickProject().click()
        cy.wait(2000)
        projectPage.deletebtnYes().click()
        cy.wait(2000)
        
    })

    it('TC51_ELN_Error_Filter with invalid collabarator and group', function () {
        const projectPage = new projectpage()

        projectPage.clickProject().click()
        cy.wait(2000)
        projectPage.addProject().click()
        cy.wait(1000)
        projectPage.enterProjectName().type(this.data.TC51.name)
        cy.get(':nth-child(2) > .select').select(this.data.all.Project_Owner)
        cy.get(':nth-child(3) > .select').select(this.data.all.Project_Manager)

        projectPage.addcollborator().click()
        cy.wait(4000)

        projectPage.searchgroup().click()
        projectPage.searchgroup().type(this.data.TC51.invalidname)
        cy.wait(5000)
        projectPage.errorMsg().eq(0).should('have.text', 'No User Group Available')
        projectPage.searchgroup().clear()
        cy.wait(3000)

        projectPage.searchbox().click()
        projectPage.searchbox().type(this.data.TC51.invalidname)
        cy.wait(5000)
        projectPage.errorMsg().eq(0).should('have.text', 'No Users Available')
        projectPage.searchbox().clear()
        cy.wait(3000)


        projectPage.errorMsg().eq(0).should('have.text', 'No Collaborator selectedPlease Select Collaborator')

        projectPage.collaboratorCloseBtn().click()
        cy.wait(1000)
        projectPage.clickProject().click()
        cy.wait(1000)
        projectPage.deletebtnYes().click()
        cy.wait(1000)

    })

    it('TC52_ELN_Validation_Reset Collabarator Assignment', function () {
        const projectPage = new projectpage()

        projectPage.clickProject().click()
        cy.wait(2000)
        projectPage.addProject().click()
        cy.wait(1000)
        projectPage.enterProjectName().type(this.data.TC51.name)
        cy.get(':nth-child(2) > .select').select(this.data.all.Project_Owner)
        cy.get(':nth-child(3) > .select').select(this.data.all.Project_Manager)

        cy.addCollaborator(this.data.TC51.collaboratorlist)
        projectPage.resetbtn().click()
        projectPage.deletebtnYes().click()

        projectPage.collaboratorCount().should('have.text', "+0")

        projectPage.clickProject().click()
        

       
    })




})

