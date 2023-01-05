/// <reference types="Cypress" />
/// <reference types="cypress-iframe" />
/// <reference types="cypress-xpath" />

import 'cypress-iframe'
import 'cypress-xpath'



import loginpage from '../../support/PageObjects/loginpage'
import projectpage from '../../support/PageObjects/projectpage'
import logoutpage from '../../support/PageObjects/logoutpage'


describe('ELN Project Suite', function () {

    this.beforeAll(function () {

        // cy.clearLocalStorage()
        // cy.removeLocalStorage()
        cy.login(Cypress.env('email'), Cypress.env('password'))
        cy.wait(4000)
        // cy.testdatacreation()
        // cy.testdatadeletion()

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


    it('TC01_ELN_Addition of Project', function () {

        cy.wait(3000)
        const projectPage = new projectpage()
        cy.CreateProj(this.data.TC01.name, this.data.TC01.priority)
        projectPage.validateProjectName().eq(0).then(function (element) {
            const actualText = element.text()
            var actualText1 = actualText.split('-')
            cy.log(actualText1[0])
            cy.log(actualText1[1].trim())
            var projID = actualText1[1].trim()
            expect(actualText.includes(this.data.TC01.name)).to.be.true
            cy.log(projID)
            projectPage.closeBtn().click()

        })

    })

    it('TC02_ELN_Edit of Project', function () {
        const projectPage = new projectpage()
        cy.get('a[href="/eln-webapp-test/elndev/dashboard"]').click()
        cy.Updateproj(this.data.TC01.name)
        cy.Filtering(this.data.TC02.updatedname, this.data.TC02.updatedname, this.data.TC02.col_locator)
        cy.wait(3000)
        projectPage.selectProject().eq(1).click()

        projectPage.validateProjectName().eq(0).then(function (element) {
            const actualText = element.text()
            expect(actualText.includes('update')).to.be.true

        })

    })

    it('TC03_ELN_Delete of Project', function () {
        const projectPage = new projectpage()
        cy.Filtering(this.data.TC01.name, this.data.TC02.updatedname, this.data.TC02.col_locator)
        cy.DeleteProj(this.data.TC01.name)

    })

    it('TC04_ELN_Validating Project Name Filed length', function () {
        const projectPage = new projectpage()
        projectPage.clickProject().click()
        projectPage.addProject().click()
        var repeat = function (str, count) {
            var array = [];
            for (var i = 0; i <= count;)
                array[i++] = str;
            return array.join('');
        }
        var repeatedCharacter = repeat("a", 130);
        let result = repeatedCharacter.slice(0, 128);

        projectPage.enterProjectName().type(repeatedCharacter)
        projectPage.enterProjectName().should('have.value', result)

        projectPage.clickProject().click()
        projectPage.dialogbtn().click()

    })

    it('TC05_ELN_Validating Project Description Filed length', function () {
        const projectPage = new projectpage()
        projectPage.clickProject().click()
        projectPage.addProject().click()
        var repeat = function (str, count) {
            var array = [];
            for (var i = 0; i <= count;)
                array[i++] = str;
            return array.join('');
        }
        var repeatedCharacter = repeat("a", 4500);
        let result = repeatedCharacter.slice(0, 4000);

        projectPage.enterDescription().type(repeatedCharacter)
        projectPage.enterDescription().should('have.value', result)
        projectPage.clickProject().click()
        projectPage.dialogbtn().click()

    })


    it('TC06_ELN_Validating addition of 10 Tags', function () {
        const projectPage = new projectpage()
        projectPage.clickProject().click()
        projectPage.addProject().click()
        cy.AddTag(10)
        projectPage.enterTagName().type(this.data.TC06.tagname)
        projectPage.tagerror().should('have.text', 'Maximum 10 tags allowed')

        projectPage.clickProject().click()
        projectPage.dialogbtn().click()

    })

    it('TC07_ELN_Validating addition of duplicate Tags', function () {
        const projectPage = new projectpage()
        projectPage.clickProject().click()
        projectPage.addProject().click()
        cy.AddTag(1)
        projectPage.enterTagName().type(this.data.TC07.tagname)
        projectPage.addTagBtn().click()
        projectPage.tagerror().should('have.text', 'Tag already added')

        projectPage.clickProject().click()
        projectPage.dialogbtn().click()

    })

    it('TC08_ELN_Validating Start Date', function () {
        const projectPage = new projectpage()
        const dayjs = require('dayjs')
        projectPage.clickProject().click()
        projectPage.addProject().click()
        projectPage.enterProjectName().type(this.data.TC01.name)
        projectPage.enterStartDate().clear()
        cy.get(':nth-child(2) > .select').select(this.data.all.Project_Owner)
        cy.get('.error > span').should('have.text', 'Start Date is required')
        projectPage.enterStartDate().clear()
        projectPage.enterStartDate().type(dayjs().add(2, 'day').format('DD-MM-YYYY'))
        cy.wait(2000)
        projectPage.enterDueDate().clear()
        projectPage.enterDueDate().type(dayjs().add(1, 'day').format('DD-MM-YYYY'))
        cy.get(':nth-child(2) > .select').select(this.data.all.Project_Owner)
        cy.get('.errorwrap > :nth-child(2)').should('have.text', 'Start date must be less than Due date ')


        projectPage.enterStartDate().clear()
        projectPage.enterStartDate().type(dayjs().format('01012030'))
        cy.get(':nth-child(2) > .select').select(this.data.all.Project_Owner)
        cy.get('.errorwrap > :nth-child(2)').should('have.text', 'Not a valid date format')

        projectPage.clickProject().click()
        projectPage.dialogbtn().click()

    })

    it('TC09_ELN_Validating Due Date', function () {
        const projectPage = new projectpage()
        projectPage.clickProject().click()
        projectPage.addProject().click()
        projectPage.enterProjectName().type(this.data.TC01.name)
        projectPage.enterDueDate().clear()
        cy.get(':nth-child(2) > .select').select(this.data.all.Project_Owner)
        cy.get('.error > span').should('have.text', 'Due Date is required')
        projectPage.enterStartDate().clear()
        projectPage.enterStartDate().type(this.data.TC09.dd)
        cy.wait(2000)
        // projectPage.enterDueDate().clear()
        // projectPage.enterDueDate().type(this.data.TC09.dd)
        // cy.get(':nth-child(2) > .select').select('Owner Name')
        // cy.get('.error > span').should("have.text", "Due date must be greater than or equal to start date and today's date. ")

        projectPage.enterDueDate().clear()
        projectPage.enterDueDate().type('01012030')
        cy.get(':nth-child(2) > .select').select(this.data.all.Project_Owner)
        cy.get('.errorwrap > :nth-child(2)').should('have.text', 'Not a valid date format')

        projectPage.clickProject().click()
        projectPage.dialogbtn().click()


    })

    it('TC10_ELN_Validating Project Name Blank Error', function () {
        const projectPage = new projectpage()
        projectPage.clickProject().click()
        projectPage.addProject().click()
        projectPage.enterProjectName().click()
        cy.get(':nth-child(2) > .select').select(this.data.all.Project_Owner)
        cy.get('.error > span').should('have.text', 'Project Name is required')

        projectPage.clickProject().click()
        projectPage.dialogbtn().click()

    })

    it('TC11_ELN_Validating Project Description Blank Error', function () {
        const projectPage = new projectpage()
        projectPage.clickProject().click()
        projectPage.addProject().click()
        projectPage.enterDescription().click()
        cy.get(':nth-child(2) > .select').select(this.data.all.Project_Owner)
        cy.get('.error > span').should('have.text', 'Project Objective is required')

        projectPage.clickProject().click()
        projectPage.dialogbtn().click()

    })


    it('TC12_ELN_Addition of Low Priority Project', function () {
        cy.CreateProj(this.data.TC12.name, this.data.TC12.priority)
        cy.Filtering(this.data.TC12.name, this.data.TC12.priority, this.data.all.loc_priority)
        cy.DeleteProj(this.data.TC12.name)

    })

    it('TC13_ELN_Addition of Medium Priority Project', function () {
        cy.CreateProj(this.data.TC13.name, this.data.TC13.priority)
        cy.Filtering(this.data.TC13.name, this.data.TC13.priority, this.data.all.loc_priority)
        cy.DeleteProj(this.data.TC13.name)

    })

    it('TC14_ELN_Addition of High Priority Project', function () {
        cy.CreateProj(this.data.TC14.name, this.data.TC14.priority)
        cy.Filtering(this.data.TC14.name, this.data.TC14.priority, this.data.all.loc_priority)
        cy.DeleteProj(this.data.TC14.name)


    })

    it('TC15_ELN_Addition of Urgent Priority Project', function () {
        cy.CreateProj(this.data.TC15.name, this.data.TC15.priority)
        cy.Filtering(this.data.TC15.name, this.data.TC15.priority, this.data.all.loc_priority)
        cy.DeleteProj(this.data.TC15.name)

    })

    it('TC16_ELN_Addition of Duplicate Project', function () {
        cy.CreateProj(this.data.TC16.name, this.data.TC16.priority)
        cy.duplicateProj(this.data.TC16.samename, this.data.TC16.priority)
        cy.Filtering(this.data.TC16.name, this.data.TC16.name, this.data.all.loc_Projname)
        cy.DeleteProj(this.data.TC16.name)

    })

    it('TC17_ELN_Status validation', function () {

        const projectPage = new projectpage()

        cy.CreateProj(this.data.TC17.name, this.data.TC17.priority)
        projectPage.validateProjectName().eq(0).then(function (element) {
            const actualText = element.text()
            let actualText1 = actualText.split('-')
            cy.log(actualText1[0])
            cy.log(actualText1[1].trim())
            expect(actualText.includes('Status')).to.be.true
            projectPage.closeBtn().click()

            cy.Filtering(actualText1[0].trim(), this.data.TC17.state1, this.data.all.loc_state)
            cy.Statuchange(actualText1[0].trim(), this.data.TC17.state1, this.data.TC17.check_loc, this.data.TC17.state2)
            cy.Filtering(actualText1[0].trim(), this.data.TC17.state2, this.data.all.loc_state)



            cy.Statuchange(actualText1[0].trim(), this.data.TC17.state2, this.data.TC17.check_loc, this.data.TC17.state3)
            cy.Filtering(actualText1[0].trim(), this.data.TC17.state3, this.data.all.loc_state)



            cy.Statuchange(actualText1[0].trim(), this.data.TC17.state3, this.data.TC17.check_loc, this.data.TC17.state4)
            cy.Filtering(actualText1[0].trim(), this.data.TC17.state4, this.data.all.loc_state)

            cy.DeleteProj(actualText1[0].trim())


        })

    })

    it('TC18_ELN_Project Name Filter Check with startwith condition', function () {
        cy.FilterCheck(this.data.filtercolumn.project, this.data.filtervalues.tc18, this.data.filtercondition.startwith, this.data.all.loc_Projname)
        cy.clearfilter(this.data.filtercolumn.project)
    })

    it('TC19_ELN_Project Name Filter Check with endwith condition', function () {

        cy.FilterCheck(this.data.filtercolumn.project, this.data.filtervalues.tc19, this.data.filtercondition.endwith, this.data.all.loc_Projname)
        cy.clearfilter(this.data.filtercolumn.project)
    })

    it('TC20_ELN_Project Name Filter Check with contains condition', function () {

        cy.FilterCheck1(this.data.filtercolumn.project, this.data.filtervalues.tc20, this.data.filtercondition.contains, this.data.all.loc_Projname)
        cy.clearfilter(this.data.filtercolumn.project)
    })

    it('TC21_ELN_Project Name Filter Check with equal condition', function () {

        cy.FilterCheck(this.data.filtercolumn.project, this.data.filtervalues.tc21, this.data.filtercondition.equal, this.data.all.loc_Projname)
        cy.clearfilter(this.data.filtercolumn.project)
    })

    it('TC34_ELN_Project ID Filter Check with endwith condition', function () {

        cy.FilterCheck(this.data.filtercolumn.projectid, this.data.filtervalues.tc34, this.data.filtercondition.endwith, this.data.all.loc_id)
        cy.clearfilter(this.data.filtercolumn.projectid)
    })

    it('TC35_ELN_Project ID Filter Check with contains condition', function () {

        cy.FilterCheck(this.data.filtercolumn.projectid, this.data.filtervalues.tc35, this.data.filtercondition.contains, this.data.all.loc_id)
        cy.clearfilter(this.data.filtercolumn.projectid)
    })

    it('TC22_ELN_Priority Filter Check with High condition', function () {

        cy.statecheck(this.data.filtercolumn.priority, this.data.Priority.High, this.data.all.loc_priority)
        cy.clearfilter(this.data.filtercolumn.priority)
    })

    it('TC23_ELN_Priority Filter Check with Low condition', function () {

        cy.statecheck(this.data.filtercolumn.priority, this.data.Priority.Low, this.data.all.loc_priority)
        cy.clearfilter(this.data.filtercolumn.priority)
    })
    it('TC24_ELN_Priority Filter Check with Urgent condition', function () {

        cy.statecheck(this.data.filtercolumn.priority, this.data.Priority.Urgent, this.data.all.loc_priority)
        cy.clearfilter(this.data.filtercolumn.priority)
    })

    it('TC25_ELN_State Filter Check with InProgress condition', function () {

        cy.statecheck(this.data.filtercolumn.State, this.data.State.InProgress, this.data.all.loc_state)
        cy.clearfilter(this.data.filtercolumn.State)
    })

    it('TC26_ELN_State Filter Check with Blocked condition', function () {

        cy.statecheck(this.data.filtercolumn.State, this.data.State.Blocked, this.data.all.loc_state)
        cy.clearfilter(this.data.filtercolumn.State)
    })

    it('TC27_ELN_State Filter Check with Completed condition', function () {

        cy.statecheck(this.data.filtercolumn.State, this.data.State.Completed, this.data.all.loc_state)
        cy.clearfilter(this.data.filtercolumn.State)
    })

    it('TC28_ELN_State Filter Check with Archived condition', function () {

        cy.statecheck(this.data.filtercolumn.State, this.data.State.Archived, this.data.all.loc_state)
        cy.clearfilter(this.data.filtercolumn.State)
    })

    it('TC29_ELN_Start Date Filter Check with Equal condition', function () {
        const dayjs = require("dayjs");
        var sdate = dayjs().format("DD-MM-YYYY")
        cy.FilterCheck(this.data.filtercolumn.StartDate, sdate, this.data.StartDatefiltercondition.equal, this.data.all.loc_sdate)
        cy.clearfilter(this.data.filtercolumn.StartDate)
    })

    it('TC30_ELN_Start Date Filter Check with GreaterThan condition', function () {
        const dayjs = require("dayjs");
        var sdate = dayjs().add(1, 'days').format("DD-MM-YYYY")
        cy.FilterCheck(this.data.filtercolumn.StartDate, sdate, this.data.StartDatefiltercondition.GreaterThan, this.data.all.loc_sdate)
        cy.clearfilter(this.data.filtercolumn.StartDate)
    })

    it('TC31_ELN_Start Date Filter Check with GreaterThanEqual condition', function () {
        const dayjs = require("dayjs");
        var sdate = dayjs().add(2, 'days').format("DD-MM-YYYY")
        cy.FilterCheck(this.data.filtercolumn.StartDate, sdate, this.data.StartDatefiltercondition.GreaterThanEqual, this.data.all.loc_sdate)
        cy.clearfilter(this.data.filtercolumn.StartDate)
    })

    it('TC32_ELN_Start Date Filter Check with LessThan condition', function () {
        const dayjs = require("dayjs");
        var sdate = dayjs().add(5, 'days').format("DD-MM-YYYY")
        cy.FilterCheck(this.data.filtercolumn.StartDate, sdate, this.data.StartDatefiltercondition.LessThan, this.data.all.loc_sdate)
        cy.clearfilter(this.data.filtercolumn.StartDate)
    })

    it('TC33_ELN_Start Date Filter Check with LessThanEqual condition', function () {
        const dayjs = require("dayjs");
        var sdate = dayjs().add(4, 'days').format("DD-MM-YYYY")
        cy.FilterCheck(this.data.filtercolumn.StartDate, sdate, this.data.StartDatefiltercondition.LessThanEqual, this.data.all.loc_sdate)
        cy.clearfilter(this.data.filtercolumn.StartDate)
    })


    it('TC36_ELN_Days Left Filter Check with GreaterThan condition', function () {

        cy.FilterCheck(this.data.filtercolumn.daysleft, this.data.filtervalues.tc36, this.data.StartDatefiltercondition.GreaterThan, this.data.all.loc_daysleft)
        cy.clearfilter(this.data.filtercolumn.daysleft)
    })

    it('TC37_ELN_Days Left Filter Check with GreaterThanEqual condition', function () {

        cy.FilterCheck(this.data.filtercolumn.daysleft, this.data.filtervalues.tc37, this.data.StartDatefiltercondition.GreaterThanEqual, this.data.all.loc_daysleft)
        cy.clearfilter(this.data.filtercolumn.daysleft)
    })

    it('TC38_ELN_Days Left Filter Check with equal condition', function () {

        cy.FilterCheck1(this.data.filtercolumn.daysleft, this.data.filtervalues.tc38, this.data.StartDatefiltercondition.equal, this.data.all.loc_daysleft)
        cy.clearfilter(this.data.filtercolumn.daysleft)
    })

    it('TC39_paginaation validation', function () {

        cy.pagination(5, "project")
        cy.pagination(20, "project")
        cy.pagination(50, "project")
        cy.pagination(100, "project")
        cy.pagination(10, "project")


    })



    it('TC40_Create project close button check', function () {
        const projectPage = new projectpage()

        projectPage.clickProject().click()
        cy.get("td[class*='e-rowcell']").eq(0).click()
        cy.xpath("//button[contains(text(),'Close')]").click()

    })

    it('TC41_Create project reset button check', function () {
        const projectPage = new projectpage()

        projectPage.clickProject().click()
        cy.get("td[class*='e-rowcell']").eq(0).click({ force: true })

        const dayjs = require('dayjs')

        projectPage.addproject1().eq(0).click({ force: true })
        projectPage.enterProjectName().type(this.data.TC01.name)
        cy.get(':nth-child(2) > .select').select(this.data.all.Project_Owner)
        cy.get(':nth-child(3) > .select').select(this.data.all.Project_Manager)
        cy.wait(2000)
        projectPage.enterStartDate().clear()
        projectPage.enterStartDate().type(dayjs().format('DD/MM/YYYY'))
        cy.wait(2000)
        projectPage.enterDueDate().clear()
        projectPage.enterDueDate().type(dayjs().format('DD/MM/YYYY'))
        projectPage.enterTagName().type(this.data.all.Tagname)
        cy.get("#" + this.data.TC01.priority).click({ force: true })
        projectPage.addTag().click()
        projectPage.enterDescription().type(this.data.all.Description)
        cy.wait(1000)

        projectPage.resetbtn().click({ force: true })
        projectPage.dialogbtn().click({ force: true })
        projectPage.enterProjectName().should('have.text', '')
        projectPage.enterStartDate().should('have.text', '')
        projectPage.enterDueDate().should('have.text', '')
        projectPage.taglist().should('have.text', '')
        projectPage.enterDescription().should('have.text', '')

    })

    it('TC97_Create project reset cancel check', function () {
        const projectPage = new projectpage()
        projectPage.clickProject().click()
        cy.get("td[class*='e-rowcell']").eq(0).click()

        const dayjs = require('dayjs')


        projectPage.addproject1().eq(0).click()
        projectPage.enterProjectName().type(this.data.TC01.name)
        cy.get(':nth-child(2) > .select').select(this.data.all.Project_Owner)
        cy.get(':nth-child(3) > .select').select(this.data.all.Project_Manager)
        cy.wait(2000)
        projectPage.enterStartDate().clear()
        projectPage.enterStartDate().type(dayjs().format('DD/MM/YYYY'))
        cy.wait(2000)
        projectPage.enterDueDate().clear()
        projectPage.enterDueDate().type(dayjs().format('DD/MM/YYYY'))
        projectPage.enterTagName().type(this.data.all.Tagname)
        cy.get("#" + this.data.TC01.priority).click({ force: true })
        projectPage.addTag().click()
        projectPage.enterDescription().type(this.data.all.Description)
        cy.wait(1000)

        projectPage.resetbtn().click()
        cy.get('.e-footer-content > :nth-child(2)').click()
        cy.wait(5000)
        projectPage.enterProjectName().should('not.have.text', this.data.TC01.name)

        cy.get("span[class='tags']").should('have.text', " autoTag ")

        cy.get('.actionWrap > :nth-child(1)').click()
        cy.get('.e-footer-content > :nth-child(1)').click()
    })


    it('TC98_Project Naviagtion Check', function () {
        const projectPage = new projectpage()
        projectPage.clickProject().click()
        cy.wait(8000)
        cy.get("td[class*='e-rowcell']").eq(0).click()
        cy.wait(2000)
        cy.get('a[href="/eln-webapp-test/elndev/project/list"]').click()
        cy.wait(3000)
        cy.get("td[class*='e-rowcell']").eq(0).should('not.have.text', '')
        cy.wait(2000)
        projectPage.addProject().click()
        cy.wait(2000)
        cy.get('a[href="/eln-webapp-test/elndev/project/list"]').click()
        cy.wait(3000)
        cy.get("td[class*='e-rowcell']").eq(0).should('not.have.text', '')



    })

    it('TC99_ELN_Start Date Filter Check with invalid format', function () {
        const projectPage = new projectpage()
        projectPage.clickProject().click()
        cy.wait(5000)
        cy.get('#grid_145880046_3 > .e-gridcontent > .e-content').scrollTo('right')
        cy.wait(3000)
        projectPage.projectFilter().eq(4).click({ force: true })
        cy.wait(3000)
        projectPage.projectFilterclear().click({ force: true })
        cy.wait(3000)
        projectPage.projectFilter().eq(4).click({ force: true })
        cy.wait(2000)

        cy.get("div[class='e-flmenu-valuediv'] input[id*='ej2-datepicker']").clear()
        cy.wait(2000)
        cy.get("div[class='e-flmenu-valuediv'] input[id*='ej2-datepicker']").type("221231")
        cy.wait(2000)
        projectPage.filterOK().click({ force: true })
        cy.get('.e-toast-content').should('have.text', 'Not a valid date format')
        cy.wait(1000)

        cy.clearfilter(this.data.filtercolumn.StartDate)
    })





})

