/// <reference types="Cypress" />
/// <reference types="cypress-iframe" />
/// <reference types="cypress-xpath" />

import "cypress-iframe";
import "cypress-xpath";

import taskpage from "../../support/PageObjects/taskpage";

describe("ELN User Acceptance Suite", function () {
  this.beforeAll(function () {
    cy.clearLocalStorage()
    cy.removeLocalStorage()
    cy.login(Cypress.env("email"), Cypress.env("password"));

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

//   it("TC62_ELN_Functional_Task Assignment - Assets , start and End dates assignment", function () {

//     cy.openproj(this.data.TC62.name)
//     cy.Projectcheck(this.data.TC62.name, this.data.TC62.priority, this.data.TC62.collaboratorlist, "user");
//     cy.opentask(this.data.TC62.taskname)
//     cy.Taskcheck(this.data.TC62.name, this.data.TC62.templatename, this.data.TC62.taskname);
//     cy.opentaskexecution(this.data.TC62.taskname)
//     cy.assignuser(this.data.TC62.blocknamelist, this.data.TC62.collaboratorlist);
//   });

//   it("TC57_ELN_Functional_Validate task Accept without changing the Schedule", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     var scheduledate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");

//     let taskname = this.data.TC57.taskname + (Math.random() * 1000).toString(36).substring(2, 7);
//     cy.openproj(this.data.TC57.name)
//     cy.Projectcheck(this.data.TC57.name, this.data.TC57.priority, this.data.TC57.collaboratorlist, "user");
//     cy.opentask(taskname)
//     cy.Taskcheck(this.data.TC57.name, this.data.TC57.templatename, taskname);
//     cy.opentaskexecution(taskname)
//     cy.assignuser(this.data.TC57.blocknamelist, this.data.TC57.collaboratorlist);

//     cy.opentaskexecution(this.data.TC62.taskname)
//     cy.addsecheduler(scheduledate);


//     cy.reload()
//     cy.wait(5000)

//     cy.schedulerFilter(taskname, this.data.TC57.blocknamelist[0], "accept");
//     cy.checkschedule(this.data.TC57.blocknamelist, scheduledate);
//     cy.deleteSchedule(scheduledate);

//   });

//   it("TC58_ELN_Functional_Accept task with changing the Task schedule", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     var scheduledate = dayjs().add(2, "day").format("dddd, MMMM D, YYYY");
//     let taskname = this.data.TC58.taskname + (Math.random() * 2000).toString(36).substring(2, 7);

//     cy.openproj(this.data.TC58.name)
//     cy.Projectcheck(this.data.TC58.name, this.data.TC58.priority, this.data.TC58.collaboratorlist, "user");

//     cy.opentask(taskname)
//     cy.Taskcheck(this.data.TC58.name, this.data.TC58.templatename, taskname);

//     cy.opentaskexecution(taskname)
//     cy.assignuser(this.data.TC58.blocknamelist, this.data.TC58.collaboratorlist);

//     cy.opentaskexecution(taskname)
//     cy.addsecheduler(scheduledate);
//     cy.wait(2000);

//     cy.opentaskexecution(taskname)
//     cy.schedulerFilter(taskname, this.data.TC58.blocknamelist[0], "accept");

//     cy.opentaskexecution(taskname)
//     cy.reload()
//     cy.wait(5000)
//     cy.checkschedule(this.data.TC58.blocknamelist, scheduledate);
//   });

//   it("TC59_ELN_Functional_Schedule Change after task Accept", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     var scheduledate = dayjs().add(2, "day").format("dddd, MMMM D, YYYY");

//     cy.opentaskexecution(this.data.TC62.taskname)
//     cy.editScheduler(scheduledate);

//     cy.opentaskexecution(this.data.TC62.taskname)
//     cy.deleteSchedule(scheduledate);

//   });

//   it("TC60_ELN_Functional_Accept Task - Reject the Task", function () {
//     const dayjs = require("dayjs");
//     var scheduledate = dayjs().format("dddd, MMMM D, YYYY");

//     cy.openproj(this.data.TC60.name)
//     cy.Projectcheck(this.data.TC60.name, this.data.TC60.priority, this.data.TC60.collaboratorlist, "user");

//     cy.opentask(this.data.TC60.taskname)
//     cy.Taskcheck(this.data.TC60.name, this.data.TC60.templatename, this.data.TC60.taskname);

//     cy.opentaskexecution(this.data.TC60.taskname)
//     cy.assignuser(this.data.TC60.blocknamelist, this.data.TC60.collaboratorlist);

//     cy.opentaskexecution(this.data.TC60.taskname)
//     cy.addsecheduler(scheduledate);
//     cy.wait(2000);

//     cy.opentaskexecution(this.data.TC60.taskname)
//     cy.schedulerFilter(this.data.TC60.taskname, this.data.TC60.blocknamelist[0], "reject");

//   });

//   it("TC61_ELN_Functional_Schedule Change after Task reject", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     var scheduledate = dayjs().format("dddd, MMMM D, YYYY");


//     cy.opentaskexecution(this.data.TC62.taskname)
//     cy.editScheduler(scheduledate);

//     cy.opentaskexecution(this.data.TC62.taskname)
//     cy.deleteSchedule(scheduledate);


//   });

//   it("TC63_ELN_Functional_Verify maximum Number of users assigned to task", function () {

//     cy.opentaskexecution(this.data.TC62.taskname)
//     cy.reload()
//     cy.wait(5000)
//     cy.taskremoveuser(this.data.TC62.blocknamelist, "delete");
//   });

//   it("TC64_ELN_Validation_Accept task Page - Grid Validations", function () {
//     const dayjs = require("dayjs");
//     var scheduledate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");
//     const taskPage = new taskpage();

//     cy.openproj(this.data.TC63.name)
//     cy.Projectcheck(this.data.TC63.name, this.data.TC63.priority, this.data.TC63.collaboratorlist, "user");

//     cy.opentask(this.data.TC63.taskname)
//     cy.Taskcheck(this.data.TC63.name, this.data.TC63.templatename, this.data.TC63.taskname);

//     cy.opentaskexecution(this.data.TC63.taskname)
//     cy.assignuser(this.data.TC63.blocknamelist, this.data.TC63.collaboratorlist);


//     cy.opentaskexecution(this.data.TC63.taskname)
//     taskPage.taskAccptBtn().click()

//     cy.get('.e-columnheader > [aria-colindex="0"]').should(
//       "have.text",
//       "User Name"
//     );
//     cy.get('.e-columnheader > [aria-colindex="1"]').should(
//       "have.text",
//       "Role Name"
//     );
//     cy.get('.e-columnheader > [aria-colindex="2"]').should(
//       "have.text",
//       "Start Date"
//     );
//     cy.get('.e-columnheader > [aria-colindex="3"]').should(
//       "have.text",
//       "End Date"
//     );
//     cy.get('.e-columnheader > [aria-colindex="4"]').should(
//       "have.text",
//       "Duration"
//     );
//     cy.get('.e-columnheader > [aria-colindex="5"]').should(
//       "have.text",
//       "Task Name"
//     );
//     cy.get('.e-columnheader > [aria-colindex="6"]').should(
//       "have.text",
//       "Block Name"
//     );
//     cy.get('.e-columnheader > [aria-colindex="7"]').should(
//       "have.text",
//       "Action"
//     );
//     taskPage.accptCloseBtn().click();
//     taskPage.tasksavBtn().click()
//     taskPage.taskCloseBtn().click()
//   });

//   it("TC65_ELN_Validation_Accept task Screen - Pagination", function () {

//     const taskPage = new taskpage();
//     cy.pagination(10, "accept");
//     taskPage.accptCloseBtn().click();
//     taskPage.tasksavBtn().click()
//     taskPage.taskCloseBtn().click()
//   });

//   it("TC66_ELN_Validation_Accept Task Screen - Scheduler Validation", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     var scheduledate = dayjs().format("dddd, MMMM D, YYYY");
//     cy.opentaskexecution(this.data.TC63.taskname)
//     cy.addsecheduler(scheduledate);

//     cy.opentaskexecution(this.data.TC63.taskname)
//     cy.editScheduler(scheduledate);

//     cy.opentaskexecution(this.data.TC63.taskname)
//     cy.deleteSchedule(scheduledate);
//   });

//   it("TC67_ELN_Validation_Accept task Screen - Actions Validation", function () {
//     const taskPage = new taskpage();
//     cy.opentaskexecution(this.data.TC63.taskname)
//     taskPage.taskAccptBtn().click()
//     cy.wait(2500)
//     taskPage.accptTaskActBtn().eq(0).click({ force: true });
//     cy.wait(2000);
//     taskPage.accpttaskBtn().eq(0).should("have.text", "Accept");
//     taskPage.rejctTaskActBtn().eq(0).should("have.text", "Reject");
//     taskPage.accptCloseBtn().click({ force: true });
//     taskPage.tasksavBtn().click()
//     taskPage.taskCloseBtn().click()

//     cy.opentaskexecution(this.data.TC63.taskname)
//     cy.schedulerFilter(this.data.TC63.taskname, this.data.TC63.blocknamelist[0], "reject");
//   });


//   it("TC76_ELN_Validation_Scheduler - Delete Event", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     var scheduledate = dayjs().format("dddd, MMMM D, YYYY");

//     cy.openproj(this.data.TC75.name)
//     cy.Projectcheck(this.data.TC75.name, this.data.TC75.priority, this.data.TC75.collaboratorlist, "user");

//     cy.opentask(this.data.TC75.taskname)
//     cy.Taskcheck(this.data.TC75.name, this.data.TC75.templatename, this.data.TC75.taskname);

//     cy.opentaskexecution(this.data.TC75.taskname)
//     cy.assignuser(this.data.TC75.blocknamelist, this.data.TC75.collaboratorlist);

//     cy.opentaskexecution(this.data.TC75.taskname)
//     cy.addsecheduler(scheduledate);

//     cy.opentaskexecution(this.data.TC75.taskname)
//     cy.deleteSchedule(scheduledate);

//   });

//   it("TC77_ELN_Validation_Scheduler - Time Zone validation", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");

//     var scheduledate = dayjs().format("dddd, MMMM D, YYYY");
//     var formatteddate = dayjs().add(1, "day").format("MMM D, dddd");

//     cy.opentaskexecution(this.data.TC75.taskname)
//     cy.addschedulewithtimezone(scheduledate, formatteddate)





//   });

//   it("TC78_ELN_Validation_Validate Day schedule in the Accept task Screen", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     var scheduledate = dayjs().format("dddd, MMMM D, YYYY");

//     cy.opentaskexecution(this.data.TC75.taskname)
//     taskPage.taskAccptBtn().click()
//     cy.wait(2000)
//     taskPage.scheduleDayView().click({ force: true });
//     cy.wait(2000);
//     cy.get("div[class='e-more-indicator']").click({ force: true });
//     cy.wait(2000);
//     cy.get("div[class='e-subject']").should("have.text", "automationevent");
//     cy.wait(2000);
//     cy.get('.e-more-event-close').click()
//     cy.wait(1000)
//     taskPage.scheduleWeekView().click({ force: true });
//     taskPage.shceduleName().click();
//     cy.wait(1500);
//     taskPage.taskPageSchedule().should("have.text", "automationevent");

//     taskPage.accptCloseBtn().click()
//     taskPage.tasksavBtn().click()
//     taskPage.taskCloseBtn().click()
//     cy.wait(2000)


//     cy.opentaskexecution(this.data.TC75.taskname)
//     cy.deleteSchedule(scheduledate);

//   });

//   it("TC79_ELN_Validation_Reject Screen - Reason for Rejection field", function () {
//     const taskPage = new taskpage();
//     cy.opentaskexecution(this.data.TC75.taskname)
//     taskPage.taskAccptBtn().click()
//     cy.wait(1500)
//     taskPage.accptTaskActBtn().eq(0).click({ force: true });
//     cy.wait(1000);
//     taskPage.rejctTaskActBtn().eq(0).click({ force: true });
//     cy.wait(1000);
//     var repeat = function (str, count) {
//       var array = [];
//       for (var i = 0; i <= count;) array[i++] = str;
//       return array.join("");
//     };
//     var repeatedCharacter = repeat("a", 130);
//     let result = repeatedCharacter.slice(0, 128);
//     taskPage.rejctTaskCmnt().type(repeatedCharacter);
//     taskPage.rejctTaskCmnt().should("have.value", result);

//     taskPage.rejectCnclBtn().click({ force: true });
//     cy.wait(1000);
//     taskPage.accptCloseBtn().click();
//     cy.wait(1000);
//     taskPage.tasksavBtn().click()
//     cy.wait(1000)
//     taskPage.taskCloseBtn().click({ force: true });
//     cy.wait(1000);
//   });

//   it("TC80_ELN_Validation_Scheduler - Validate Add event dropdown", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");

//     cy.opentaskexecution(this.data.TC75.taskname)
//     taskPage.taskAccptBtn().click()
//     cy.wait(1500)

//     var scheduledate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");
//     var formatteddate = dayjs().add(1, "day").format("MMM D, dddd");
//     taskPage.scheduleCalendarBtn().click();
//     cy.get("span[title='" + scheduledate + "']").click({ force: true });
//     cy.wait(2000);
//     cy.xpath("//span[contains(text(),'" + formatteddate + "')]").click({ force: true, });
//     cy.wait(3000);
//     taskPage.scheduleTitle().type("automationevent");
//     taskPage.addMoreDetailsBtn().click();
//     cy.wait(1500);
//     taskPage.scheduleRepeat().click();
//     cy.get("li[class*='e-list-item ']").eq(0).should("have.text", "Never");
//     cy.get("li[class*='e-list-item ']").eq(1).should("have.text", "Daily");
//     cy.get("li[class*='e-list-item ']").eq(2).should("have.text", "Weekly");
//     cy.get("li[class*='e-list-item ']").eq(3).should("have.text", "Monthly");
//     cy.get("li[class*='e-list-item ']").eq(4).should("have.text", "Yearly");

//     taskPage.eventCnl().click()
//     cy.wait(1000)
//     taskPage.accptCloseBtn().click()
//     taskPage.tasksavBtn().click()
//     taskPage.taskCloseBtn().click()

//     cy.opentaskexecution(this.data.TC75.taskname)
//     cy.schedulerFilter(this.data.TC75.taskname, this.data.TC75.blocknamelist[0], "reject");
//   });

//   it("TC81_ELN_Error_Scheduler- Start date Greater than Due Date", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     cy.openproj(this.data.TC81.name)
//     cy.Projectcheck(this.data.TC81.name, this.data.TC81.priority, this.data.TC81.collaboratorlist, "user");

//     cy.opentask(this.data.TC81.taskname)
//     cy.Taskcheck(this.data.TC81.name, this.data.TC81.templatename, this.data.TC81.taskname);

//     cy.opentaskexecution(this.data.TC81.taskname)
//     cy.assignuser(this.data.TC81.blocknamelist, this.data.TC81.collaboratorlist);


//     cy.opentaskexecution(this.data.TC81.taskname)
//     taskPage.taskAccptBtn().click()
//     cy.wait(4500)
//     var scheduledate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");
//     var formatteddate = dayjs().add(1, "day").format("MMM D, dddd");
//     taskPage.scheduleCalendarBtn().click();
//     cy.get("span[title='" + scheduledate + "']").click({ force: true });
//     cy.wait(2000);
//     cy.xpath("//span[contains(text(),'" + formatteddate + "')]").click({ force: true, });
//     cy.wait(3000);
//     taskPage.scheduleTitle().type("automationevent");
//     taskPage.addMoreDetailsBtn().click();
//     taskPage.addschedulelocation().type("India");
//     taskPage.schedulerAllDayBox().should("be.checked");
//     var starttime = dayjs().add(1, "day").format("MM/DD/YY");
//     var endtime = dayjs().format("MM/DD/YY");
//     taskPage.schedulerStartTime().clear();
//     cy.wait(1000);
//     taskPage.schedulerStartTime().type(starttime);
//     taskPage.schedulerEndTime().clear();
//     cy.wait(1000);
//     taskPage.schedulerEndTime().type(endtime);
//     taskPage.saveSchedule().click();

//     taskPage.accepterrordialog().should("have.text", "The selected end date occurs before the start date.");
//     taskPage.accepterrorOK().click();
//     taskPage.eventCnl().click();

//     taskPage.accptCloseBtn().click();
//     taskPage.tasksavBtn().click();
//     taskPage.taskCloseBtn().click();


//   });

//   it("TC82_ELN_Error_Scheduler- Scheduler - Blank Start and End date", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");

//     cy.opentaskexecution(this.data.TC81.taskname)
//     taskPage.taskAccptBtn().click()
//     cy.wait(3500)

//     var scheduledate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");
//     var formatteddate = dayjs().add(1, "day").format("MMM D, dddd");
//     taskPage.scheduleCalendarBtn().click();
//     cy.get("span[title='" + scheduledate + "']").click({ force: true });
//     cy.wait(2000);
//     cy.xpath("//span[contains(text(),'" + formatteddate + "')]").click({
//       force: true,
//     });
//     cy.wait(4000);
//     taskPage.scheduleTitle().type("automationevent", { force: true });
//     taskPage.addMoreDetailsBtn().click({ force: true });
//     taskPage.addschedulelocation().type("India");
//     taskPage.schedulerAllDayBox().should("be.checked");
//     var starttime = dayjs().add(1, "day").format("MM/DD/YY");
//     var endtime = dayjs().format("MM/DD/YY");
//     taskPage.schedulerStartTime().clear();
//     cy.wait(1000);
//     taskPage.schedulerEndTime().clear();
//     cy.wait(1000);
//     taskPage.saveSchedule().click();

//     taskPage
//       .accepterrordialog()
//       .should("have.text", "The entered date value is invalid.");
//     taskPage.accepterrorOK().click();
//     taskPage.eventCnl().click();

//     taskPage.accptCloseBtn().click();
//     taskPage.tasksavBtn().click();
//     taskPage.taskCloseBtn().click();
//   });

//   it("TC83_ELN_Error_Scheduler - Start and Due Date - Invalid Format ", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");

//     cy.opentaskexecution(this.data.TC81.taskname)
//     taskPage.taskAccptBtn().click()
//     cy.wait(3500)

//     var scheduledate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");
//     var formatteddate = dayjs().add(1, "day").format("MMM D, dddd");
//     taskPage.scheduleCalendarBtn().click();
//     cy.get("span[title='" + scheduledate + "']").click({ force: true });
//     cy.wait(2000);
//     cy.xpath("//span[contains(text(),'" + formatteddate + "')]").click({
//       force: true,
//     });
//     cy.wait(3000);
//     taskPage.scheduleTitle().type("automationevent");
//     taskPage.addMoreDetailsBtn().click();
//     taskPage.addschedulelocation().type("India");
//     taskPage.schedulerAllDayBox().should("be.checked");
//     var starttime = dayjs().add(1, "day").format("YY/DD/MM");
//     var endtime = dayjs().format("YY/DD/MM");
//     taskPage.schedulerStartTime().clear();
//     cy.wait(1000);
//     taskPage.schedulerStartTime().type(starttime);
//     taskPage.schedulerEndTime().clear();
//     cy.wait(1000);
//     taskPage.schedulerEndTime().type(endtime);
//     taskPage.saveSchedule().click();

//     taskPage.accepterrordialog().should("have.text", "The entered date value is invalid.");
//     taskPage.accepterrorOK().click();
//     taskPage.eventCnl().click();

//     taskPage.accptCloseBtn().click();
//     taskPage.tasksavBtn().click();
//     taskPage.taskCloseBtn().click();

//   });

//   it("TC84_ELN_grid_Accept Screen Grid Fiter - User Name ", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     const time = require("time-js");

//     cy.opentaskexecution(this.data.TC81.taskname)
//     cy.taskAssignFilterCheck(this.data.filtercolumn.username, this.data.TC87.conditionlist[0], this.data.filtercondition.startwith, this.data.all.loc_username);
//     cy.accptfltrclearfilter(this.data.filtercolumn.username);

//     cy.opentaskexecution(this.data.TC81.taskname)
//     cy.taskAssignFilterCheck(this.data.filtercolumn.username, this.data.TC87.conditionlist[1], this.data.filtercondition.endwith, this.data.all.loc_username);
//     cy.accptfltrclearfilter(this.data.filtercolumn.username);

//     cy.opentaskexecution(this.data.TC81.taskname)
//     cy.taskAssignFilterCheck(this.data.filtercolumn.username, this.data.TC87.conditionlist[2], this.data.filtercondition.equal, this.data.all.loc_username);
//     cy.accptfltrclearfilter(this.data.filtercolumn.username);

//     cy.opentaskexecution(this.data.TC81.taskname)
//     cy.taskAssignFilterCheck(this.data.filtercolumn.username, this.data.TC87.conditionlist[3], this.data.filtercondition.contains, this.data.all.loc_username);
//     cy.accptfltrclearfilter(this.data.filtercolumn.username);

//     taskPage.tasksavBtn().click()
//     cy.wait(1000)
//     taskPage.taskCloseBtn().click()
//     cy.wait(1000)


//   });

//   it("TC85_ELN_Grid_Accept Screen Grid Fiter - Start Date ", function () {
//     const taskPage = new taskpage();

//     cy.opentaskexecution(this.data.TC81.taskname)
//     cy.taskAssignFilterCheck(this.data.filtercolumn.acptstartdate, this.data.TC88.conditionlist[0], this.data.StartDatefiltercondition.LessThan, this.data.all.loc_acptstartdate);
//     cy.accptfltrclearfilter(this.data.filtercolumn.acptstartdate);

//     cy.opentaskexecution(this.data.TC81.taskname)
//     cy.taskAssignFilterCheck(this.data.filtercolumn.acptstartdate, this.data.TC88.conditionlist[0], this.data.StartDatefiltercondition.Not_Equal, this.data.all.loc_acptstartdate);
//     cy.accptfltrclearfilter(this.data.filtercolumn.acptstartdate);

//     taskPage.tasksavBtn().click()
//     cy.wait(1000)
//     taskPage.taskCloseBtn().click()
//     cy.wait(1000)
//   });

//   it("TC86_ELN_Grid_Accept Screen Grid Fiter - End Date ", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     const time = require("time-js");
//     cy.opentaskexecution(this.data.TC81.taskname)

//     cy.taskAssignFilterCheck(this.data.filtercolumn.acptenddate, this.data.TC88.conditionlist[0], this.data.StartDatefiltercondition.GreaterThanEqual, this.data.all.loc_acptenddate);
//     cy.accptfltrclearfilter(this.data.filtercolumn.acptenddate);

//     taskPage.tasksavBtn().click();
//     taskPage.taskCloseBtn().click();
//     cy.wait(1000)
//   });

//   it("TC87_ELN_Grid_Accept Screen Grid Fiter - invalid start and End Date ", function () {
//     const taskPage = new taskpage();

//     cy.opentaskexecution(this.data.TC81.taskname)

//     taskPage.taskAccptBtn().click();
//     cy.wait(4000);

//     taskPage.acceptFilter().eq(2).click({ force: true });
//     cy.wait(3000);
//     taskPage.acceptFilterClear().click({ force: true });
//     cy.wait(3000);
//     taskPage.acceptFilter().eq(2).click({ force: true });
//     cy.wait(2000);

//     taskPage.enteracptdatefilter().clear({ force: true });
//     cy.wait(1000);
//     taskPage.enteracptdatefilter().type("10222022");
//     cy.wait(1000);
//     taskPage.filterOK().click({ force: true });
//     cy.wait(1000);
//     cy.get(".e-toast-content").should("have.text", "Not a valid date format");
//     taskPage.acceptFilter().eq(2).click();
//     cy.wait(3000);
//     taskPage.acceptFilterClear().click();
//     cy.wait(3000);

//     taskPage.acceptFilter().eq(3).click();
//     cy.wait(3000);
//     taskPage.acceptFilterClear().click();
//     cy.wait(3000);
//     taskPage.acceptFilter().eq(3).click();
//     cy.wait(2000);

//     taskPage.enteracptdatefilter().clear({ force: true });
//     cy.wait(1000);
//     taskPage.enteracptdatefilter().type("10222022");
//     cy.wait(1000);
//     taskPage.filterOK().click({ force: true });
//     cy.wait(1000);
//     cy.get(".e-toast-content").should("have.text", "Not a valid date format");
//     taskPage.acceptFilter().eq(3).click();
//     cy.wait(3000);
//     taskPage.acceptFilterClear().click();
//     cy.wait(3000);

//     taskPage.tasksavBtn().click();
//     taskPage.taskCloseBtn().click();
//     cy.wait(1000)
//   });

//   it("TC88_ELN_Grid_Accept Screen Grid Fiter - Duration ", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     const time = require("time-js");

//     cy.opentaskexecution(this.data.TC81.taskname)

//     cy.taskAssignFilterCheck(this.data.filtercolumn.acptduration, ":", this.data.filtercondition.contains, this.data.all.loc_acptduration);
//     cy.accptfltrclearfilter(this.data.filtercolumn.acptduration);

//     taskPage.tasksavBtn().click();
//     taskPage.taskCloseBtn().click();
//     cy.wait(1000)
//   });

//   it("TC89_ELN_Grid_Accept Screen Grid Fiter - Role Name ", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     const time = require("time-js");

//     cy.opentaskexecution(this.data.TC81.taskname)

//     cy.taskAssignFilterCheck(this.data.filtercolumn.acptrolename, this.data.TC91.conditionlist[0], this.data.filtercondition.startwith, this.data.all.loc_acptrole);
//     cy.accptfltrclearfilter(this.data.filtercolumn.acptrolename);

//     cy.opentaskexecution(this.data.TC81.taskname)
//     cy.taskAssignFilterCheck(this.data.filtercolumn.acptrolename, this.data.TC91.conditionlist[1], this.data.filtercondition.endwith, this.data.all.loc_acptrole);
//     cy.accptfltrclearfilter(this.data.filtercolumn.acptrolename);

//     cy.opentaskexecution(this.data.TC81.taskname)
//     cy.taskAssignFilterCheck(this.data.filtercolumn.acptrolename, this.data.TC91.conditionlist[2], this.data.filtercondition.equal, this.data.all.loc_acptrole);
//     cy.accptfltrclearfilter(this.data.filtercolumn.acptrolename);

//     cy.opentaskexecution(this.data.TC81.taskname)
//     cy.taskAssignFilterCheck(this.data.filtercolumn.acptrolename, this.data.TC91.conditionlist[0], this.data.filtercondition.contains, this.data.all.loc_acptrole);
//     cy.accptfltrclearfilter(this.data.filtercolumn.acptrolename);

//     taskPage.tasksavBtn().click();
//     taskPage.taskCloseBtn().click();
//     cy.wait(1000)

//   });

//   it("TC90_ELN_Error_Error message - Reject Reason not entered", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     const time = require("time-js");

//     cy.opentaskexecution(this.data.TC81.taskname)
//     taskPage.taskAccptBtn().click()
//     cy.wait(1500)
//     cy.acttaskfilter(this.data.TC81.taskname, this.data.TC81.blocknamelist[0])
//     cy.wait(1500)
//     taskPage.accptTaskActBtn().eq(0).click({ force: true });
//     cy.wait(1000);
//     taskPage.rejctTaskActBtn().click({ force: true });
//     cy.wait(1000);
//     taskPage.rejctTaskCmnt().should("have.text", "                            ");
//     taskPage.rejctTaskBtn().should("be.disabled");
//     taskPage.rejectCnclBtn().should("be.enabled");

//     taskPage.rejectCnclBtn().click({ force: true });
//     cy.wait(2000)
//     taskPage.rejctTaskActBtn().click({ force: true })
//     cy.wait(1000)


//     taskPage.rejctTaskCmnt().type("rejecting task")
//     taskPage.rejctTaskBtn().click({ force: true })
//     cy.wait(1000)
//     cy.get('.e-toast-content').should('have.text', 'Task Rejected')
//     cy.wait(1000)

//     taskPage.accptCloseBtn().click({ force: true })
//     cy.wait(1000)
//     taskPage.tasksavBtn().click()
//     cy.wait(1000)
//     taskPage.taskCloseBtn().click()
//     cy.wait(1000)

//   });

//   it("TC91_ELN_Error_Task Assignment Page - Start date Greater than Due Date", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     const time = require("time-js");

//     cy.opentaskexecution(this.data.TC81.taskname)
//     taskPage.expandBtn().click({ force: true });
//     cy.wait(3000);
//     taskPage.assignUsrGeneralBlock().click();
//     cy.wait(4000);
//     taskPage.assignUsrSearchBox().clear();
//     cy.wait(2000);
//     taskPage.assignUsrSearchBox().type(this.data.TC81.taskUserList[0]);
//     cy.wait(2000);
//     taskPage.selUsrCheckBox().click();
//     cy.wait(2000);
//     taskPage.enterTaskDuration().eq(0).type(time().format("hh:mm"));

//     taskPage.enterTaskStartDate().eq(0).click();
//     var startdate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");
//     cy.get("div[role*='calendar'] span[title='" + startdate + "']").click({
//       force: true,
//     });
//     var enddate = dayjs().format("dddd, MMMM D, YYYY");
//     taskPage.enterTaskEndDate().eq(0).click();
//     cy.wait(2000);
//     cy.get("div[role*='calendar'] span[title='" + enddate + "']").click({
//       force: true,
//     });
//     cy.wait(2000);

//     cy.get("span[class='error']")
//       .eq(1)
//       .should("have.text", "Start date must be less than End date ");
//     cy.get("span[class='error'] span").should(
//       "have.text",
//       "End date must be greater than or equal to start date and today's date. "
//     );

//     taskPage.selUsrCheckBox().click();
//     cy.wait(2000);
//     taskPage.assignUsrSearchBox().clear();
//     cy.wait(1000);
//     taskPage.taskAssignCnlBtn().click();
//     taskPage.tasksavBtn().click()
//     cy.wait(2500)
//   });


//   it("TC92_ELN_Error_Due date less than Today date", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     const time = require("time-js");

//     cy.opentaskexecution(this.data.TC81.taskname)
//     cy.wait(1500)
//     taskPage.expandBtn().click({ force: true });
//     cy.wait(3000);
//     taskPage.assignUsrGeneralBlock().click({ force: true });
//     cy.wait(4000);
//     taskPage.assignUsrSearchBox().clear();
//     cy.wait(2000);
//     taskPage.assignUsrSearchBox().type(this.data.TC81.taskUserList[0]);
//     cy.wait(2000);
//     taskPage.selUsrCheckBox().click();
//     cy.wait(2000);
//     taskPage.enterTaskDuration().eq(0).type(time().format("hh:mm"));

//     taskPage.enterTaskStartDate().eq(0).click();
//     var startdate = dayjs().format("dddd, MMMM D, YYYY");
//     cy.get("div[role*='calendar'] span[title='" + startdate + "']").click({
//       force: true,
//     });
//     var enddate = dayjs().subtract(1, "day").format("dddd, MMMM D, YYYY");
//     taskPage.enterTaskEndDate().eq(0).click();
//     cy.wait(2000);
//     cy.get("div[role*='calendar'] span[title='" + enddate + "']").click({
//       force: true,
//     });
//     cy.wait(2000);

//     cy.get("span[class='error']")
//       .eq(1)
//       .should("have.text", "Start date must be less than End date ");
//     cy.get("span[class='error'] span").should(
//       "have.text",
//       "End date must be greater than or equal to start date and today's date. "
//     );

//     taskPage.selUsrCheckBox().click();
//     cy.wait(2000);
//     taskPage.assignUsrSearchBox().clear();
//     cy.wait(1000);
//     taskPage.taskAssignCnlBtn().click();
//     taskPage.tasksavBtn().click()
//     cy.wait(2500)
//   });

//   it("TC93_ELN_Error_Due date less than Today date", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     const time = require("time-js");

//     cy.opentaskexecution(this.data.TC81.taskname)
//     cy.wait(1500)
//     taskPage.expandBtn().click({ force: true });
//     cy.wait(3000);
//     taskPage.assignUsrGeneralBlock().click();
//     cy.wait(4000);
//     taskPage.assignUsrSearchBox().clear();
//     cy.wait(2000);
//     taskPage.assignUsrSearchBox().type(this.data.TC81.taskUserList[0]);
//     cy.wait(2000);
//     taskPage.selUsrCheckBox().click();
//     cy.wait(2000);
//     taskPage.enterTaskDuration().eq(0).type(time().format("hh:mm"));

//     taskPage.enterTaskStartDate().eq(0).click();
//     var startdate = dayjs().format("dddd, MMMM D, YYYY");
//     cy.get("div[role*='calendar'] span[title='" + startdate + "']").click({
//       force: true,
//     });
//     var enddate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");
//     taskPage.enterTaskEndDate().eq(0).click();
//     cy.wait(2000);
//     cy.get("div[role*='calendar'] span[title='" + enddate + "']").click({
//       force: true,
//     });
//     cy.wait(2000);

//     cy.get("input[placeholder='Start Date']").click({ force: true });
//     cy.xpath(
//       "//input[@placeholder='Start Date'] //parent::span//span[contains(@class,'e-clear-icon')]"
//     ).click({ force: true });
//     cy.get("span[class='error'] span").should(
//       "have.text",
//       "Start Date is required"
//     );

//     taskPage.enterTaskStartDate().eq(0).click();
//     cy.get("div[role*='calendar'] span[title='" + startdate + "']").click({
//       force: true,
//     });

//     cy.get("input[placeholder='End Date']").click({ force: true });
//     cy.xpath(
//       "//input[@placeholder='End Date'] //parent::span//span[contains(@class,'e-clear-icon')]"
//     ).click({ force: true });
//     cy.get("span[class='error'] span").should(
//       "have.text",
//       "End Date is required "
//     );


//     taskPage.selUsrCheckBox().click();
//     cy.wait(2000);
//     taskPage.assignUsrSearchBox().clear();
//     cy.wait(1000);
//     taskPage.taskAssignCnlBtn().click();
//     taskPage.tasksavBtn().click()
//     cy.wait(2500)
//   });

//   it("TC94_ELN_Error_Task Assignment Screen - Blank Duration - Error Message", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     const time = require("time-js");

//     cy.opentaskexecution(this.data.TC81.taskname)
//     cy.wait(1500)
//     taskPage.expandBtn().click({ force: true });
//     cy.wait(3000);
//     taskPage.assignUsrGeneralBlock().click();
//     cy.wait(4000);
//     taskPage.assignUsrSearchBox().clear();
//     cy.wait(2000);
//     taskPage.assignUsrSearchBox().type(this.data.TC81.taskUserList[0]);
//     cy.wait(2000);
//     taskPage.selUsrCheckBox().click();
//     cy.wait(2000);
//     taskPage.enterTaskDuration().eq(0).clear();

//     taskPage.enterTaskStartDate().eq(0).click();
//     var startdate = dayjs().format("dddd, MMMM D, YYYY");
//     cy.get("div[role*='calendar'] span[title='" + startdate + "']").click({
//       force: true,
//     });
//     var enddate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");
//     taskPage.enterTaskEndDate().eq(0).click();
//     cy.wait(2000);
//     cy.get("div[role*='calendar'] span[title='" + enddate + "']").click({
//       force: true,
//     });
//     cy.wait(2000);

//     cy.get("span[class='error'] span").should(
//       "have.text",
//       "Duration is required"
//     );

//     taskPage.selUsrCheckBox().click();
//     cy.wait(2000);
//     taskPage.assignUsrSearchBox().clear();
//     cy.wait(1000);
//     taskPage.taskAssignCnlBtn().click();
//     taskPage.tasksavBtn().click()
//     cy.wait(2500)

//   });

//   it("TC95_ELN_Error_Task Execution Flow - Due Date less than Today Date", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     const time = require("time-js");

//     cy.opentaskexecution(this.data.TC81.taskname)
//     cy.wait(1500)
//     taskPage.expandBtn().click({ force: true });
//     cy.wait(3000);
//     taskPage.assignUsrGeneralBlock().click();
//     cy.wait(4000);
//     taskPage.assignUsrSearchBox().clear();
//     cy.wait(2000);
//     taskPage.assignUsrSearchBox().type(this.data.TC81.taskUserList[0]);
//     cy.wait(2000);
//     taskPage.selUsrCheckBox().click();
//     cy.wait(2000);

//     var startdate = dayjs().subtract(6, "day").format("dddd, MMMM D, YYYY");
//     var enddate = dayjs().subtract(1, "day").format("dddd, MMMM D, YYYY");

//     cy.get("input[placeholder='End Date']").click({ force: true });
//     cy.xpath(
//       "//input[@placeholder='End Date'] //parent::span//span[contains(@class,'e-clear-icon')]"
//     ).click({ force: true });

//     taskPage.enterTaskEndDate().eq(0).click();
//     cy.wait(2000);
//     cy.get("div[role*='calendar'] span[title='" + enddate + "']").click({
//       force: true,
//     });

//     taskPage.enterTaskStartDate().eq(0).click();
//     cy.get("div[role*='calendar'] span[title='" + startdate + "']").click({
//       force: true,
//     });

//     cy.wait(2000);
//     cy.get("span[class='error'] span").should(
//       "have.text",
//       "End date must be greater than or equal to start date and today's date. "
//     );

//     var enddate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");
//     taskPage.enterTaskEndDate().eq(0).click();
//     cy.wait(2000);
//     cy.get("div[role*='calendar'] span[title='" + enddate + "']").click({
//       force: true,
//     });

//     taskPage.selUsrCheckBox().click();
//     cy.wait(2000);
//     taskPage.assignUsrSearchBox().clear();
//     cy.wait(1000);
//     taskPage.taskAssignCnlBtn().click();
//     taskPage.tasksavBtn().click()
//     cy.wait(2500)
//   });

//   it("TC96_ELN_Error_Task Execution Flow - Start date and end date not entered", function () {
//     const taskPage = new taskpage();
//     const dayjs = require("dayjs");
//     const time = require("time-js");

//     cy.opentaskexecution(this.data.TC81.taskname)
//     cy.wait(1500)
//     taskPage.expandBtn().click({ force: true });
//     cy.wait(4000);
//     taskPage.assignUsrGeneralBlock().click();
//     cy.wait(5000);
//     taskPage.assignUsrSearchBox().clear();
//     cy.wait(2000);
//     taskPage.assignUsrSearchBox().type(this.data.TC81.taskUserList[0]);
//     cy.wait(2000);
//     taskPage.selUsrCheckBox().click();
//     cy.wait(2000);

//     var startdate = dayjs().format("dddd, MMMM D, YYYY");
//     var enddate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");

//     taskPage.enterTaskStartDate().eq(0).click();
//     cy.get("div[role*='calendar'] span[title='" + startdate + "']").click({
//       force: true,
//     });
//     cy.wait(2000);

//     cy.get("input[placeholder='Start Date']").click({ force: true });
//     cy.xpath(
//       "//input[@placeholder='Start Date'] //parent::span//span[contains(@class,'e-clear-icon')]"
//     ).click({ force: true });
//     cy.get("span[class='error'] span").should(
//       "have.text",
//       "Start Date is required"
//     );

//     taskPage.enterTaskStartDate().eq(0).click();
//     cy.get("div[role*='calendar'] span[title='" + startdate + "']").click({
//       force: true,
//     });

//     taskPage.enterTaskEndDate().eq(0).click();
//     cy.wait(2000);
//     cy.get("div[role*='calendar'] span[title='" + enddate + "']").click({
//       force: true,
//     });
//     cy.wait(2000);

//     cy.get("input[placeholder='End Date']").click({ force: true });
//     cy.xpath(
//       "//input[@placeholder='End Date'] //parent::span//span[contains(@class,'e-clear-icon')]"
//     ).click({ force: true });
//     cy.get("span[class='error'] span").should(
//       "have.text",
//       "End Date is required "
//     );


//     taskPage.selUsrCheckBox().click();
//     cy.wait(2000);
//     taskPage.assignUsrSearchBox().clear();
//     cy.wait(1000);
//     taskPage.taskAssignCnlBtn().click();
//     taskPage.tasksavBtn().click()
//     cy.wait(2500)
//   });

});
