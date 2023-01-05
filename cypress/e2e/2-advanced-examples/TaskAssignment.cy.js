/// <reference types="Cypress" />
/// <reference types="cypress-iframe" />
/// <reference types="cypress-xpath" />

import "cypress-iframe";
import "cypress-xpath";

import taskpage from "../../support/PageObjects/taskpage";

describe("ELN Task Assignment Suite", function () {
  this.beforeAll(function () {

    cy.login(Cypress.env("email"), Cypress.env("password"));
    cy.reload();
    cy.wait(3000);
  });

  this.beforeEach(function () {
    cy.fixture("testdata").then(function (data) {
      this.data = data;
    });
    cy.restoreLocalStorage();
  });
  this.afterAll(function () {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.removeLocalStorage();
  });

  this.afterEach(function () {
    cy.get('a[href="/eln-webapp-test/elndev/dashboard"]').click({ force: true })
    cy.saveLocalStorage();
  });

  it("TC52_ELN_Functional_User Groups not displayed at task and Block Level", function () {
    const taskPage = new taskpage();

    cy.openproj(this.data.TC52.name)
    cy.Projectcheck(this.data.TC52.name, this.data.TC52.priority, this.data.TC52.collaboratorlist, "user");

    cy.opentask(this.data.TC52.taskname)
    cy.Taskcheck(this.data.TC52.name, this.data.TC52.templatename, this.data.TC52.taskname);

    cy.opentaskexecution(this.data.TC52.taskname)

    taskPage.expandBtn().click({ force: true });
    cy.wait(2000);
    taskPage.assignUsrGeneralBlock().click();
    cy.wait(4000);
    taskPage.userlistCheck().should("have.text", "All Users");


  });

  it("TC53_ELN_Functional_Single User - Task Assignment", function () {
    const taskPage = new taskpage();
    cy.wait(4000);

    cy.opentaskexecution(this.data.TC52.taskname)
    cy.assignuser(this.data.TC52.blocknamelist, this.data.TC52.collaboratorlist);
    cy.schedulerFilter(this.data.TC52.taskname, this.data.TC52.blocknamelist[0], "reject");

  });

  it("TC54_ELN_Functional_Task Scheduler displayed always", function () {
    const taskPage = new taskpage();
    cy.opentaskexecution(this.data.TC52.taskname)
    cy.wait(3000);
    taskPage.expandBtn().click({ force: true });
    cy.wait(2500);
    taskPage.assignUsrGeneralBlock().click();
    cy.wait(4000);
    taskPage.assignUsrSearchBox().clear();
    cy.wait(1000)
    taskPage.assignUsrSearchBox().type(this.data.TC52.collaboratorlist[0]);
    cy.wait(2000);
    taskPage.selUsrCheckBox().click();
    cy.wait(2000);
    taskPage.schedulercheck().eq(2).then(function (elem) {
      expect(elem.text()).not.equal("");
    });
    taskPage.selUsrCheckBox().click();
    cy.wait(2000);
    taskPage.taskAssignBtn().click()
    cy.wait(2000);
    taskPage.tasksavBtn().click()

  });

  it("TC55_ELN_Functional_Multiple User - Task Assignment Page", function () {

    cy.openproj(this.data.TC55.name)
    cy.Projectcheck(this.data.TC55.name, this.data.TC55.priority, this.data.TC55.collaboratorlist, "user");

    cy.opentask(this.data.TC55.taskname)
    cy.Taskcheck(this.data.TC55.name, this.data.TC55.templatename, this.data.TC55.taskname);

    cy.opentaskexecution(this.data.TC55.taskname)
    cy.assignuser(this.data.TC55.blocknamelist, this.data.TC55.collaboratorlist);

    cy.taskremoveuser(this.data.TC55.blocknamelist, "delete");

  });

  it("TC56_ELN_Functional_Validate user can be assign with Asset role as Experiment", function () {
    cy.openproj(this.data.TC56.name)
    cy.Projectcheck(this.data.TC56.name, this.data.TC56.priority, this.data.TC56.collaboratorlist, "user");

    cy.opentask(this.data.TC56.taskname)
    cy.Taskcheck(this.data.TC56.name, this.data.TC56.templatename, this.data.TC56.taskname);

    cy.opentaskexecution(this.data.TC56.taskname)
    cy.assignuser(this.data.TC56.blocknamelist, this.data.TC56.collaboratorlist);

    cy.schedulerFilter(this.data.TC56.taskname, this.data.TC56.blocknamelist[0], "reject");
  });

  it("TC68_ELN_Validation_Task Assignment Screen - Display of Users per Page", function () {
    const taskPage = new taskpage();
    cy.openproj(this.data.TC68.name)
    cy.Projectcheck(this.data.TC68.name, this.data.TC68.priority, this.data.TC68.collaboratorlist, "user");

    cy.opentask(this.data.TC68.taskname)
    cy.Taskcheck(this.data.TC68.name, this.data.TC68.templatename, this.data.TC68.taskname);

    cy.opentaskexecution(this.data.TC68.taskname)
    cy.assignuser(this.data.TC68.blocknamelist, this.data.TC68.collaboratorlist);

    cy.taskremoveuser(this.data.TC68.blocknamelist, "selUsrChck");

    cy.taskremoveuser(this.data.TC68.blocknamelist, "delete");

  });

  it("TC69_ELN_Validation_Assign User - Mandatory fields", function () {
    const taskPage = new taskpage();
    const dayjs = require("dayjs");
    const time = require("time-js");

    cy.opentaskexecution(this.data.TC56.taskname)

    taskPage.expandBtn().click({ force: true });
    cy.wait(3000);
    taskPage.assignUsrGeneralBlock().click();
    cy.wait(4000);
    taskPage.assignUsrSearchBox().clear();
    cy.wait(2000);
    taskPage.assignUsrSearchBox().type(this.data.TC56.collaboratorlist[0]);
    cy.wait(2000);
    taskPage.selUsrCheckBox().click();
    cy.wait(2000);
    taskPage.taskAssignBtn().should("be.disabled");
    taskPage.enterTaskDuration().eq(0).clear();
    cy.wait(2000);
    taskPage.enterTaskDuration().eq(0).type(time().format("hh:mm"));
    taskPage.taskAssignBtn().should("be.disabled");
    taskPage.assetdrodown().eq(0).select(1);
    taskPage.taskAssignBtn().should("be.disabled");
    taskPage.enterTaskStartDate().eq(0).click();
    var startdate = dayjs().format("dddd, MMMM D, YYYY");
    cy.get("div[role*='calendar'] span[title='" + startdate + "']").click({
      force: true,
    });
    taskPage.taskAssignBtn().should("be.disabled");
    var enddate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");
    taskPage.enterTaskEndDate().eq(0).click();
    cy.wait(2000);
    cy.get("div[role*='calendar'] span[title='" + enddate + "']").click({
      force: true,
    });
    cy.wait(2000);
    taskPage.taskAssignBtn().should("be.enabled");
    taskPage.selUsrCheckBox().click();
    cy.wait(2000);
    taskPage.assignUsrSearchBox().clear();
    cy.wait(2000);
    taskPage.taskAssignCnlBtn().click()
    cy.wait(2000);
    taskPage.tasksavBtn().click()
    cy.wait(2000);
  });

  it("TC70_ELN_Validation_Scheduler - Default View", function () {
    const taskPage = new taskpage();
    const dayjs = require("dayjs");
    const time = require("time-js");
    cy.reload()
    cy.wait(2000)
    cy.opentaskexecution(this.data.TC56.taskname)

    taskPage.expandBtn().click({ force: true });
    cy.wait(3000);
    taskPage.assignUsrGeneralBlock().click();
    cy.wait(4000);
    taskPage.assignUsrSearchBox().clear();
    cy.wait(2000);
    taskPage.assignUsrSearchBox().type(this.data.TC56.collaboratorlist[0]);
    cy.wait(2000);
    taskPage.selUsrCheckBox().click();
    cy.wait(2000);
    taskPage.taskAssignBtn().should("be.disabled");
    taskPage.enterTaskDuration().eq(0).clear();
    cy.wait(2000);
    taskPage.enterTaskDuration().eq(0).type(time().format("hh:mm"));
    taskPage.taskAssignBtn().should("be.disabled");
    taskPage.assetdrodown().eq(0).select(1);
    taskPage.taskAssignBtn().should("be.disabled");
    taskPage.enterTaskStartDate().eq(0).click();
    var startdate = dayjs().format("dddd, MMMM D, YYYY");
    cy.get("div[role*='calendar'] span[title='" + startdate + "']").click({
      force: true,
    });
    taskPage.taskAssignBtn().should("be.disabled");
    var enddate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");
    taskPage.enterTaskEndDate().eq(0).click();
    cy.wait(2000);
    cy.get("div[role*='calendar'] span[title='" + enddate + "']").click({
      force: true,
    });
    cy.wait(2000);
    taskPage.taskAssignBtn().should("be.enabled");

    taskPage.schedulePrevBtn().click();
    taskPage.scheduleNxtBtn().click();

    var dayview = dayjs().format("MMMM D, YYYY");

    taskPage.schedulerLabel().should("have.text", "Scheduler");
    taskPage.taskResourceName().should("have.text", this.data.TC68.collaboratorlist[0]);

    taskPage.headerDates().then(function (elem) {
      cy.log(elem.text());
      expect(elem.text()).not.equal("");
    });

    taskPage.scheduleDayView().click();
    cy.get("div[role='navigation'] span").eq(2).should("have.text", dayview);
    taskPage.scheduleWeekView().click();
    taskPage.selUsrCheckBox().click();
    cy.wait(2000);
    taskPage.assignUsrSearchBox().clear();
    taskPage.taskAssignCnlBtn().click()
    taskPage.tasksavBtn().click()
  });

  it("TC71_ELN_Validation_Validate Schedule of the user by selecting a date from calendar", function () {
    const taskPage = new taskpage();
    const dayjs = require("dayjs");

    var scheduledate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");

    cy.opentaskexecution(this.data.TC56.taskname)
    cy.assignuser(this.data.TC56.blocknamelist, this.data.TC56.collaboratorlist);

    cy.addsecheduler(scheduledate);
    cy.wait(2000);


    cy.checkschedule(this.data.TC56.blocknamelist, scheduledate);


    cy.deleteSchedule(scheduledate);

    cy.schedulerFilter(this.data.TC56.taskname, this.data.TC56.blocknamelist[0], "reject")
  });

  it("TC72_ELN_Validation_Validate the functionality of Clear Button in User selection Filter", function () {
    const taskPage = new taskpage();

    cy.opentaskexecution(this.data.TC56.taskname)
    taskPage.expandBtn().click({ force: true });
    cy.wait(3000);
    taskPage.assignUsrGeneralBlock().click();
    cy.wait(4000);

    let usrlist = this.data.TC56.collaboratorlist;
    for (var i = 0; i <= usrlist.length - 1; i++) {
      taskPage.assignUsrSearchBox().clear();
      cy.wait(3000);
      taskPage.assignUsrSearchBox().type(usrlist[i]);
      cy.wait(3000);
    }

    taskPage.assignUsrSearchBox().clear()
    taskPage.taskAssignCnlBtn().click({ force: true });
    // taskPage.taskCloseBtn().eq(0).click()
    cy.wait(2000);
  });

  it("TC73_ELN_Validation_Schedule - Weekly View", function () {
    const taskPage = new taskpage();
    cy.opentaskexecution(this.data.TC56.taskname)
    taskPage.expandBtn().click({ force: true });
    cy.wait(3000);
    taskPage.assignUsrGeneralBlock().click();
    cy.wait(4000);
    taskPage.assignUsrSearchBox().clear();
    cy.wait(2000);
    taskPage.assignUsrSearchBox().type(this.data.TC56.collaboratorlist[0]);
    cy.wait(2000);
    taskPage.selUsrCheckBox().click();
    cy.wait(2000);

    const dayjs = require("dayjs");
    var scheduledate = dayjs().add(6, "day").format("dddd, MMMM D, YYYY");
    var formatteddate = dayjs().add(6, "day").format("MMM D, dddd");
    taskPage.schedulePrevBtn().click();
    taskPage.scheduleNxtBtn().click();
    taskPage.scheduleDayView().click();
    taskPage.scheduleWeekView().click();
    taskPage.scheduleCalendarBtn().click();
    cy.get("span[title='" + scheduledate + "']").click({ force: true });
    cy.wait(2000);
    cy.xpath("//span[contains(text(),'" + formatteddate + "')]").click({ force: true });
    cy.wait(3000);

    taskPage.selUsrCheckBox().click();
    cy.wait(2000);
    taskPage.assignUsrSearchBox().clear()
    cy.wait(1000)
    taskPage.taskAssignCnlBtn().click();
    taskPage.tasksavBtn().click()
  });

  it("TC74_ELN_Validation_Validate Cancel Button Flow", function () {
    const taskPage = new taskpage();
    cy.opentaskexecution(this.data.TC56.taskname)
    taskPage.expandBtn().click({ force: true });
    cy.wait(3000);
    taskPage.assignUsrGeneralBlock().click();
    cy.wait(4000);
    // taskPage.errorMsg().eq(0).should('have.text', 'There is no user Selected yet.Please Select User')
    taskPage.assignUsrSearchBox().clear();
    cy.wait(2000);
    taskPage.assignUsrSearchBox().type(this.data.TC56.collaboratorlist[0]);
    cy.wait(2000);
    taskPage.selUsrCheckBox().click();
    cy.wait(2000);

    taskPage.selUsrCheckBox().click();
    cy.wait(2000);
    taskPage.assignUsrSearchBox().clear();
    cy.wait(2000);
    taskPage.taskAssignCnlBtn().click();
    cy.wait(3000);


    taskPage.tasksavBtn().click()
    taskPage.collaboratorCount().should("have.text", "+0");

  });

  it("TC75_ELN_Validation_Validate Assign Button Functionality in Task Assignment Screen", function () {
    const taskPage = new taskpage();
    cy.opentaskexecution(this.data.TC56.taskname)
    cy.assignuser(this.data.TC56.blocknamelist, this.data.TC56.collaboratorlist);


    cy.schedulerFilter(this.data.TC56.taskname, this.data.TC56.blocknamelist[0], "reject");

  });
});
