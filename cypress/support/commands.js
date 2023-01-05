// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
/// <reference types="Cypress" />
/// <reference types="cypress-iframe" />
/// <reference types="cypress-xpath" />

import "cypress-iframe";
import "cypress-xpath";

import projectpage from "../support/PageObjects/projectpage";
import loginpage from "../support/PageObjects/loginpage";
import taskpage from "../support/PageObjects/taskpage";

before(() => {
  cy.fixture("../fixtures/testdata.json").as("data");
  cy.get("@data").then((data) => {
    Cypress.Commands.add("EnterToken", () => {
      cy.request({
        method: "GET",
        url: "https://api.testdataservices.com.au/v0001F_GetGoogleAuthCode?Email=shridhara.ramaswamy@yokogawa.com&SecretKey=QEHCNXXUA7Y76BDPEZ4PBESBE5FQ3CEO&SubscriptionKey=bksLG5nuZEeyrQr9AttIw474WbyNrsRP",

        headers: {
          accept: "application/json",
        },
      }).then((response) => {
        let body = JSON.parse(JSON.stringify(response.body));
        cy.wait(1500);
        cy.get(".gig-tfa-code-textbox").type(body.ThisToken);

        cy.log(body.ThisToken);
        cy.log(body.NextToken);
        cy.log(body.SecondsRemaining);
      });
    });

    Cypress.Commands.add("AddTag", (num) => {
      for (var i = 1; i <= num; i++) {
        cy.get("input[formcontrolname='tags']").type("tag" + i);
        cy.get(".btn-small.mb-1").click();
      }
    });

    Cypress.Commands.add("addCollaborator", (collaboratorlist) => {
      const projectPage = new projectpage();
      cy.log(collaboratorlist.length);
      var usercount = 0;
      for (var i = 0; i <= collaboratorlist.length - 1; i++) {
        projectPage.addcollborator().click();
        cy.wait(3500);
        projectPage.searchbox().type(collaboratorlist[i]);
        cy.wait(4500);
        projectPage.selectnames().then(function (elem) {
          cy.log(elem.length);

          for (i = 0; i <= elem.length - 1; i++) {
            elem[i].click();
            projectPage.assetdrodown().eq(i).select(1);
          }

          projectPage.selusrslist().then(function (usrs) {
            cy.log(usrs.length);
            usercount = usercount + parseInt(usrs.length);
            projectPage.searchbox().clear();
            projectPage.selbtn().eq(0).click();
            cy.wait(2500);
            cy.get(".e-toast-content").should(
              "have.text",
              "Assigned user(s) Successfully"
            );
            cy.wait(1500);

            projectPage
              .collaboratorCount()
              .should("have.text", "+" + usercount);
            usercount = 0;
          });
        });
      }
    });

    Cypress.Commands.add("addgroupCollaborator", (grouplist) => {
      const projectPage = new projectpage();
      var listcount = 0;
      for (var i = 0; i <= grouplist.length - 1; i++) {
        projectPage.addcollborator().click();
        cy.wait(3500);
        projectPage.searchgroup().click();
        projectPage.searchgroup().type(grouplist[i]);
        cy.wait(4500);
        projectPage.selectgroup().click();
        cy.wait(2500);
        projectPage.groupitems().then(function (elem) {
          for (i = 0; i <= elem.length - 1; i++) {
            projectPage.assetdrodown().eq(i).select(1);
          }
          listcount = listcount + elem.length;
          projectPage.searchgroup().clear();
          cy.wait(2500);
          projectPage.selbtn().eq(0).click();
          cy.wait(2500);
          cy.get(".e-toast-content").should(
            "have.text",
            "Assigned user(s) Successfully"
          );
          cy.wait(1500);
          projectPage.collaboratorCount().should("have.text", "+" + listcount);
          listcount = 0;
        });
      }
    });

    Cypress.Commands.add("addallCollaborator", () => {
      const projectPage = new projectpage();

      var usercount = 0;
      projectPage.addcollborator().click();
      cy.wait(3500);
      projectPage.selectnames().then(function (elem) {
        cy.log(elem.length);

        for (var i = 0; i <= elem.length - 1; i++) {
          elem[i].click();
          projectPage.assetdrodown().eq(i).select(1);
        }

        usercount = usercount + parseInt(elem.length);

        projectPage.selbtn().eq(0).click();
        cy.wait(1500);
        cy.get(".e-toast-content").should(
          "have.text",
          "Assigned user(s) Successfully"
        );
        cy.wait(1500);

        projectPage.collaboratorCount().should("have.text", "+" + usercount);
        usercount = 0;
      });
    });

    Cypress.Commands.add(
      "addProjwithcollaborator",
      (name, priority, userlist, usertype) => {
        const projectPage = new projectpage();

        const dayjs = require("dayjs");

        projectPage.clickProject().click({ force: true });
        projectPage.addProject().click({ force: true });
        projectPage.enterProjectName().type(name, { force: true });
        cy.get(":nth-child(2) > .select").select(data.all.Project_Owner, { force: true });
        cy.get(":nth-child(3) > .select").select(data.all.Project_Manager, { force: true });
        cy.wait(1500);
        projectPage.enterStartDate().clear();
        projectPage.enterStartDate().type(dayjs().format("DD/MM/YYYY"));
        cy.wait(1500);
        projectPage.enterDueDate().clear();
        projectPage.enterDueDate().type(dayjs().format("DD/MM/YYYY"));
        projectPage.enterTagName().type(data.all.Tagname);
        cy.get("#" + priority).click({ force: true });
        projectPage.addTag().click();
        projectPage.enterDescription().type(data.all.Description);
        if (usertype == "group") {
          cy.addgroupCollaborator(userlist);
        } else if (usertype == "user") {
          cy.addCollaborator(userlist);
        } else if (usertype == "all") {
          cy.addallCollaborator();
        }

        projectPage.createProject().click();

        cy.wait(2500);

        cy.get(".e-toast-content").should(
          "have.text",
          "You have successfully created a Project-" + name
        );
        cy.wait(1000);
      }
    );

    Cypress.Commands.add("Updatecollbarator", (name, editlist, usertype) => {
      const projectPage = new projectpage();

      projectPage.clickProject().click();
      cy.wait(1500);
      projectPage.projectFilter().eq(1).click();
      projectPage.enterFilterCondition().type(name);
      projectPage.filterOK().click({ force: true });
      cy.wait(1500);
      projectPage.selectProject().eq(1).click();
      cy.wait(2500)
      projectPage.editBtn().click();
      cy.wait(2500);
      if (usertype == "group") {
        cy.addgroupCollaborator(editlist);
      } else if (usertype == "user") {
        cy.addCollaborator(editlist);
      } else if (usertype == "all") {
        cy.addallCollaborator();
      }
      cy.wait(1500);
      projectPage.updateProj().click();
      cy.get(".e-toast-content").should(
        "have.text",
        "You have successfully updated a Project-" + name
      );
      projectPage.getList().click();
    });

    Cypress.Commands.add("removecollabarator", (name) => {
      const projectPage = new projectpage();

      projectPage.clickProject().click();
      cy.wait(1500);
      projectPage.projectFilter().eq(1).click();
      projectPage.enterFilterCondition().type(name);
      projectPage.filterOK().click({ force: true });
      cy.wait(1500);
      projectPage.selectProject().eq(1).click();
      projectPage.editBtn().click();
      cy.wait(2500);

      projectPage.addcollborator().click();
      cy.wait(3500);
      projectPage.removeUsrBtn().eq(1).click();
      cy.wait(1500);
      projectPage.groupitems().then(function (elem) {
        var listcount = elem.length;
        projectPage.searchgroup().clear();
        cy.wait(2500);
        projectPage.selbtn().eq(0).click();
        cy.wait(2500);
        cy.get(".e-toast-content").should(
          "have.text",
          "Assigned user(s) Successfully"
        );
        projectPage.collaboratorCount().should("have.text", "+" + listcount);
      });
      projectPage.updateProj().click();
      cy.get(".e-toast-content").should(
        "have.text",
        "You have successfully updated a Project-" + name
      );
      projectPage.getList().click();
    });

    Cypress.Commands.add("CreateProj", (name, priority) => {
      const projectPage = new projectpage();

      const dayjs = require("dayjs");

      projectPage.clickProject().click({ force: true });
      cy.wait(2000);
      projectPage.clickProject().click({ force: true });
      cy.wait(4500);
      projectPage.addProject().click({ force: true });
      projectPage.enterProjectName().type(name, { force: true });
      cy.get(":nth-child(2) > .select").select(data.all.Project_Owner, { force: true });
      cy.get(":nth-child(3) > .select").select(data.all.Project_Manager, { force: true });
      cy.wait(1500);
      projectPage.enterStartDate().clear();
      projectPage.enterStartDate().type(dayjs().format("DD/MM/YYYY"));
      cy.wait(1500);
      projectPage.enterDueDate().clear();
      projectPage.enterDueDate().type(dayjs().format("DD/MM/YYYY"));
      projectPage.enterTagName().type(data.all.Tagname);
      cy.get("#" + priority).click({ force: true });
      projectPage.addTag().click();
      projectPage.enterDescription().type(data.all.Description);
      projectPage.createProject().click();
      cy.wait(1000);

      cy.get(".e-toast-content").should(
        "have.text",
        "You have successfully created a Project-" + name
      );
      cy.wait(1500);
    });

    Cypress.Commands.add("Filtering", (projName, column, locator) => {
      const projectPage = new projectpage();

      projectPage.clickProject().click();
      cy.wait(3500);
      projectPage.projectFilter().eq(1).click({ force: true });
      cy.wait(2500);
      // projectPage.projgridcolfilter().click({ force: true });
      // cy.wait(1500);
      // cy.xpath("//ul[@class='e-list-parent e-ul ']//li[@data-value ='equal']").click({ force: true });
      // cy.wait(1000)
      projectPage.enterFilterCondition().type(projName);
      cy.wait(2500);
      projectPage.filterOK().click({ force: true });
      cy.wait(1500);

      cy.get(locator).should("have.text", column);
    });

    Cypress.Commands.add("Updateproj", (name) => {
      const projectPage = new projectpage();

      projectPage.clickProject().click();
      cy.wait(1500);
      projectPage.projectFilter().eq(1).click();
      projectPage.enterFilterCondition().type(name);
      projectPage.filterOK().click({ force: true });
      cy.wait(1500);
      projectPage.selectProject().eq(1).click();
      projectPage.editBtn().click();
      cy.wait(2500);
      projectPage.enterProjectName().type(data.TC02.update);
      projectPage.updateProj().click();
      cy.get(".e-toast-content").should(
        "have.text",
        "You have successfully updated a Project-" + name + data.TC02.update
      );
      projectPage.getList().click();
    });

    Cypress.Commands.add("DeleteProj", (projName) => {
      const projectPage = new projectpage();

      projectPage.selectProject().eq(1).click({ force: true });
      cy.wait(1500);
      projectPage.deletebtn().click();
      cy.wait(3500)
      projectPage.deletebtnYes().click()
      cy.wait(2000);
      cy.get(".e-toast-content").should(
        "have.text",
        "You have successfully deleted a Project"
      );
      cy.wait(2500);
      projectPage.projectFilter().eq(1).click();
      cy.wait(2500);
      projectPage.projgridcolfilter().click({ force: true });
      cy.wait(1500);
      cy.xpath("//ul[@class='e-list-parent e-ul ']//li[@data-value ='equal']").click({ force: true });
      cy.wait(1000)
      projectPage.enterFilterCondition().type(projName, { force: true });
      cy.wait(2500);
      projectPage.filterOK().click({ force: true });
      projectPage
        .deleteValidation()
        .should("have.text", "No records to display");
      cy.clearfilter(data.filtercolumn.project);
    });

    Cypress.Commands.add("Removeusr", (projName) => {
      const projectPage = new projectpage();

      projectPage.clickProject().click();
      cy.wait(1500);
      projectPage.projectFilter().eq(1).click();
      projectPage.enterFilterCondition().type(name);
      projectPage.filterOK().click({ force: true });
      cy.wait(1500);
      projectPage.selectProject().eq(1).click();
      projectPage.editBtn().click();
      cy.wait(2500);

      projectPage.selectProject().eq(1).click();
      projectPage.deletebtn().click();
      projectPage.deletebtnYes().click();
      cy.wait(1000);
      cy.get(".e-toast-content").should(
        "have.text",
        "You have successfully deleted a Project"
      );
      projectPage.projectFilter().eq(1).click();
      projectPage.enterFilterCondition().type(projName, { force: true });
      projectPage.filterOK().click({ force: true });
      projectPage
        .deleteValidation()
        .should("have.text", "No records to display");
      cy.clearfilter(data.filtercolumn.project);
    });

    Cypress.Commands.add(
      "Statuchange",
      (name, existing, check_locator, change) => {
        const projectPage = new projectpage();

        projectPage.selectProject().eq(1).click();
        cy.get(check_locator).should("have.text", existing);

        /* Checking  Status*/
        projectPage.editBtn().click();
        cy.wait(2500);
        cy.get(".pr-0 > .select").select(change);
        projectPage.updateProj().click();
        cy.get(".e-toast-content").should(
          "have.text",
          "You have successfully updated a Project-" + name
        );
      }
    );

    Cypress.Commands.add("duplicateProj", (name, priority) => {
      const projectPage = new projectpage();
      const dayjs = require("dayjs");

      projectPage.clickProject().click();
      projectPage.addProject().click({ force: true });
      projectPage.enterProjectName().type(name, { force: true });
      cy.get(":nth-child(2) > .select").select(data.all.Project_Owner), { force: true };
      cy.get(":nth-child(3) > .select").select(data.all.Project_Manager), { force: true };
      cy.wait(1500);
      projectPage.enterStartDate1().clear();
      projectPage.enterStartDate1().type(dayjs().format("DD/MM/YYYY"));
      cy.wait(1500);
      projectPage.enterDueDate1().clear();
      projectPage.enterDueDate1().type(dayjs().format("DD/MM/YYYY"));
      projectPage.enterTagName().type(data.all.Tagname);
      cy.get("#" + priority).click({ force: true });
      projectPage.addTag().click();
      projectPage.enterDescription().type(data.all.Description);
      projectPage.createProject().click();
      cy.wait(1000);

      cy.get(".e-toast-content").should(
        "have.text",
        "Project with provided name already exists.\n"
      );

      projectPage.clickProject().click();
      projectPage.dialogbtn().click();
    });

    Cypress.Commands.add(
      "FilterCheck1",
      (filtercolumn, condtion, filtercondition, locator) => {
        const projectPage = new projectpage();

        projectPage.clickProject().click();
        cy.wait(3500);
        if (
          filtercolumn == data.filtercolumn.project ||
          filtercolumn == data.filtercolumn.projectid ||
          filtercolumn == data.filtercolumn.daysleft
        ) {
          if (filtercolumn == data.filtercolumn.project) {
            projectPage.projectFilter().eq(1).click({ force: true });
            cy.wait(2500);
            projectPage.projectFilterclear().click({ force: true });
            cy.wait(2500);
            projectPage.projectFilter().eq(1).click({ force: true });
            cy.wait(1500);
          }

          if (filtercolumn == data.filtercolumn.projectid) {
            projectPage.projectFilter().eq(0).click({ force: true });
            cy.wait(2500);
            projectPage.projectFilterclear().click();
            cy.wait(2500);
            projectPage.projectFilter().eq(0).click({ force: true });
            cy.wait(1500);
          }

          if (filtercolumn == data.filtercolumn.daysleft) {
            projectPage.projectFilter().eq(3).click({ force: true });
            cy.wait(2500);
            projectPage.projectFilterclear().click({ force: true });
            cy.wait(2500);
            projectPage.projectFilter().eq(3).click({ force: true });
            cy.wait(1500);
          }
          projectPage.projgridcolfilter().click();
          cy.xpath(
            "//ul[@class='e-list-parent e-ul ']//li[@role='option'][" +
            filtercondition +
            "]"
          ).click({ force: true });

          if (filtercolumn == data.filtercolumn.daysleft) {
            projectPage.enterdaysleft().clear();
            cy.wait(1000);
            projectPage.enterdaysleft().type(condtion);
            projectPage.incrementdaysleft().click();
            projectPage.decrementdaysleft().click();
            projectPage.filterOK().click({ force: true });
            cy.wait(3500);
          } else {
            projectPage.enterFilterCondition().clear();
            cy.wait(2000);
            projectPage.enterFilterCondition().type(condtion);
            projectPage.filterOK().click({ force: true });
            cy.wait(1500);
          }

          projectPage.pagedropdown().then(function (elem) {
            projectPage.pagecount().eq(0).should("have.text", "10");
            const value1 = elem.text();
            var actualText1 = value1.split(" ");
            cy.log(actualText1[0].slice(1));
            cy.log(actualText1[1]);

            var num_pages = Math.ceil(actualText1[0].slice(1).trim() / 10);
            cy.log(num_pages);

            for (var i = 1; i <= num_pages; i++) {
              cy.get(locator).each((element) => {
                console.log("element =>", element.text());
                let value = element.text().trim();
                value = value.replace(/\,/g, "");

                if (filtercolumn == data.filtercolumn.daysleft) {
                  if (
                    filtercondition == data.StartDatefiltercondition.GreaterThan
                  ) {
                    Number(value) > Number(condtion)
                      ? expect(true).to.be.true
                      : expect(false).to.be.true;
                  }

                  if (
                    filtercondition ==
                    data.StartDatefiltercondition.GreaterThanEqual
                  ) {
                    Number(value) >= Number(condtion)
                      ? expect(true).to.be.true
                      : expect(false).to.be.true;
                  }

                  if (
                    filtercondition == data.StartDatefiltercondition.LessThan
                  ) {
                    Number(value) < Number(condtion)
                      ? expect(true).to.be.true
                      : expect(false).to.be.true;
                  }

                  if (
                    filtercondition ==
                    data.StartDatefiltercondition.LessThanEqual
                  ) {
                    Number(value) <= Number(condtion)
                      ? expect(true).to.be.true
                      : expect(false).to.be.true;
                  }

                  if (filtercondition == data.StartDatefiltercondition.equal) {
                    parseInt(value) == parseInt(condtion)
                      ? expect(true).to.be.true
                      : expect(false).to.be.true;
                  }
                } else {
                  expect(value.includes(condtion)).to.be.true;
                }
              });
              projectPage.nextpage().eq(0).click();
            }
          });
        }

        if (filtercolumn == data.filtercolumn.StartDate) {
          if (filtercolumn == data.filtercolumn.StartDate) {
            projectPage.projectFilter().eq(4).click();
            cy.wait(2500);
            projectPage.projectFilterclear().click();
            cy.wait(2500);
            projectPage.projectFilter().eq(4).click();
            cy.wait(1500);
          }

          projectPage.projgridcolfilter().click();
          cy.xpath(
            "//ul[@class='e-list-parent e-ul ']//li[@role='option'][" +
            filtercondition +
            "]"
          ).click();

          projectPage.enterfilterdate().clear();
          cy.wait(1000);
          projectPage.enterfilterdate().type(condtion);

          projectPage.filterOK().click({ force: true });

          console.log(cy.get(locator));

          projectPage.pagedropdown().then(function (elem) {
            projectPage.pagecount().eq(0).should("have.text", "10");
            const value1 = elem.text();
            var actualText1 = value1.split(" ");
            cy.log(actualText1[0].slice(1));
            cy.log(actualText1[1]);

            var num_pages = Math.ceil(actualText1[0].slice(1).trim() / 10);
            cy.log(num_pages);

            for (var i = 1; i <= num_pages; i++) {
              cy.get(locator).each((element) => {
                console.log("element =>", element.text());

                var date = element.text();
                console.log(
                  "before conversion =>",
                  date,
                  "condtion=>",
                  condtion
                );
                const [day, month, year] = date.split("-");
                var date1 = new Date(+year, month - 1, +day);

                const [day1, month1, year1] = condtion.split("-");
                var date2 = new Date(+year1, month1 - 1, +day1);
                console.log(
                  "After conversion date1 =",
                  date1,
                  " date2 =",
                  date2
                );

                if (
                  filtercondition == data.StartDatefiltercondition.GreaterThan
                ) {
                  date1 > date2
                    ? expect(true).to.be.true
                    : expect(false).to.be.true;
                }

                if (
                  filtercondition ==
                  data.StartDatefiltercondition.GreaterThanEqual
                ) {
                  date1 >= date2
                    ? expect(true).to.be.true
                    : expect(false).to.be.true;
                }

                if (filtercondition == data.StartDatefiltercondition.LessThan) {
                  date1 < date2
                    ? expect(true).to.be.true
                    : expect(false).to.be.true;
                }

                if (
                  filtercondition == data.StartDatefiltercondition.LessThanEqual
                ) {
                  date1 <= date2
                    ? expect(true).to.be.true
                    : expect(false).to.be.true;
                }

                if (filtercondition == data.StartDatefiltercondition.equal) {
                  if (date1 > date2) {
                    expect(false).to.be.true;
                  } else if (date1 < date2) {
                    expect(false).to.be.true;
                  } else {
                    expect(true).to.be.true;
                  }
                }
              });

              projectPage.nextpage().eq(0).click();
            }
          });
        }
      }
    );

    Cypress.Commands.add(
      "statecheck",
      (filtercolumn, filtercondition, locator) => {
        const projectPage = new projectpage();
        projectPage.clickProject().click();
        cy.wait(2500);

        if (filtercolumn == data.filtercolumn.priority) {
          cy.wait(4500);
          projectPage.projectFilter().eq(5).click({ force: true });
          cy.wait(1500);
          // cy.get("button[class='e-control e-btn e-lib e-flat']").click({ force: true })
          cy.wait(1500);
          projectPage.projectFilter().eq(5).click({ force: true });
          cy.wait(1500);

          cy.get("div[class*='e-ftrchk'] input[type='checkbox']")
            .eq(0)
            .uncheck();
          if (filtercondition == data.Priority.High) {
            cy.get("div[class*='e-ftrchk'] input[type='checkbox']")
              .eq(1)
              .check()
              .should("have.value", "on");
            cy.get(
              "button[class='e-control e-btn e-lib e-primary e-flat']"
            ).click({ force: true });
            cy.wait(4500);
          }

          if (filtercondition == data.Priority.Low) {
            cy.get("div[class*='e-ftrchk'] input[type='checkbox']")
              .eq(2)
              .check()
              .should("have.value", "on");
            cy.get(
              "button[class='e-control e-btn e-lib e-primary e-flat']"
            ).click({ force: true });
            cy.wait(4500);
          }

          if (filtercondition == data.Priority.Urgent) {
            cy.get("input[placeholder='Search']").eq(1).type(filtercondition);
            cy.wait(1500);
            cy.get(
              "button[class='e-control e-btn e-lib e-primary e-flat']"
            ).click({ force: true });
            cy.wait(2500);
          }
        }

        if (filtercolumn == data.filtercolumn.State) {
          cy.wait(4500);
          projectPage.projectFilter().eq(6).click({ force: true });
          cy.wait(1500);
          cy.get("button[class='e-control e-btn e-lib e-flat']").click({
            force: true,
          });
          cy.wait(1500);
          projectPage.projectFilter().eq(6).click({ force: true });
          cy.wait(1500);

          cy.get("div[class*='e-ftrchk'] input[type='checkbox']")
            .eq(0)
            .uncheck();

          if (filtercondition == data.State.InProgress) {
            cy.get("div[class*='e-ftrchk'] input[type='checkbox']")
              .eq(5)
              .check()
              .should("have.value", "on");
            cy.get(
              "button[class='e-control e-btn e-lib e-primary e-flat']"
            ).click({ force: true });
            cy.wait(1500);
          }

          if (filtercondition == data.State.Blocked) {
            cy.get("div[class*='e-ftrchk'] input[type='checkbox']")
              .eq(2)
              .check()
              .should("have.value", "on");
            cy.get(
              "button[class='e-control e-btn e-lib e-primary e-flat']"
            ).click({ force: true });
            cy.wait(1500);
          }

          if (filtercondition == data.State.Completed) {
            cy.get("div[class*='e-ftrchk'] input[type='checkbox']")
              .eq(3)
              .check()
              .should("have.value", "on");
            cy.get(
              "button[class='e-control e-btn e-lib e-primary e-flat']"
            ).click({ force: true });
            cy.wait(1500);
          }

          if (filtercondition == data.State.Archived) {
            cy.get("div[class*='e-ftrchk'] input[type='checkbox']")
              .eq(1)
              .check()
              .should("have.value", "on");
            cy.get(
              "button[class='e-control e-btn e-lib e-primary e-flat']"
            ).click({ force: true });
            cy.wait(1500);
          }
        }

        cy.get(locator).each((element) => {
          var value = element.text();
          expect(value.includes(filtercondition)).to.be.true;
        });

        projectPage.pagedropdown().then(function (elem) {
          projectPage.pagecount().eq(0).should("have.text", "10");
          const value1 = elem.text();
          var actualText1 = value1.split(" ");
          cy.log(actualText1[0].slice(1));
          cy.log(actualText1[1]);

          var num_pages = Math.ceil(actualText1[0].slice(1).trim() / 10);
          cy.log(num_pages);

          for (var i = 1; i <= num_pages; i++) {
            cy.get(locator).each((element) => {
              var value2 = element.text().trim();
              expect(value2.includes(filtercondition)).to.be.true;
            });
            projectPage.nextpage().eq(0).click();
          }
        });
      }
    );

    Cypress.Commands.add("clearfilter", (filtercolumn) => {
      const projectPage = new projectpage();
      projectPage.clickProject().click();
      cy.wait(1500);

      if (filtercolumn == data.filtercolumn.project) {
        projectPage.projectFilter().eq(1).click({ force: true });
        cy.wait(1500);
        projectPage.projectFilterclear().click({ force: true });
        cy.wait(1500);
      }
      if (filtercolumn == data.filtercolumn.StartDate) {
        projectPage.projectFilter().eq(4).click({ force: true });
        cy.wait(1500);
        projectPage.projectFilterclear().click({ force: true });
        cy.wait(1500);
      }
      if (filtercolumn == data.filtercolumn.projectid) {
        projectPage.projectFilter().eq(0).click({ force: true });
        cy.wait(1500);
        projectPage.projectFilterclear().click({ force: true });
        cy.wait(1500);
      }
      if (filtercolumn == data.filtercolumn.daysleft) {
        projectPage.projectFilter().eq(3).click({ force: true });
        cy.wait(1500);
        projectPage.projectFilterclear().click({ force: true });
        cy.wait(1500);
      }
      if (filtercolumn == data.filtercolumn.priority) {
        projectPage.projectFilter().eq(5).click({ force: true });
        cy.wait(1500);
        cy.get("button[class='e-control e-btn e-lib e-flat']").click({
          force: true,
        });
        cy.wait(1500);
      }
      if (filtercolumn == data.filtercolumn.State) {
        projectPage.projectFilter().eq(6).click({ force: true });
        cy.wait(1500);
        cy.get("button[class='e-control e-btn e-lib e-flat']").click({
          force: true,
        });
        cy.wait(1500);
      }
    });

    Cypress.Commands.add("pagination", (num, page) => {
      const projectPage = new projectpage();
      if (page == "project") {
        projectPage.clickProject().click();
        cy.wait(4500);
      }

      if (page == "accept") {
        const taskPage = new taskpage();
        cy.opentaskexecution(data.TC63.taskname)
        taskPage.taskAccptBtn().click({ force: true });
        cy.wait(2500);
      }

      cy.wait(4500);
      if (num === 5) {
        projectPage.countdropdown().eq(0).click();
        cy.xpath(
          "//ul[@class='e-list-parent e-ul ']//li[@data-value='" + num + "']"
        ).click();

        cy.wait(1500);
        projectPage.pagecount().eq(0).should("have.text", num);
        cy.countcheck(num);
        projectPage.nextpager().eq(0).click({ force: true });
        cy.countcheck(num);
        projectPage.nextpage().eq(0).click();
        cy.countcheck(num);
        projectPage.previouspage().eq(0).click({ force: true });
        cy.countcheck(num);
        projectPage.previouspager().eq(0).click({ force: true });
        cy.countcheck(num);
        projectPage.lastpage().eq(0).click();
        cy.countcheck(num);
        cy.wait(1500);
        projectPage.firstpage().eq(1).click();
        cy.countcheck(num);
      }
      if (num === 10 || num == 20 || num == 50 || num == 100) {
        projectPage.countdropdown().eq(0).click();
        cy.xpath(
          "//ul[@class='e-list-parent e-ul ']//li[@data-value='" + num + "']"
        ).click();
        cy.wait(1500);
        projectPage.pagecount().eq(0).should("have.text", num);
        cy.countcheck(num);
        projectPage.nextpage().eq(0).click();
        cy.countcheck(num);
        projectPage.previouspage().eq(0).click({ force: true });
        cy.countcheck(num);
        projectPage.lastpage().eq(0).click();
        cy.countcheck(num);
        cy.wait(1500);
        projectPage.firstpage().eq(1).click();
        cy.countcheck(num);
      }
    });

    Cypress.Commands.add("countcheck", (num) => {
      var num_pages;
      const projectPage = new projectpage();

      projectPage.pagedropdown().then(function (elem) {
        const value1 = elem.text();
        var actualText1 = value1.split(" ");
        cy.log(actualText1[0].slice(1));
        cy.log(actualText1[1]);

        num_pages = Math.ceil(actualText1[0].slice(1).trim() / num);
        cy.log(num_pages);
      });

      projectPage.pagenomsg().then(function (element) {
        var value2 = element.text();
        var currentpage = value2.split(" ");

        cy.log(currentpage[0].trim());
        cy.log(currentpage[2].trim());
        var exp_pages = parseInt(currentpage[2]);
        expect(exp_pages).to.equal(num_pages);
        cy.get("a[class*='e-active']")
          .eq(0)
          .should("have.text", currentpage[0]);
      });
    });

    Cypress.Commands.add("createtask", (name, templatename, taskname) => {
      const taskPage = new taskpage();
      taskPage.taskBtn().click({ force: true });
      cy.wait(1500);
      taskPage.sopBtn().click({ force: true });
      cy.wait(1500);
      taskPage.expBtn().click({ force: true });
      cy.wait(2500);
      taskPage.addExpBtn().click({ force: true });
      cy.wait(3500);
      taskPage.expProjectFilter().eq(1).click();
      cy.wait(1500);
      taskPage.enterFilterCondition().type(name);
      taskPage.filterOK().click({ force: true });
      cy.wait(1000);

      taskPage.selProjTemp().click();

      cy.wait(1000);

      taskPage.selectionBtn().click();
      cy.wait(1500);
      taskPage.tempNameFilter().click();
      cy.wait(1000);
      taskPage.enterFilterCondition().type(templatename);
      taskPage.filterOK().click({ force: true });
      cy.wait(2500);
      taskPage.selTemp().click();
      cy.wait(1000);
      taskPage.selectionTempBtn().click();
      cy.wait(2500);

      taskPage.blockTypes().each(($el, index, $list) => {
        const dayjs = require("dayjs");
        const time = require("time-js");

        var blockName = $el.text();
        cy.log(blockName);

        switch (blockName.trim()) {
          case "General Information":
            taskPage.expandBtn(index).click({ force: true });
            cy.wait(2500);
            taskPage.enterTaskName().clear();
            cy.wait(1500);
            taskPage.enterTaskName().type(taskname);
            taskPage.enterStartDate().clear();
            cy.wait(1500);
            taskPage.enterStartDate().type(dayjs().format("DD/MM/YYYY"));
            cy.wait(2500);
            taskPage.enterDueDate().clear();
            taskPage
              .enterDueDate()
              .type(dayjs().add(1, "day").format("DD-MM-YYYY"));
            cy.wait(2500);
            taskPage.enterDuration().type(time().format("hh:mm"));
            cy.wait(2500);
            taskPage.enterDesc().eq(0).type(data.TC52.desc);
            cy.wait(1000)
            taskPage.assignUsrGeneralBlock().click();
            cy.wait(3500)
            taskPage.assignUsrSearchBox().clear();
            cy.wait(1000);
            taskPage.assignUsrSearchBox().type("shridhara");
            cy.wait(1000);
            taskPage.selUsrCheckBox().click();
            cy.wait(2000);

            taskPage.selUsrCheckBox().click();
            cy.wait(2000);
            taskPage.assignUsrSearchBox().clear();
            cy.wait(2000);
            taskPage.taskAssignBtn().click();
            cy.wait(2000);

            taskPage.collpaseBtn(index).click({ force: true });
            cy.wait(2500);
            break;
          case "Instruction":
            taskPage.expandBtn(index).click({ force: true });
            taskPage.instructionblockname().click();
            cy.wait(1500);
            taskPage.instructionblockname().clear();
            cy.wait(1500);
            taskPage.instructionblockname().type(taskname);
            cy.wait(1500);
            taskPage.instructionblockdesc().clear();
            cy.wait(1500);
            taskPage.instructionblockdesc().type(data.TC52.desc);
            cy.wait(1500);
            taskPage.instructionblockdesc().type(data.TC52.desc);
            cy.wait(2000)

            taskPage.assignUsrInstructionBlock().click();
            cy.wait(3500)
            taskPage.assignUsrSearchBox().clear();
            cy.wait(1000);
            taskPage.assignUsrSearchBox().type("shridhara");
            cy.wait(1000);
            taskPage.selUsrCheckBox().click();
            cy.wait(2000);

            taskPage.selUsrCheckBox().click();
            cy.wait(2000);
            taskPage.assignUsrSearchBox().clear();
            cy.wait(2000);
            taskPage.taskAssignBtn().click();
            cy.wait(2000);
            taskPage.collpaseBtn(1).click({ force: true });
            cy.wait(1500);
            break;
          default:
            cy.log("No Block Names Matched");
        }
      });

      taskPage.createTaskBtn().click();
      cy.wait(2500);
    });

    Cypress.Commands.add("assignuser", (blocknamelist, userlist) => {
      const taskPage = new taskpage();

      taskPage.blockTypes().each(($el, index, $list) => {
        const dayjs = require("dayjs");
        const time = require("time-js");

        var blockName = $el.text();
        cy.log(blockName);

        for (var i = 0; i <= blocknamelist.length - 1; i++) {
          if (blockName.includes(blocknamelist[i])) {
            taskPage.expandBtn().click({ force: true });
            cy.wait(3500);
            if (blocknamelist[i].includes("General")) {
              taskPage.assignUsrGeneralBlock().click();
              cy.wait(3500);
            }
            if (blocknamelist[i].includes("Instruction")) {
              taskPage.assignUsrInstructionBlock().click();
              cy.wait(3500);
            }

            taskPage.assignUsrSearchBox().clear();
            for (var j = 0; j <= userlist.length - 1; j++) {
              taskPage.assignUsrSearchBox().type(userlist[j]);
              cy.wait(1500);
              taskPage.selUsrCheckBox().click();
              if (blocknamelist[i].includes("General")) {
                taskPage.assetdrodown().eq(j).select(j + 1);
              }
              taskPage.enterTaskDuration().eq(j).type(time().format("hh:mm"));
              cy.wait(1500);
              taskPage.enterTaskStartDate().eq(j).click();
              var startdate = dayjs().format("dddd, MMMM D, YYYY");
              cy.get(
                "div[role*='calendar'] span[title='" + startdate + "']"
              ).click({ force: true });
              var enddate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");
              taskPage.enterTaskEndDate().eq(j).click();
              cy.wait(1500);
              cy.get(
                "div[role*='calendar'] span[title='" + enddate + "']"
              ).click({ force: true });
              cy.wait(1500);
              taskPage.assignUsrSearchBox().clear();
            }

            taskPage.taskAssignBtn().click({ force: true });
            cy.wait(1500);
            cy.get(".e-toast-content").should(
              "have.text",
              "Assigned user(s) Successfully"
            );
            taskPage.collpaseBtn(1).click({ force: true });
          }
        }
      });

      taskPage.tasksavBtn().click();
      cy.wait(2500);
      // taskPage.taskCloseBtn().click();
      // cy.wait(4500);
    });

    Cypress.Commands.add("Projectcheck", (name, priority, list, type) => {
      const taskPage = new taskpage();
      taskPage.deleteValidation().then(function (elem) {
        if (elem.text() == "No records to display") {
          cy.addProjwithcollaborator(name, priority, list, type);
        } else {
          cy.log("Project Already Created With " + elem.text());
        }
      });
    });

    Cypress.Commands.add("Taskcheck", (name, templatename, taskname) => {
      const taskPage = new taskpage();
      taskPage.deleteValidation().then(function (elem1) {
        if (elem1.text() == "No records to display") {
          cy.createtask(name, templatename, taskname);
        } else {
          cy.log("Experiment Already Created With " + elem1.text());
        }
      });
    });

    Cypress.Commands.add("schedulerFilter", (taskname, blockname, action) => {
      const taskPage = new taskpage();

      cy.reload({ timeout: 15000 })
      cy.wait(2500)
      taskPage.taskAccptBtn().click({ force: true })
      cy.wait(4500);

      taskPage.accptTaskNameFltr().click({ force: true });
      cy.wait(2500);
      taskPage.enterFilterCondition().clear({ force: true });
      cy.wait(1000);
      taskPage.enterFilterCondition().type(taskname);
      cy.wait(1500);
      taskPage.filterOK().click({ force: true });
      cy.wait(1500);
      cy.get(".e-gridcontent > .e-content").scrollTo("right");
      taskPage.accptTaskBlockFltr().click();
      cy.wait(1500);
      taskPage.enterFilterCondition().type(blockname);
      cy.wait(1500);
      taskPage.filterOK().click({ force: true });
      cy.wait(1500);
      taskPage.accptTaskActBtn().eq(0).click()
      cy.wait(1000)


      if (action == "accept") {
        taskPage.accpttaskBtn().click({ force: true })
        cy.wait(1000)
        cy.get('.e-toast-content').should('have.text', 'Task Accepted.')
        cy.wait(1000)
        taskPage.accptCloseBtn().click({ force: true })
        cy.wait(1000)
        taskPage.tasksavBtn().click({ force: true })
        cy.wait(1000)
        // taskPage.taskCloseBtn().click()

      }

      if (action == "reject") {
        taskPage.rejctTaskActBtn().click({ force: true })
        cy.wait(1000)
        taskPage.rejctTaskCmnt().type("rejecting task")
        taskPage.rejctTaskBtn().click({ force: true })
        cy.wait(1000)
        cy.get('.e-toast-content').should('have.text', 'Task Rejected')
        cy.wait(1000)
        taskPage.accptCloseBtn().click({ force: true })
        cy.wait(1000)
        taskPage.tasksavBtn().click()
        cy.wait(1000)
        // taskPage.taskCloseBtn().click()

      }


    });

    Cypress.Commands.add("addsecheduler", (scheduledate) => {
      const taskPage = new taskpage();
      const dayjs = require("dayjs");


      var formatteddate = dayjs(scheduledate).format("MMM D, dddd");
      cy.reload({ timeout: 15000 })
      cy.wait(2500)
      taskPage.taskAccptBtn().click({ force: true })
      cy.wait(2500);

      taskPage.schedulePrevBtn().click();
      taskPage.scheduleNxtBtn().click();
      taskPage.scheduleDayView().click();
      taskPage.scheduleWeekView().click();
      taskPage.scheduleCalendarBtn().click();
      cy.get("span[title='" + scheduledate + "']").click({ force: true });
      cy.wait(2500);
      cy.xpath("//span[contains(text(),'" + formatteddate + "')]").click({
        force: true,
      });
      cy.wait(4500);

      // taskPage.addSchedule().click()
      taskPage.scheduleTitle().type("automationevent");
      taskPage.addMoreDetailsBtn().click({ force: true });
      taskPage.addschedulelocation().type("India");
      taskPage.saveSchedule().click();
      cy.get(".e-toast-content").should(
        "have.text",
        "Schedule added successfully"
      );
      cy.wait(1500);

      taskPage.accptCloseBtn().click()
      taskPage.tasksavBtn().click()
      // taskPage.taskCloseBtn().click()

    });

    Cypress.Commands.add("editScheduler", (scheduledate) => {
      const taskPage = new taskpage();
      taskPage.taskAccptBtn().click({ force: true });
      cy.wait(2500);

      taskPage.schedulePrevBtn().click();
      taskPage.scheduleNxtBtn().click();
      taskPage.scheduleDayView().click();
      taskPage.scheduleWeekView().click();
      taskPage.scheduleCalendarBtn().click();
      cy.get("span[title='" + scheduledate + "']").click({ force: true });
      cy.wait(3500);

      taskPage.selSchedule().click({ force: true });
      cy.wait(1500)
      taskPage.editSchedule().click({ force: true });
      cy.wait(1500)
      taskPage.saveSchedule().click();
      cy.get(".e-toast-content").should(
        "have.text",
        "Schedule updated successfully"
      );
      cy.wait(1500);

      taskPage.accptCloseBtn().click()
      taskPage.tasksavBtn().click()
      // taskPage.taskCloseBtn().click()
    });

    Cypress.Commands.add("deleteSchedule", (scheduledate) => {
      const taskPage = new taskpage();
      cy.reload({ timeout: 15000 })
      cy.wait(2500)
      taskPage.taskAccptBtn().click({ force: true })
      cy.wait(2500);

      taskPage.schedulePrevBtn().click();
      taskPage.scheduleNxtBtn().click();
      taskPage.scheduleDayView().click();
      taskPage.scheduleWeekView().click();
      taskPage.scheduleCalendarBtn().click();
      cy.get("span[title='" + scheduledate + "']").click({ force: true });
      cy.wait(3500);

      taskPage.selSchedule().click({ force: true });
      cy.wait(1500)
      taskPage.deleteSchedule().click({ force: true });
      cy.wait(1500)
      taskPage.deleteconfirmSchedule().click();
      cy.get(".e-toast-content").should(
        "have.text",
        "Schedule removed successfully"
      );
      cy.wait(1500);
      taskPage.accptCloseBtn().click()
      taskPage.tasksavBtn().click()
      // taskPage.taskCloseBtn().click()
    });

    Cypress.Commands.add("taskremoveuser", (blocknamelist, check) => {
      const taskPage = new taskpage();

      taskPage.blockTypes().each(($el, index, $list) => {
        const dayjs = require("dayjs");
        const time = require("time-js");

        var blockName = $el.text();
        cy.log(blockName);

        for (var i = 0; i <= blocknamelist.length - 1; i++) {
          if (blockName.includes(blocknamelist[i])) {
            cy.reload({ timeout: 15000 })
            cy.wait(3000)
            taskPage.expandBtn().click({ force: true })
            cy.wait(4500);

            if (blocknamelist[i].includes("General")) {
              taskPage.assignUsrGeneralBlock().click();
              cy.wait(4500);
            }
            if (blocknamelist[i].includes("Instruction")) {
              taskPage.assignUsrInstructionBlock().click();
              cy.wait(3500);
            }
            if (check === "delete") {
              taskPage.taskAssignBtn().click({ force: true });
              cy.wait(4500);
              if (blocknamelist[i].includes("General")) {
                taskPage.assignUsrGeneralBlock().click();
                cy.wait(4500);
              }
              if (blocknamelist[i].includes("Instruction")) {
                taskPage.assignUsrInstructionBlock().click();
                cy.wait(3500);
              }

              taskPage.delusrBtn().then(function (elem) {
                for (var j = 0; j <= elem.length - 1; j++) {
                  elem[j].click({ force: true });
                }
              });
            }


            if (check === "selUsrChck") {
              taskPage.taskAssignBtn().click({ force: true });
              cy.wait(2500);
              if (blocknamelist[i].includes("General")) {
                taskPage.assignUsrGeneralBlock().click();
                cy.wait(3500);
              }
              if (blocknamelist[i].includes("Instruction")) {
                taskPage.assignUsrInstructionBlock().click();
                cy.wait(3500);
              }

              cy.get(".userScroll").scrollTo("bottom");
              cy.wait(1500);
            }

            taskPage.taskAssignBtn().click({ force: true });
            cy.wait(1500);
            cy.get(".e-toast-content").should(
              "have.text",
              "Assigned user(s) Successfully"
            );
            taskPage.collpaseBtn(1).click({ force: true });
          }
        }
      });

      taskPage.tasksavBtn().click();
      cy.wait(1500);
      // taskPage.taskCloseBtn().click();
      // cy.wait(2500);
    });

    Cypress.Commands.add("checkschedule", (blocknamelist, scheduledate) => {
      const taskPage = new taskpage();

      taskPage.blockTypes().each(($el, index, $list) => {
        const dayjs = require("dayjs");
        const time = require("time-js");

        var blockName = $el.text();
        cy.log(blockName);

        for (var i = 0; i <= blocknamelist.length - 1; i++) {
          if (blockName.includes(blocknamelist[i])) {
            cy.reload({ timeout: 15000 })
            cy.wait(2000)
            taskPage.expandBtn().click({ force: true })
            cy.wait(4500);

            if (blocknamelist[i].includes("General")) {
              taskPage.assignUsrGeneralBlock().click();
              cy.wait(4500);
            }
            if (blocknamelist[i].includes("Instruction")) {
              taskPage.assignUsrInstructionBlock().click();
              cy.wait(3500);
            }


            taskPage.taskAssignBtn().click({ force: true });
            cy.wait(2500);
            if (blocknamelist[i].includes("General")) {
              taskPage.assignUsrGeneralBlock().click();
              cy.wait(4500);
            }
            if (blocknamelist[i].includes("Instruction")) {
              taskPage.assignUsrInstructionBlock().click();
              cy.wait(3500);
            }

            taskPage.scheduleCalendarBtn().click();
            cy.get("span[title='" + scheduledate + "']").click({ force: true });
            cy.wait(2500);
            taskPage.shceduleName().click();
            cy.wait(1500);
            taskPage.taskPageSchedule().should("have.text", "automationevent");


            taskPage.taskAssignBtn().click({ force: true });
            cy.wait(1500);
            cy.get(".e-toast-content").should(
              "have.text",
              "Assigned user(s) Successfully"
            );
            taskPage.collpaseBtn(1).click({ force: true });
          }
        }
      });

      taskPage.tasksavBtn().click();
      cy.wait(1500);
      // taskPage.taskCloseBtn().click();
      //cy.wait(2500);
    });

    Cypress.Commands.add(
      "FilterCheck",
      (filtercolumn, condtion, filtercondition, locator) => {
        const projectPage = new projectpage();

        projectPage.clickProject().click();
        cy.wait(3500);
        if (
          filtercolumn == data.filtercolumn.project ||
          filtercolumn == data.filtercolumn.projectid ||
          filtercolumn == data.filtercolumn.daysleft
        ) {
          if (filtercolumn == data.filtercolumn.project) {
            projectPage.projectFilter().eq(1).click({ force: true });
            cy.wait(2500);
            projectPage.projectFilterclear().click({ force: true });
            cy.wait(2500);
            projectPage.projectFilter().eq(1).click({ force: true });
            cy.wait(1500);
          }

          if (filtercolumn == data.filtercolumn.projectid) {
            projectPage.projectFilter().eq(0).click({ force: true });
            cy.wait(2500);
            projectPage.projectFilterclear().click({ force: true });
            cy.wait(2500);
            projectPage.projectFilter().eq(0).click({ force: true });
            cy.wait(1500);
          }

          if (filtercolumn == data.filtercolumn.daysleft) {
            projectPage.projectFilter().eq(3).click({ force: true });
            cy.wait(2500);
            projectPage.projectFilterclear().click({ force: true });
            cy.wait(2500);
            projectPage.projectFilter().eq(3).click({ force: true });
            cy.wait(1500);
          }
          projectPage.projgridcolfilter().click();
          cy.xpath(
            "//ul[@class='e-list-parent e-ul ']//li[@role='option'][" +
            filtercondition +
            "]"
          ).click({ force: true });

          if (filtercolumn == data.filtercolumn.daysleft) {
            projectPage.enterdaysleft().clear();
            cy.wait(1000);
            projectPage.enterdaysleft().type(condtion);
            projectPage.incrementdaysleft().click();
            projectPage.decrementdaysleft().click();
            projectPage.filterOK().click({ force: true });
            cy.wait(3500);
          } else {
            projectPage.enterFilterCondition().clear();
            cy.wait(1000);
            projectPage.enterFilterCondition().type(condtion);
            projectPage.filterOK().click({ force: true });
            cy.wait(1500);
          }

          projectPage.pagedropdown().then(function (elem) {
            projectPage.pagecount().eq(0).should("have.text", "10");
            const value1 = elem.text();
            var actualText1 = value1.split(" ");
            cy.log(actualText1[0].slice(1));
            cy.log(actualText1[1]);
            cy.log(value1)

            var num_pages = Math.ceil(actualText1[0].slice(1).trim() / 10);
            cy.log(num_pages);

            for (var i = 1; i <= num_pages; i++) {
              cy.get(locator).each((element) => {
                console.log("element =>", element.text());
                var value = element.text().trim();
                value = value.replace(/\,/g, "");

                if (filtercolumn == data.filtercolumn.daysleft) {
                  if (
                    filtercondition == data.StartDatefiltercondition.GreaterThan
                  ) {
                    Number(value) > Number(condtion)
                      ? expect(true).to.be.true
                      : expect(false).to.be.true;
                  }

                  if (
                    filtercondition ==
                    data.StartDatefiltercondition.GreaterThanEqual
                  ) {
                    Number(value) >= Number(condtion)
                      ? expect(true).to.be.true
                      : expect(false).to.be.true;
                  }

                  if (
                    filtercondition == data.StartDatefiltercondition.LessThan
                  ) {
                    Number(value) < Number(condtion)
                      ? expect(true).to.be.true
                      : expect(false).to.be.true;
                  }

                  if (
                    filtercondition ==
                    data.StartDatefiltercondition.LessThanEqual
                  ) {
                    Number(value) <= Number(condtion)
                      ? expect(true).to.be.true
                      : expect(false).to.be.true;
                  }

                  if (filtercondition == data.StartDatefiltercondition.equal) {
                    parseInt(value) == parseInt(condtion)
                      ? expect(true).to.be.true
                      : expect(false).to.be.true;
                  }
                } else {
                  element.text().includes(condtion)
                }

              });

              cy.wait(2000)
              projectPage.nextpage().eq(0).click();

            }
          });
        }

        if (filtercolumn == data.filtercolumn.StartDate) {
          if (filtercolumn == data.filtercolumn.StartDate) {
            projectPage.projectFilter().eq(4).click();
            cy.wait(2500);
            projectPage.projectFilterclear().click();
            cy.wait(2500);
            projectPage.projectFilter().eq(4).click();
            cy.wait(1500);
          }

          projectPage.projgridcolfilter().click();
          cy.xpath(
            "//ul[@class='e-list-parent e-ul ']//li[@role='option'][" +
            filtercondition +
            "]"
          ).click();

          projectPage.enterfilterdate().clear();
          cy.wait(1000);
          projectPage.enterfilterdate().type(condtion);

          projectPage.filterOK().click({ force: true });

          console.log(cy.get(locator));

          projectPage.pagedropdown().then(function (elem) {
            projectPage.pagecount().eq(0).should("have.text", "10");
            const value1 = elem.text();
            var actualText1 = value1.split(" ");
            cy.log(actualText1[0].slice(1));
            cy.log(actualText1[1]);

            var num_pages = Math.ceil(actualText1[0].slice(1).trim() / 10);
            cy.log(num_pages);

            for (var i = 1; i <= num_pages; i++) {
              cy.get(locator).each((element) => {
                console.log("element =>", element.text());

                var date = element.text();
                console.log(
                  "before conversion =>",
                  date,
                  "condtion=>",
                  condtion
                );
                const [day, month, year] = date.split("-");
                var date1 = new Date(+year, month - 1, +day);

                const [day1, month1, year1] = condtion.split("-");
                var date2 = new Date(+year1, month1 - 1, +day1);
                console.log(
                  "After conversion date1 =",
                  date1,
                  " date2 =",
                  date2
                );

                if (
                  filtercondition == data.StartDatefiltercondition.GreaterThan
                ) {
                  date1 > date2
                    ? expect(true).to.be.true
                    : expect(false).to.be.true;
                }

                if (
                  filtercondition ==
                  data.StartDatefiltercondition.GreaterThanEqual
                ) {
                  date1 >= date2
                    ? expect(true).to.be.true
                    : expect(false).to.be.true;
                }

                if (filtercondition == data.StartDatefiltercondition.LessThan) {
                  date1 < date2
                    ? expect(true).to.be.true
                    : expect(false).to.be.true;
                }

                if (
                  filtercondition == data.StartDatefiltercondition.LessThanEqual
                ) {
                  date1 <= date2
                    ? expect(true).to.be.true
                    : expect(false).to.be.true;
                }

                if (filtercondition == data.StartDatefiltercondition.equal) {
                  if (date1 > date2) {
                    expect(false).to.be.true;
                  } else if (date1 < date2) {
                    expect(false).to.be.true;
                  } else {
                    expect(true).to.be.true;
                  }
                }
              });

              projectPage.nextpage().eq(0).click();
            }
          });
        }
      }
    );

    Cypress.Commands.add(
      "taskAssignFilterCheck",
      (filtercolumn, condtion, filtercondition, locator) => {
        const taskPage = new taskpage();

        const time = require("time-js");

        taskPage.taskAccptBtn().click();
        cy.wait(3500);
        if (
          filtercolumn == data.filtercolumn.username ||
          filtercolumn == data.filtercolumn.acptduration ||
          filtercolumn == data.filtercolumn.acptrolename
        ) {
          if (filtercolumn == data.filtercolumn.username) {
            taskPage.acceptFilter().eq(0).click();
            cy.wait(2500);
            taskPage.acceptFilterClear().click();
            cy.wait(2500);
            taskPage.acceptFilter().eq(0).click();
            cy.wait(1500);
          }

          if (filtercolumn == data.filtercolumn.acptduration) {
            taskPage.acceptFilter().eq(4).click();
            cy.wait(2500);
            taskPage.acceptFilterClear().click();
            cy.wait(2500);
            taskPage.acceptFilter().eq(4).click();
            cy.wait(1500);
          }

          if (filtercolumn == data.filtercolumn.acptrolename) {
            taskPage.acceptFilter().eq(1).click();
            cy.wait(2500);
            taskPage.acceptFilterClear().click();
            cy.wait(2500);
            taskPage.acceptFilter().eq(1).click();
            cy.wait(1500);
          }

          cy.get("span[class='e-input-group-icon e-ddl-icon e-search-icon']")
            .eq(1)
            .click();
          cy.wait(1000);

          cy.xpath(
            "//ul[@class='e-list-parent e-ul ']//li[@role='option'][" +
            filtercondition +
            "]"
          ).click();
          cy.wait(1000);
          taskPage.enterFilterCondition().clear();
          cy.wait(1000);
          taskPage.enterFilterCondition().clear({ force: true });
          cy.wait(1000);
          taskPage.enterFilterCondition().type(condtion);
          cy.wait(1000);
          taskPage.filterOK().click({ force: true });
          cy.wait(1000);

          taskPage.pagedropdown().then(function (elem) {
            taskPage.pagecount().eq(0).should("have.text", "10");
            const value1 = elem.text();
            var actualText1 = value1.split(" ");
            cy.log(actualText1[0].slice(1));
            cy.log(actualText1[1]);

            var num_pages = Math.ceil(actualText1[0].slice(1).trim() / 10);
            cy.log(num_pages);

            for (var i = 1; i <= num_pages; i++) {
              cy.get(locator).each((element) => {
                cy.log("element =>", element.text());
                expect(element.text()).includes(condtion);
              });

              taskPage.nextpage().eq(0).click();
            }
          });
        }

        if (
          filtercolumn == data.filtercolumn.acptstartdate ||
          filtercolumn == data.filtercolumn.acptenddate
        ) {
          if (filtercolumn == data.filtercolumn.acptstartdate) {
            taskPage.acceptFilter().eq(2).click();
            cy.wait(2500);
            taskPage.acceptFilterClear().click();
            cy.wait(2500);
            taskPage.acceptFilter().eq(2).click();
            cy.wait(2500);
          }

          if (filtercolumn == data.filtercolumn.acptenddate) {
            taskPage.acceptFilter().eq(3).click();
            cy.wait(2500);
            taskPage.acceptFilterClear().click();
            cy.wait(2500);
            taskPage.acceptFilter().eq(3).click();
            cy.wait(2500);
          }
          cy.get("span[class='e-input-group-icon e-ddl-icon e-search-icon']")
            .eq(1)
            .click();
          cy.wait(2500);

          cy.xpath(
            "//ul[@class='e-list-parent e-ul ']//li[@role='option'][" +
            filtercondition +
            "]"
          ).click();
          cy.wait(2500);

          taskPage.enteracptdatefilter().clear({ force: true });
          cy.wait(1000);
          taskPage.enteracptdatefilter().type(condtion);
          cy.wait(1000);
          taskPage.filterOK().click({ force: true });
          cy.wait(1000);

          taskPage.pagedropdown().then(function (elem) {
            taskPage.pagecount().eq(0).should("have.text", "10");
            const value1 = elem.text();
            var actualText1 = value1.split(" ");
            cy.log(actualText1[0].slice(1));
            cy.log(actualText1[1]);

            var num_pages = Math.ceil(actualText1[0].slice(1).trim() / 10);
            cy.log(num_pages);

            for (var i = 1; i <= num_pages; i++) {
              cy.get(locator).each((element) => {
                console.log("element =>", element.text());

                var date = element.text();
                console.log(
                  "before conversion =>",
                  date,
                  "condtion=>",
                  condtion
                );
                const [day, month, year] = date.split("-");
                var date1 = new Date(+year, month - 1, +day);

                const [day1, month1, year1] = condtion.split("-");
                var date2 = new Date(+year1, month1 - 1, +day1);
                console.log(
                  "After conversion date1 =",
                  date1,
                  " date2 =",
                  date2
                );

                if (
                  filtercondition == data.StartDatefiltercondition.GreaterThan
                ) {
                  date1 > date2
                    ? expect(true).to.be.true
                    : expect(false).to.be.true;
                }

                if (
                  filtercondition ==
                  data.StartDatefiltercondition.GreaterThanEqual
                ) {
                  date1 >= date2
                    ? expect(true).to.be.true
                    : expect(false).to.be.true;
                }

                if (filtercondition == data.StartDatefiltercondition.LessThan) {
                  date1 < date2
                    ? expect(true).to.be.true
                    : expect(false).to.be.true;
                }

                if (
                  filtercondition == data.StartDatefiltercondition.LessThanEqual
                ) {
                  date1 <= date2
                    ? expect(true).to.be.true
                    : expect(false).to.be.true;
                }

                if (filtercondition == data.StartDatefiltercondition.equal) {
                  if (date1 > date2) {
                    expect(false).to.be.true;
                  } else if (date1 < date2) {
                    expect(false).to.be.true;
                  } else {
                    expect(true).to.be.true;
                  }
                }
              });

              taskPage.nextpage().eq(0).click();
            }
          });
        }

        taskPage.accptCloseBtn().click()
        cy.wait(1000)
        taskPage.tasksavBtn().click()

      }
    );

    Cypress.Commands.add("accptfltrclearfilter", (filtercolumn) => {
      const taskPage = new taskpage();
      taskPage.taskAccptBtn().click();
      cy.wait(3500);

      if (filtercolumn == data.filtercolumn.username) {
        taskPage.acceptFilter().eq(0).click({ force: true });
        cy.wait(1500);
        taskPage.acceptFilterClear().click({ force: true });
        cy.wait(1500);
      }

      if (filtercolumn == data.filtercolumn.acptstartdate) {
        taskPage.acceptFilter().eq(2).click({ force: true });
        cy.wait(1500);
        taskPage.acceptFilterClear().click({ force: true });
        cy.wait(1500);
      }

      if (filtercolumn == data.filtercolumn.acptenddate) {
        taskPage.acceptFilter().eq(3).click({ force: true });
        cy.wait(1500);
        taskPage.acceptFilterClear().click({ force: true });
        cy.wait(1500);
      }

      taskPage.accptCloseBtn().click()
      cy.wait(2000)
      taskPage.tasksavBtn().click()
      cy.wait(2000)

    });

    Cypress.Commands.add("openproj", (name) => {
      const taskPage = new taskpage();



      taskPage.clickProject().click({ force: true });
      cy.wait(5000);
      taskPage.projectFilter().eq(1).click({ force: true })
      cy.wait(1500);
      taskPage.enterFilterCondition().clear({ force: true });
      cy.wait(1500);
      taskPage.enterFilterCondition().type(name, { force: true })
      cy.wait(1000)
      taskPage.filterOK().click({ force: true });
      cy.wait(2000)
      taskPage.deleteValidation().then(function (elem) {
        if (elem.text() == "No records to display") {
          cy.reload({ timeout: 15000 })
          cy.wait(3500)
          taskPage.sopBtn().click({ force: true });
          cy.wait(1500);
          taskPage.clickProject().click({ force: true });
          cy.wait(5000);
          taskPage.projectFilter().eq(1).click({ force: true })
          cy.wait(1500);
          taskPage.enterFilterCondition().clear({ force: true });
          cy.wait(1500);
          taskPage.enterFilterCondition().type(name, { force: true })
          cy.wait(1000)
          taskPage.filterOK().click({ force: true });
          cy.wait(2000)
        } else {
          cy.log("Project Already loaded " + elem.text());
        }
      })
    });

    Cypress.Commands.add("opentask", (taskname) => {
      const taskPage = new taskpage();

      taskPage.taskBtn().click({ force: true });
      cy.wait(1000);
      taskPage.sopBtn().click({ force: true });
      cy.wait(1500);
      taskPage.expBtn().click({ force: true });
      cy.wait(6500);
      taskPage.expNmaeFilter().eq(0).click({ force: true })
      cy.wait(1500);
      taskPage.enterFilterCondition().clear({ force: true });
      cy.wait(2000);
      taskPage.enterFilterCondition().type(taskname)
      cy.wait(1000)
      taskPage.filterOK().click({ force: true });
      cy.wait(3500);

      taskPage.deleteValidation().then(function (elem) {
        if (elem.text() == "No records to display") {
          cy.reload({ timeout: 15000 })
          cy.wait(3500)
          taskPage.taskBtn().click({ force: true });
          cy.wait(1000);
          taskPage.sopBtn().click({ force: true });
          cy.wait(1500);
          taskPage.expBtn().click({ force: true });
          cy.wait(6500);
          taskPage.expNmaeFilter().eq(0).click({ force: true })
          cy.wait(1500);
          taskPage.enterFilterCondition().clear({ force: true });
          cy.wait(2000);
          taskPage.enterFilterCondition().type(taskname);
          cy.wait(1000)
          taskPage.filterOK().click({ force: true });
          cy.wait(3500);
        } else {
          cy.log("Task Already loaded " + elem.text());
        }
      })



    });

    Cypress.Commands.add("opentaskexecution", (taskname) => {
      const taskPage = new taskpage();
      taskPage.taskBtn().click({ force: true });
      cy.wait(1500);
      taskPage.sopBtn().click({ force: true });
      cy.wait(1500);
      taskPage.taskBtn().click({ force: true });
      cy.wait(1500);
      taskPage.expBtn().click();
      cy.wait(6500);
      taskPage.expNmaeFilter().eq(0).click({ force: true });
      cy.wait(1500);
      taskPage.enterFilterCondition().type(taskname)
      cy.wait(1500);
      taskPage.filterOK().click({ force: true });
      cy.wait(2500);
      taskPage.deleteValidation().then(function (elem) {
        if (elem.text() == "No records to display") {
          cy.reload({ timeout: 15000 })
          cy.wait(3500)
          taskPage.taskBtn().click({ force: true });
          cy.wait(1500);
          taskPage.sopBtn().click({ force: true });
          cy.wait(1500);
          taskPage.taskBtn().click({ force: true });
          cy.wait(1500);
          taskPage.expBtn().click();
          cy.wait(6500);
          taskPage.expNmaeFilter().eq(0).click({ force: true });
          cy.wait(1500);
          taskPage.enterFilterCondition().type(taskname)
          cy.wait(1500);
          taskPage.filterOK().click({ force: true });
          cy.wait(2500);
          taskPage.taskActionBtn().eq(0).click({ force: true });
          cy.wait(1500);
          taskPage.taskExecuteBtn().eq(0).click({ force: true });
          cy.wait(2000);
        } else {
          cy.log("task Already loaded " + elem.text());
          taskPage.taskActionBtn().eq(0).click({ force: true });
          cy.wait(1500);
          taskPage.taskExecuteBtn().eq(0).click({ force: true });
          cy.wait(2000);


        }
      })




    });

    Cypress.Commands.add("addschedulewithtimezone", (scheduledate, formatteddate) => {
      const taskPage = new taskpage();
      const dayjs = require("dayjs");
      taskPage.taskAccptBtn().click()
      cy.wait(3500)
      taskPage.scheduleCalendarBtn().click({ force: true });
      cy.get("span[title='" + scheduledate + "']").click({ force: true });
      cy.wait(2000);
      cy.xpath("//span[contains(text(),'" + formatteddate + "')]").click({ force: true });
      cy.wait(3000);
      taskPage.scheduleTitle().type("automationevent");
      taskPage.addMoreDetailsBtn().click();
      taskPage.addschedulelocation().type("India");
      taskPage.schedulerAllDayBox().should("be.checked").uncheck();
      taskPage.schedulerTimezoneBox().should("not.be.checked").check();
      var starttime = dayjs().format("MM/DD/YY hh:mm A");
      var endtime = dayjs().add(60, "minutes").format("MM/DD/YY hh:mm A");
      taskPage.schedulerStartTime().clear();
      cy.wait(1000);
      taskPage.schedulerStartTime().type(starttime);
      taskPage.schedulerEndTime().clear();
      cy.wait(1000);
      taskPage.schedulerEndTime().type(endtime);
      taskPage.startTimeZone().click();
      cy.get(".e-input-filter").type("india");
      cy.wait(1000);
      cy.get("li[role='option']").eq(0).click();
      cy.wait(1000);
      taskPage.endTimeZone().click();
      cy.get(".e-input-filter").type("india");
      cy.wait(1000);
      cy.get("li[role='option']").eq(0).click();

      taskPage.saveSchedule().click();
      cy.get(".e-toast-content").should(
        "have.text",
        "Schedule added successfully"
      );
      taskPage.accptCloseBtn().click()
      taskPage.tasksavBtn().click()
      // taskPage.taskCloseBtn().click()
      cy.wait(2000);
    })

    Cypress.Commands.add("acttaskfilter", (taskname, blockname) => {
      const taskPage = new taskpage();
      taskPage.accptTaskNameFltr().click({ force: true });
      cy.wait(2500);
      taskPage.enterFilterCondition().clear({ force: true });
      cy.wait(1000);
      taskPage.enterFilterCondition().type(taskname);
      cy.wait(1500);
      taskPage.filterOK().click({ force: true });
      cy.wait(1500);
      cy.get(".e-gridcontent > .e-content").scrollTo("right");
      taskPage.accptTaskBlockFltr().click();
      cy.wait(1500);
      taskPage.enterFilterCondition().type(blockname);
      cy.wait(1500);
      taskPage.filterOK().click({ force: true });
      cy.wait(1500);
      taskPage.accptTaskActBtn().eq(0).click()
      cy.wait(1000)
    })

    Cypress.Commands.add("testdatacreateProj", (name, priority, days,) => {
      const projectPage = new projectpage();

      const dayjs = require("dayjs");
      projectPage.clickProject().click({ force: true });
      cy.wait(5500);
      projectPage.addProject().click({ force: true });
      projectPage.enterProjectName().type(name, { force: true });
      cy.get(":nth-child(2) > .select").select(data.all.Project_Owner, { force: true });
      cy.get(":nth-child(3) > .select").select(data.all.Project_Manager, { force: true });
      cy.wait(1500);
      projectPage.enterStartDate().clear();
      projectPage.enterStartDate().type(dayjs().add(days, 'days').format("DD/MM/YYYY"));
      cy.wait(1500);
      projectPage.enterDueDate().clear();
      projectPage.enterDueDate().type(dayjs().add(days, 'days').format("DD/MM/YYYY"));
      projectPage.enterTagName().type(data.all.Tagname);
      cy.get("#" + priority).click({ force: true });
      projectPage.addTag().click();
      projectPage.enterDescription().type(data.all.Description);
      projectPage.createProject().click();
      cy.wait(1000);

      cy.get(".e-toast-content").should(
        "have.text",
        "You have successfully created a Project-" + name
      );
      cy.wait(1500);
      projectPage.closeBtn().click()
    });

    Cypress.Commands.add("testdatacreation", () => {

      const projectPage = new projectpage();

      cy.testdatacreateProj('Autotestdata1', 'Low', 0)
      cy.wait(3000)
      cy.testdatacreateProj('Autotestdata2', 'Low', 1)
      cy.wait(3000)
      cy.testdatacreateProj('Autotestdata3', 'Low', 2)
      cy.wait(3000)
      cy.testdatacreateProj('Autotestdata4', 'Low', 0)
      cy.wait(3000)
      cy.testdatacreateProj('Autotestdata5', 'Low', 1)
      cy.wait(3000)
      cy.testdatacreateProj('Autotestdata6', 'High', 2)
      cy.wait(3000)
      cy.testdatacreateProj('Autotestdata7', 'High', 3)
      cy.wait(3000)
      cy.testdatacreateProj('Autotestdata8', 'High', 4)
      cy.wait(3000)
      cy.testdatacreateProj('Autotestdata9', 'High', 5)
      cy.wait(3000)
      cy.testdatacreateProj('Autotestdata10', 'High', 6)
      cy.wait(3000)
      cy.testdatacreateProj('Autotestdata11', 'Urgent', 1)
      cy.wait(3000)
      cy.testdatacreateProj('Autotestdata12', 'Urgent', 2)
      cy.wait(3000)
      cy.testdatacreateProj('Autotestdata13', 'Urgent', 3)
      cy.wait(3000)
      cy.testdatacreateProj('Autotestdata14', 'Urgent', 4)
      cy.wait(3000)
      cy.testdatacreateProj('Autotestdata15', 'Urgent', 5)
      cy.wait(3000)

      cy.Filtering("Autotestdata1", data.TC17.state1, data.all.loc_state)

      cy.Statuchange("Autotestdata1", data.TC17.state1, data.TC17.check_loc, data.TC17.state2)
      cy.wait(3000)
      cy.Filtering("Autotestdata2", data.TC17.state1, data.all.loc_state)
      cy.Statuchange("Autotestdata2", data.TC17.state1, data.TC17.check_loc, data.TC17.state2)
      cy.wait(3000)
      cy.Filtering("Autotestdata3", data.TC17.state1, data.all.loc_state)
      cy.Statuchange("Autotestdata3", data.TC17.state1, data.TC17.check_loc, data.TC17.state2)
      cy.wait(3000)
      cy.Filtering("Autotestdata4", data.TC17.state1, data.all.loc_state)
      cy.Statuchange("Autotestdata4", data.TC17.state1, data.TC17.check_loc, data.TC17.state3)
      cy.wait(3000)
      cy.Filtering("Autotestdata5", data.TC17.state1, data.all.loc_state)
      cy.Statuchange("Autotestdata5", data.TC17.state1, data.TC17.check_loc, data.TC17.state3)
      cy.wait(3000)
      cy.Filtering("Autotestdata6", data.TC17.state1, data.all.loc_state)
      cy.Statuchange("Autotestdata6", data.TC17.state1, data.TC17.check_loc, data.TC17.state3)
      cy.wait(3000)
      cy.Filtering("Autotestdata7", data.TC17.state1, data.all.loc_state)
      cy.Statuchange("Autotestdata7", data.TC17.state1, data.TC17.check_loc, data.TC17.state4)
      cy.wait(3000)
      cy.Filtering("Autotestdata8", data.TC17.state1, data.all.loc_state)
      cy.Statuchange("Autotestdata8", data.TC17.state1, data.TC17.check_loc, data.TC17.state4)
      cy.wait(3000)
      cy.Filtering("Autotestdata9", data.TC17.state1, data.all.loc_state)
      cy.Statuchange("Autotestdata9", data.TC17.state1, data.TC17.check_loc, data.TC17.state4)
      cy.wait(3000)
      cy.Filtering("Autotestdata10", data.TC17.state1, data.all.loc_state)
      cy.Statuchange("Autotestdata10", data.TC17.state1, data.TC17.check_loc, data.TC17.state2)
      cy.wait(3000)
      cy.Filtering("Autotestdata11", data.TC17.state1, data.all.loc_state)
      cy.Statuchange("Autotestdata11", data.TC17.state1, data.TC17.check_loc, data.TC17.state2)


    });

    Cypress.Commands.add("testdatadeletion", () => {

      const projectPage = new projectpage();
      cy.Filtering('Autotestdata1', 'Autotestdata1', data.TC02.col_locator)
      cy.DeleteProj('Autotestdata1')
      cy.wait(3000)

      cy.Filtering('Autotestdata2', 'Autotestdata2', data.TC02.col_locator)
      cy.DeleteProj('Autotestdata2')
      cy.wait(3000)

      cy.Filtering('Autotestdata3', 'Autotestdata3', data.TC02.col_locator)
      cy.DeleteProj('Autotestdata3')
      cy.wait(3000)

      cy.Filtering('Autotestdata4', 'Autotestdata4', data.TC02.col_locator)
      cy.DeleteProj('Autotestdata4')
      cy.wait(3000)

      cy.Filtering('Autotestdata5', 'Autotestdata5', data.TC02.col_locator)
      cy.DeleteProj('Autotestdata5')
      cy.wait(3000)

      cy.Filtering('Autotestdata6', 'Autotestdata6', data.TC02.col_locator)
      cy.DeleteProj('Autotestdata6')
      cy.wait(3000)

      cy.Filtering('Autotestdata7', 'Autotestdata7', data.TC02.col_locator)
      cy.DeleteProj('Autotestdata7')
      cy.wait(3000)

      cy.Filtering('Autotestdata8', 'Autotestdata8', data.TC02.col_locator)
      cy.DeleteProj('Autotestdata8')
      cy.wait(3000)

      cy.Filtering('Autotestdata9', 'Autotestdata9', data.TC02.col_locator)
      cy.DeleteProj('Autotestdata9')
      cy.wait(3000)

      cy.Filtering('Autotestdata10', 'Autotestdata10', data.TC02.col_locator)
      cy.DeleteProj('Autotestdata10')
      cy.wait(3000)

      cy.Filtering('Autotestdata11', 'Autotestdata11', data.TC02.col_locator)
      cy.DeleteProj('Autotestdata11')
      cy.wait(3000)

      cy.Filtering('Autotestdata12', 'Autotestdata12', data.TC02.col_locator)
      cy.DeleteProj('Autotestdata12')
      cy.wait(3000)

      cy.Filtering('Autotestdata13', 'Autotestdata13', data.TC02.col_locator)
      cy.DeleteProj('Autotestdata13')
      cy.wait(3000)

      cy.Filtering('Autotestdata14', 'Autotestdata14', data.TC02.col_locator)
      cy.DeleteProj('Autotestdata14')
      cy.wait(3000)

      cy.Filtering('Autotestdata15', 'Autotestdata15', data.TC02.col_locator)
      cy.DeleteProj('Autotestdata15')
      cy.wait(3000)

    });


  });

  Cypress.Commands.add("login", (email, password) => {
    const loginPage = new loginpage();
    cy.visit(Cypress.env("url"));
    loginPage.getEmail().type(email);
    loginPage.login().click();
    loginPage.getPassword().type(password);
    loginPage.login().click();
    cy.EnterToken();
    cy.get(".gig-tfa-button").click();
    cy.wait(15000);
  });

});
