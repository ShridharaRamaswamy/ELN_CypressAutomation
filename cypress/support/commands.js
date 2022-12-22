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
        url: "https://api.testdataservices.com.au/v0001F_GetGoogleAuthCode?Email=shridhara.ramaswamy@yokogawa.com&SecretKey=2QNNKKTOTTQBMLKYXWFA6V4DPP3VBMTT&SubscriptionKey=GJFFwxeVFHfcL3RN3FZEUGdYJSAVAUnJ",

        headers: {
          accept: "application/json",
        },
      }).then((response) => {
        let body = JSON.parse(JSON.stringify(response.body));
        cy.wait(2000);
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
        cy.wait(4000);
        projectPage.searchbox().type(collaboratorlist[i]);
        cy.wait(5000);
        projectPage.selectnames().then(function (elem) {
          cy.log(elem.length);

          for (i = 0; i <= elem.length - 1; i++) {
            elem[i].click();
            projectPage.assetdrodown().eq(i).select(0);
          }

          projectPage.selusrslist().then(function (usrs) {
            cy.log(usrs.length);
            usercount = usercount + parseInt(usrs.length);
            projectPage.searchbox().clear();
            projectPage.selbtn().eq(0).click();
            cy.wait(3000);
            cy.get(".e-toast-content").should(
              "have.text",
              "Assigned user(s) Successfully"
            );
            cy.wait(2000);

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
        cy.wait(4000);
        projectPage.searchgroup().click();
        projectPage.searchgroup().type(grouplist[i]);
        cy.wait(5000);
        projectPage.selectgroup().click();
        cy.wait(3000);
        projectPage.groupitems().then(function (elem) {
          for (i = 0; i <= elem.length - 1; i++) {
            projectPage.assetdrodown().eq(i).select(0);
          }
          listcount = listcount + elem.length;
          projectPage.searchgroup().clear();
          cy.wait(3000);
          projectPage.selbtn().eq(0).click();
          cy.wait(3000);
          cy.get(".e-toast-content").should(
            "have.text",
            "Assigned user(s) Successfully"
          );
          cy.wait(2000);
          projectPage.collaboratorCount().should("have.text", "+" + listcount);
          listcount = 0;
        });
      }
    });

    Cypress.Commands.add("addallCollaborator", () => {
      const projectPage = new projectpage();

      var usercount = 0;
      projectPage.addcollborator().click();
      cy.wait(4000);
      projectPage.selectnames().then(function (elem) {
        cy.log(elem.length);

        for (var i = 0; i <= elem.length - 1; i++) {
          elem[i].click();
          projectPage.assetdrodown().eq(i).select(0);
        }

        usercount = usercount + parseInt(elem.length);

        projectPage.selbtn().eq(0).click();
        cy.wait(2000);
        cy.get(".e-toast-content").should(
          "have.text",
          "Assigned user(s) Successfully"
        );
        cy.wait(2000);

        projectPage.collaboratorCount().should("have.text", "+" + usercount);
        usercount = 0;
      });
    });

    Cypress.Commands.add(
      "addProjwithcollaborator",
      (name, priority, userlist, usertype) => {
        const projectPage = new projectpage();

        const dayjs = require("dayjs");

        projectPage.clickProject().click();
        projectPage.addProject().click();
        projectPage.enterProjectName().type(name);
        cy.get(":nth-child(2) > .select").select(data.all.Project_Owner);
        cy.get(":nth-child(3) > .select").select(data.all.Project_Manager);
        cy.wait(2000);
        projectPage.enterStartDate().clear();
        projectPage.enterStartDate().type(dayjs().format("DD/MM/YYYY"));
        cy.wait(2000);
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

        cy.wait(3000);

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
      cy.wait(2000);
      projectPage.projectFilter().eq(1).click();
      projectPage.enterFilterCondition().type(name);
      projectPage.filterOK().click({ force: true });
      cy.wait(2000);
      projectPage.selectProject().eq(1).click();
      projectPage.editBtn().click();
      cy.wait(3000);
      if (usertype == "group") {
        cy.addgroupCollaborator(editlist);
      } else if (usertype == "user") {
        cy.addCollaborator(editlist);
      } else if (usertype == "all") {
        cy.addallCollaborator();
      }
      cy.wait(2000);
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
      cy.wait(2000);
      projectPage.projectFilter().eq(1).click();
      projectPage.enterFilterCondition().type(name);
      projectPage.filterOK().click({ force: true });
      cy.wait(2000);
      projectPage.selectProject().eq(1).click();
      projectPage.editBtn().click();
      cy.wait(3000);

      projectPage.addcollborator().click();
      cy.wait(4000);
      projectPage.removeUsrBtn().eq(1).click();
      cy.wait(2000);
      projectPage.groupitems().then(function (elem) {
        var listcount = elem.length;
        projectPage.searchgroup().clear();
        cy.wait(3000);
        projectPage.selbtn().eq(0).click();
        cy.wait(3000);
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
      cy.wait(5000);
      projectPage.clickProject().click({ force: true });
      cy.wait(5000);
      projectPage.addProject().click({ force: true });
      projectPage.enterProjectName().type(name);
      cy.get(":nth-child(2) > .select").select(data.all.Project_Owner);
      cy.get(":nth-child(3) > .select").select(data.all.Project_Manager);
      cy.wait(2000);
      projectPage.enterStartDate().clear();
      projectPage.enterStartDate().type(dayjs().format("DD/MM/YYYY"));
      cy.wait(2000);
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
      cy.wait(2000);
    });

    Cypress.Commands.add("Filtering", (projName, column, locator) => {
      const projectPage = new projectpage();

      projectPage.clickProject().click();
      cy.wait(4000);
      projectPage.projectFilter().eq(1).click({ force: true });
      cy.wait(3000);
      projectPage.enterFilterCondition().type(projName);
      cy.wait(3000);
      projectPage.filterOK().click({ force: true });
      cy.get(locator).should("have.text", column);
    });

    Cypress.Commands.add("Updateproj", (name) => {
      const projectPage = new projectpage();

      projectPage.clickProject().click();
      cy.wait(2000);
      projectPage.projectFilter().eq(1).click();
      projectPage.enterFilterCondition().type(name);
      projectPage.filterOK().click({ force: true });
      cy.wait(2000);
      projectPage.selectProject().eq(1).click();
      projectPage.editBtn().click();
      cy.wait(3000);
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
      cy.wait(2000);
      projectPage.deletebtn().click();
      projectPage.deletebtnYes().click();
      cy.wait(1000);
      cy.get(".e-toast-content").should(
        "have.text",
        "You have successfully deleted a Project"
      );
      cy.wait(3000);
      projectPage.projectFilter().eq(1).click();
      cy.wait(3000);
      projectPage.enterFilterCondition().type(projName, { force: true });
      cy.wait(3000);
      projectPage.filterOK().click({ force: true });
      projectPage
        .deleteValidation()
        .should("have.text", "No records to display");
      cy.clearfilter(data.filtercolumn.project);
    });

    Cypress.Commands.add("Removeusr", (projName) => {
      const projectPage = new projectpage();

      projectPage.clickProject().click();
      cy.wait(2000);
      projectPage.projectFilter().eq(1).click();
      projectPage.enterFilterCondition().type(name);
      projectPage.filterOK().click({ force: true });
      cy.wait(2000);
      projectPage.selectProject().eq(1).click();
      projectPage.editBtn().click();
      cy.wait(3000);

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
        cy.wait(3000);
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
      projectPage.addProject().click();
      projectPage.enterProjectName().type(name);
      cy.get(":nth-child(2) > .select").select(data.all.Project_Owner);
      cy.get(":nth-child(3) > .select").select(data.all.Project_Manager);
      cy.wait(2000);
      projectPage.enterStartDate1().clear();
      projectPage.enterStartDate1().type(dayjs().format("DD/MM/YYYY"));
      cy.wait(2000);
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
        cy.wait(4000);
        if (
          filtercolumn == data.filtercolumn.project ||
          filtercolumn == data.filtercolumn.projectid ||
          filtercolumn == data.filtercolumn.daysleft
        ) {
          if (filtercolumn == data.filtercolumn.project) {
            projectPage.projectFilter().eq(1).click();
            cy.wait(3000);
            projectPage.projectFilterclear().click();
            cy.wait(3000);
            projectPage.projectFilter().eq(1).click();
            cy.wait(2000);
          }

          if (filtercolumn == data.filtercolumn.projectid) {
            projectPage.projectFilter().eq(0).click();
            cy.wait(3000);
            projectPage.projectFilterclear().click();
            cy.wait(3000);
            projectPage.projectFilter().eq(0).click();
            cy.wait(2000);
          }

          if (filtercolumn == data.filtercolumn.daysleft) {
            projectPage.projectFilter().eq(3).click({ force: true });
            cy.wait(3000);
            projectPage.projectFilterclear().click({ force: true });
            cy.wait(3000);
            projectPage.projectFilter().eq(3).click({ force: true });
            cy.wait(2000);
          }
          projectPage.projgridcolfilter().eq(1).click();
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
            cy.wait(4000);
          } else {
            projectPage.enterFilterCondition().clear();
            cy.wait(1000);
            projectPage.enterFilterCondition().type(condtion);
            projectPage.filterOK().click({ force: true });
            cy.wait(2000);
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
            cy.wait(3000);
            projectPage.projectFilterclear().click();
            cy.wait(3000);
            projectPage.projectFilter().eq(4).click();
            cy.wait(2000);
          }

          projectPage.projgridcolfilter().eq(1).click();
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
        cy.wait(3000);

        if (filtercolumn == data.filtercolumn.priority) {
          cy.wait(5000);
          projectPage.projectFilter().eq(5).click({ force: true });
          cy.wait(2000);
          // cy.get("button[class='e-control e-btn e-lib e-flat']").click({ force: true })
          cy.wait(2000);
          projectPage.projectFilter().eq(5).click({ force: true });
          cy.wait(2000);

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
            cy.wait(5000);
          }

          if (filtercondition == data.Priority.Low) {
            cy.get("div[class*='e-ftrchk'] input[type='checkbox']")
              .eq(2)
              .check()
              .should("have.value", "on");
            cy.get(
              "button[class='e-control e-btn e-lib e-primary e-flat']"
            ).click({ force: true });
            cy.wait(5000);
          }

          if (filtercondition == data.Priority.Urgent) {
            cy.get("input[placeholder='Search']").eq(1).type(filtercondition);
            cy.wait(2000);
            cy.get(
              "button[class='e-control e-btn e-lib e-primary e-flat']"
            ).click({ force: true });
            cy.wait(3000);
          }
        }

        if (filtercolumn == data.filtercolumn.State) {
          cy.wait(5000);
          projectPage.projectFilter().eq(6).click({ force: true });
          cy.wait(2000);
          cy.get("button[class='e-control e-btn e-lib e-flat']").click({
            force: true,
          });
          cy.wait(2000);
          projectPage.projectFilter().eq(6).click({ force: true });
          cy.wait(2000);

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
            cy.wait(2000);
          }

          if (filtercondition == data.State.Blocked) {
            cy.get("div[class*='e-ftrchk'] input[type='checkbox']")
              .eq(2)
              .check()
              .should("have.value", "on");
            cy.get(
              "button[class='e-control e-btn e-lib e-primary e-flat']"
            ).click({ force: true });
            cy.wait(2000);
          }

          if (filtercondition == data.State.Completed) {
            cy.get("div[class*='e-ftrchk'] input[type='checkbox']")
              .eq(3)
              .check()
              .should("have.value", "on");
            cy.get(
              "button[class='e-control e-btn e-lib e-primary e-flat']"
            ).click({ force: true });
            cy.wait(2000);
          }

          if (filtercondition == data.State.Archived) {
            cy.get("div[class*='e-ftrchk'] input[type='checkbox']")
              .eq(1)
              .check()
              .should("have.value", "on");
            cy.get(
              "button[class='e-control e-btn e-lib e-primary e-flat']"
            ).click({ force: true });
            cy.wait(2000);
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
      cy.wait(2000);

      if (filtercolumn == data.filtercolumn.project) {
        projectPage.projectFilter().eq(1).click({ force: true });
        cy.wait(2000);
        projectPage.projectFilterclear().click({ force: true });
        cy.wait(2000);
      }
      if (filtercolumn == data.filtercolumn.StartDate) {
        projectPage.projectFilter().eq(4).click({ force: true });
        cy.wait(2000);
        projectPage.projectFilterclear().click({ force: true });
        cy.wait(2000);
      }
      if (filtercolumn == data.filtercolumn.projectid) {
        projectPage.projectFilter().eq(0).click({ force: true });
        cy.wait(2000);
        projectPage.projectFilterclear().click({ force: true });
        cy.wait(2000);
      }
      if (filtercolumn == data.filtercolumn.daysleft) {
        projectPage.projectFilter().eq(3).click({ force: true });
        cy.wait(2000);
        projectPage.projectFilterclear().click({ force: true });
        cy.wait(2000);
      }
      if (filtercolumn == data.filtercolumn.priority) {
        projectPage.projectFilter().eq(5).click({ force: true });
        cy.wait(2000);
        cy.get("button[class='e-control e-btn e-lib e-flat']").click({
          force: true,
        });
        cy.wait(2000);
      }
      if (filtercolumn == data.filtercolumn.State) {
        projectPage.projectFilter().eq(6).click({ force: true });
        cy.wait(2000);
        cy.get("button[class='e-control e-btn e-lib e-flat']").click({
          force: true,
        });
        cy.wait(2000);
      }
    });

    Cypress.Commands.add("pagination", (num, page) => {
      const projectPage = new projectpage();
      if (page == "project") {
        projectPage.clickProject().click();
        cy.wait(5000);
      }

      if (page == "accept") {
        const taskPage = new taskpage();
        taskPage.taskBtn().click();
        cy.wait(3000);
        taskPage.sopBtn().click({ force: true });
        cy.wait(2000);
        taskPage.expBtn().click({ force: true });
        cy.wait(5000);
        taskPage.expNmaeFilter().eq(0).click();
        cy.wait(3000);
        taskPage.enterFilterCondition().type(data.TC63.taskname);
        cy.wait(3000);
        taskPage.filterOK().click({ force: true });
        cy.wait(2000);
        taskPage.taskActionBtn().eq(0).click();
        cy.wait(3000);
        taskPage.taskExecuteBtn().eq(0).click();
        cy.wait(3000);
        taskPage.taskAccptBtn().click({ force: true });
        cy.wait(3000);
      }

      cy.wait(5000);
      if (num === 5) {
        projectPage.countdropdown().eq(0).click();
        cy.xpath(
          "//ul[@class='e-list-parent e-ul ']//li[@data-value='" + num + "']"
        ).click();

        cy.wait(2000);
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
        cy.wait(2000);
        projectPage.firstpage().eq(1).click();
        cy.countcheck(num);
      }
      if (num === 10 || num == 20 || num == 50 || num == 100) {
        projectPage.countdropdown().eq(0).click();
        cy.xpath(
          "//ul[@class='e-list-parent e-ul ']//li[@data-value='" + num + "']"
        ).click();
        cy.wait(2000);
        projectPage.pagecount().eq(0).should("have.text", num);
        cy.countcheck(num);
        projectPage.nextpage().eq(0).click();
        cy.countcheck(num);
        projectPage.previouspage().eq(0).click({ force: true });
        cy.countcheck(num);
        projectPage.lastpage().eq(0).click();
        cy.countcheck(num);
        cy.wait(2000);
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
      taskPage.taskBtn().click();
      cy.wait(2000);
      taskPage.sopBtn().click({ force: true });
      cy.wait(2000);
      taskPage.expBtn().click({ force: true });
      cy.wait(3000);
      taskPage.addExpBtn().click({ force: true });
      cy.wait(4000);
      taskPage.expProjectFilter().eq(1).click();
      cy.wait(2000);
      taskPage.enterFilterCondition().type(name);
      taskPage.filterOK().click({ force: true });
      cy.wait(1000);

      taskPage.selProjTemp().click();

      cy.wait(1000);

      taskPage.selectionBtn().click();
      cy.wait(2000);
      taskPage.tempNameFilter().click();
      cy.wait(1000);
      taskPage.enterFilterCondition().type(templatename);
      taskPage.filterOK().click({ force: true });
      cy.wait(3000);
      taskPage.selTemp().click();
      cy.wait(1000);
      taskPage.selectionTempBtn().click();
      cy.wait(3000);

      taskPage.blockTypes().each(($el, index, $list) => {
        const dayjs = require("dayjs");
        const time = require("time-js");

        var blockName = $el.text();
        cy.log(blockName);

        switch (blockName.trim()) {
          case "General Information":
            taskPage.expandBtn(index).click({ force: true });
            cy.wait(3000);
            taskPage.enterTaskName().clear();
            cy.wait(2000);
            taskPage.enterTaskName().type(taskname);
            taskPage.enterStartDate().clear();
            cy.wait(2000);
            taskPage.enterStartDate().type(dayjs().format("DD/MM/YYYY"));
            cy.wait(3000);
            taskPage.enterDueDate().clear();
            taskPage
              .enterDueDate()
              .type(dayjs().add(1, "day").format("DD-MM-YYYY"));
            cy.wait(3000);
            taskPage.enterDuration().type(time().format("hh:mm"));
            cy.wait(3000);
            taskPage.enterDesc().eq(0).type(data.TC52.desc);
            taskPage.collpaseBtn(index).click({ force: true });
            cy.wait(3000);
            break;
          case "Instruction":
            taskPage.expandBtn(index).click({ force: true });
            taskPage.instructionblockname().click();
            cy.wait(2000);
            taskPage.instructionblockname().clear();
            cy.wait(2000);
            taskPage.instructionblockname().type(taskname);
            cy.wait(2000);
            taskPage.instructionblockdesc().clear();
            cy.wait(2000);
            taskPage.instructionblockdesc().type(data.TC52.desc);
            cy.wait(2000);
            taskPage.instructionblockdesc().type(data.TC52.desc);
            taskPage.collpaseBtn(1).click({ force: true });
            cy.wait(2000);
            break;
          default:
            cy.log("No Block Names Matched");
        }
      });

      taskPage.createTaskBtn().click();
      cy.wait(3000);
    });

    Cypress.Commands.add("assignuser", (taskname, blocknamelist, userlist) => {
      const taskPage = new taskpage();
      taskPage.taskBtn().click({ force: true });
      cy.wait(2000);
      taskPage.sopBtn().click({ force: true });
      cy.wait(2000);
      taskPage.expBtn().click({ force: true });
      cy.wait(5000);
      taskPage.expNmaeFilter().eq(0).click();
      cy.wait(2000);
      taskPage.projectFilterclear().click({ force: true });
      cy.wait(2000);
      taskPage.expNmaeFilter().eq(0).click();
      cy.wait(2000);
      taskPage.enterFilterCondition().type(taskname);
      taskPage.filterOK().click({ force: true });
      cy.wait(2000);
      taskPage.taskActionBtn().eq(0).click();
      cy.wait(2000);
      taskPage.taskExecuteBtn().eq(0).click();
      cy.wait(2000);

      taskPage.blockTypes().each(($el, index, $list) => {
        const dayjs = require("dayjs");
        const time = require("time-js");

        var blockName = $el.text();
        cy.log(blockName);

        for (var i = 0; i <= blocknamelist.length - 1; i++) {
          if (blockName.includes(blocknamelist[i])) {
            taskPage.expandBtn().click({ force: true });
            cy.wait(2000);
            if (blocknamelist[i].includes("General")) {
              taskPage.assignUsrGeneralBlock().click();
              cy.wait(4000);
            }
            if (blocknamelist[i].includes("Instruction")) {
              taskPage.assignUsrInstructionBlock().click();
              cy.wait(4000);
            }

            taskPage.assignUsrSearchBox().clear();
            for (var j = 0; j <= userlist.length - 1; j++) {
              taskPage.assignUsrSearchBox().type(userlist[j]);
              cy.wait(2000);
              taskPage.selUsrCheckBox().click();
              if (blocknamelist[i].includes("general")) {
                taskPage.assetdrodown().eq(j).select(j);
              }
              taskPage.enterTaskDuration().eq(j).type(time().format("hh:mm"));
              cy.wait(2000);
              taskPage.enterTaskStartDate().eq(j).click();
              var startdate = dayjs().format("dddd, MMMM D, YYYY");
              cy.get(
                "div[role*='calendar'] span[title='" + startdate + "']"
              ).click({ force: true });
              var enddate = dayjs().add(1, "day").format("dddd, MMMM D, YYYY");
              taskPage.enterTaskEndDate().eq(j).click();
              cy.wait(2000);
              cy.get(
                "div[role*='calendar'] span[title='" + enddate + "']"
              ).click({ force: true });
              cy.wait(2000);
              taskPage.assignUsrSearchBox().clear();
            }

            taskPage.taskAssignBtn().click({ force: true });
            cy.wait(2000);
            cy.get(".e-toast-content").should(
              "have.text",
              "Assigned user(s) Successfully"
            );
            taskPage.collpaseBtn(1).click({ force: true });
          }
        }
      });

      taskPage.tasksavBtn().click();
      cy.wait(3000);
      taskPage.taskCloseBtn().click();
      cy.wait(5000);
    });

    Cypress.Commands.add("Projectcheck", (name, priority, list, type) => {
      const taskPage = new taskpage();

      taskPage.clickProject().click({ force: true });
      cy.wait(7000);
      taskPage.projectFilter().eq(1).click();
      cy.wait(2000);
      taskPage.enterFilterCondition().clear();
      cy.wait(1000);
      taskPage.enterFilterCondition().type(name);
      taskPage.filterOK().click({ force: true });
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

      taskPage.taskBtn().click();
      cy.wait(6000);
      taskPage.expBtn().click({ force: true });
      cy.wait(3000);
      taskPage.expNmaeFilter().eq(0).click({ force: true });
      cy.wait(2000);
      taskPage.enterFilterCondition().clear({ force: true });
      cy.wait(1000);
      taskPage.enterFilterCondition().type(taskname);
      taskPage.filterOK().click({ force: true });
      cy.wait(2000);

      taskPage.deleteValidation().then(function (elem1) {
        if (elem1.text() == "No records to display") {
          cy.createtask(name, templatename, taskname);
        } else {
          cy.log("Experiment Already Created With " + elem1.text());
        }
      });
    });

    Cypress.Commands.add("openscheduler", (taskname, blockname) => {
      const taskPage = new taskpage();
      taskPage.taskBtn().click();
      cy.wait(3000);
      taskPage.sopBtn().click({ force: true });
      cy.wait(2000);
      taskPage.taskBtn().click();
      cy.wait(2000);
      taskPage.expBtn().click({ force: true });
      cy.wait(5000);
      taskPage.expNmaeFilter().eq(0).click();
      cy.wait(3000);
      taskPage.enterFilterCondition().type(taskname);
      cy.wait(3000);
      taskPage.filterOK().click({ force: true });
      cy.wait(2000);
      taskPage.taskActionBtn().eq(0).click();
      cy.wait(3000);
      taskPage.taskExecuteBtn().eq(0).click();
      cy.wait(3000);
      taskPage.taskAccptBtn().click({ force: true });
      cy.wait(3000);
      taskPage.accptTaskNameFltr().click({ force: true });
      cy.wait(3000);
      taskPage.enterFilterCondition().clear({ force: true });
      cy.wait(1000);
      taskPage.enterFilterCondition().type(taskname);
      cy.wait(1000);
      taskPage.filterOK().click({ force: true });
      cy.wait(2000);
      cy.get(".e-gridcontent > .e-content").scrollTo("right");
      taskPage.accptTaskBlockFltr().click();
      cy.wait(2000);
      taskPage.enterFilterCondition().type(blockname);
      cy.wait(1000);
      taskPage.filterOK().click({ force: true });
      cy.wait(1000);
    });

    Cypress.Commands.add("addsecheduler", (days) => {
      const taskPage = new taskpage();
      const dayjs = require("dayjs");
      var scheduledate = dayjs().add(days, "day").format("dddd, MMMM D, YYYY");
      var formatteddate = dayjs().add(days, "day").format("MMM D, dddd");
      taskPage.schedulePrevBtn().click();
      taskPage.scheduleNxtBtn().click();
      taskPage.scheduleDayView().click();
      taskPage.scheduleWeekView().click();
      taskPage.scheduleCalendarBtn().click();
      cy.get("span[title='" + scheduledate + "']").click({ force: true });
      cy.wait(2000);
      cy.xpath("//span[contains(text(),'" + formatteddate + "')]").click({
        force: true,
      });
      cy.wait(3000);

      // taskPage.addSchedule().click()
      taskPage.scheduleTitle().type("automationevent");
      taskPage.addMoreDetailsBtn().click();
      taskPage.addschedulelocation().type("India");
      taskPage.saveSchedule().click();
      cy.get(".e-toast-content").should(
        "have.text",
        "Schedule added successfully"
      );
      cy.wait(2000);
    });

    Cypress.Commands.add("editScheduler", () => {
      const taskPage = new taskpage();
      taskPage.selSchedule().click();
      taskPage.editSchedule().click();
      taskPage.saveSchedule().click();
      cy.get(".e-toast-content").should(
        "have.text",
        "Schedule updated successfully"
      );
      cy.wait(2000);
    });

    Cypress.Commands.add("deleteSchedule", () => {
      const taskPage = new taskpage();
      taskPage.selSchedule().click();
      taskPage.deleteSchedule().click();
      taskPage.deleteconfirmSchedule().click();
      cy.get(".e-toast-content").should(
        "have.text",
        "Schedule removed successfully"
      );
      cy.wait(2000);
    });

    Cypress.Commands.add("taskremoveuser", (taskname, blocknamelist, check) => {
      const taskPage = new taskpage();
      taskPage.taskBtn().click();
      cy.wait(2000);
      taskPage.sopBtn().click({ force: true });
      cy.wait(2000);
      taskPage.expBtn().click({ force: true });
      cy.wait(3000);
      taskPage.expNmaeFilter().eq(0).click();
      cy.wait(4000);
      taskPage.enterFilterCondition().type(taskname);
      cy.wait(4000);
      taskPage.filterOK().click({ force: true });
      cy.wait(2000);
      taskPage.taskActionBtn().eq(0).click();
      cy.wait(1000);
      taskPage.taskExecuteBtn().eq(0).click();
      cy.wait(4000);

      taskPage.blockTypes().each(($el, index, $list) => {
        const dayjs = require("dayjs");
        const time = require("time-js");

        var blockName = $el.text();
        cy.log(blockName);

        for (var i = 0; i <= blocknamelist.length - 1; i++) {
          if (blockName.includes(blocknamelist[i])) {
            taskPage.expandBtn().click({ force: true });
            cy.wait(2000);

            if (blocknamelist[i].includes("General")) {
              taskPage.assignUsrGeneralBlock().click();
              cy.wait(4000);
            }
            if (blocknamelist[i].includes("Instruction")) {
              taskPage.assignUsrInstructionBlock().click();
              cy.wait(4000);
            }
            if (check === "delete") {
              taskPage.taskAssignBtn().click({ force: true });
              cy.wait(3000);
              if (blocknamelist[i].includes("General")) {
                taskPage.assignUsrGeneralBlock().click();
                cy.wait(4000);
              }
              if (blocknamelist[i].includes("Instruction")) {
                taskPage.assignUsrInstructionBlock().click();
                cy.wait(4000);
              }

              taskPage.delusrBtn().then(function (elem) {
                for (var j = 0; j <= elem.length - 1; j++) {
                  elem[j].click({ force: true });
                }
              });
            }

            if (check === "checkschedule") {
              taskPage.taskAssignBtn().click({ force: true });
              cy.wait(3000);
              if (blocknamelist[i].includes("General")) {
                taskPage.assignUsrGeneralBlock().click();
                cy.wait(4000);
              }
              if (blocknamelist[i].includes("Instruction")) {
                taskPage.assignUsrInstructionBlock().click();
                cy.wait(4000);
              }
              taskPage.shceduleName().click();
              cy.wait(2000);
              taskPage
                .taskPageSchedule()
                .should("have.text", "automationevent");
            }

            if (check === "selUsrChck") {
              taskPage.taskAssignBtn().click({ force: true });
              cy.wait(3000);
              if (blocknamelist[i].includes("General")) {
                taskPage.assignUsrGeneralBlock().click();
                cy.wait(4000);
              }
              if (blocknamelist[i].includes("Instruction")) {
                taskPage.assignUsrInstructionBlock().click();
                cy.wait(4000);
              }

              cy.get(".userScroll").scrollTo("bottom");
              cy.wait(2000);
            }

            taskPage.taskAssignBtn().click({ force: true });
            cy.wait(2000);
            cy.get(".e-toast-content").should(
              "have.text",
              "Assigned user(s) Successfully"
            );
            taskPage.collpaseBtn(1).click({ force: true });
          }
        }
      });

      taskPage.tasksavBtn().click();
      cy.wait(2000);
      taskPage.taskCloseBtn().click();
      cy.wait(3000);
    });

    Cypress.Commands.add(
      "FilterCheck",
      (filtercolumn, condtion, filtercondition, locator) => {
        const projectPage = new projectpage();

        projectPage.clickProject().click();
        cy.wait(4000);
        if (
          filtercolumn == data.filtercolumn.project ||
          filtercolumn == data.filtercolumn.projectid ||
          filtercolumn == data.filtercolumn.daysleft
        ) {
          if (filtercolumn == data.filtercolumn.project) {
            projectPage.projectFilter().eq(1).click();
            cy.wait(3000);
            projectPage.projectFilterclear().click();
            cy.wait(3000);
            projectPage.projectFilter().eq(1).click();
            cy.wait(2000);
          }

          if (filtercolumn == data.filtercolumn.projectid) {
            projectPage.projectFilter().eq(0).click();
            cy.wait(3000);
            projectPage.projectFilterclear().click();
            cy.wait(3000);
            projectPage.projectFilter().eq(0).click();
            cy.wait(2000);
          }

          if (filtercolumn == data.filtercolumn.daysleft) {
            projectPage.projectFilter().eq(3).click({ force: true });
            cy.wait(3000);
            projectPage.projectFilterclear().click({ force: true });
            cy.wait(3000);
            projectPage.projectFilter().eq(3).click({ force: true });
            cy.wait(2000);
          }
          projectPage.projgridcolfilter().eq(1).click();
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
            cy.wait(4000);
          } else {
            projectPage.enterFilterCondition().clear();
            cy.wait(1000);
            projectPage.enterFilterCondition().type(condtion);
            projectPage.filterOK().click({ force: true });
            cy.wait(2000);
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
            cy.wait(3000);
            projectPage.projectFilterclear().click();
            cy.wait(3000);
            projectPage.projectFilter().eq(4).click();
            cy.wait(2000);
          }

          projectPage.projgridcolfilter().eq(1).click();
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
        taskPage.taskBtn().click();
        cy.wait(2000);
        taskPage.sopBtn().click({ force: true });
        cy.wait(2000);
        taskPage.expBtn().click({ force: true });
        cy.wait(3000);
        taskPage.expNmaeFilter().eq(0).click();
        cy.wait(4000);
        taskPage.enterFilterCondition().type(data.TC81.taskname);
        cy.wait(4000);
        taskPage.filterOK().click({ force: true });
        cy.wait(2000);
        taskPage.taskActionBtn().eq(0).click();
        cy.wait(1000);
        taskPage.taskExecuteBtn().eq(0).click();
        cy.wait(2000);

        taskPage.taskAccptBtn().click();
        cy.wait(4000);
        if (
          filtercolumn == data.filtercolumn.username ||
          filtercolumn == data.filtercolumn.acptduration ||
          filtercolumn == data.filtercolumn.acptrolename
        ) {
          if (filtercolumn == data.filtercolumn.username) {
            taskPage.acceptFilter().eq(0).click();
            cy.wait(3000);
            taskPage.acceptFilterClear().click();
            cy.wait(3000);
            taskPage.acceptFilter().eq(0).click();
            cy.wait(2000);
          }

          if (filtercolumn == data.filtercolumn.acptduration) {
            taskPage.acceptFilter().eq(4).click();
            cy.wait(3000);
            taskPage.acceptFilterClear().click();
            cy.wait(3000);
            taskPage.acceptFilter().eq(4).click();
            cy.wait(2000);
          }

          if (filtercolumn == data.filtercolumn.acptrolename) {
            taskPage.acceptFilter().eq(1).click();
            cy.wait(3000);
            taskPage.acceptFilterClear().click();
            cy.wait(3000);
            taskPage.acceptFilter().eq(1).click();
            cy.wait(2000);
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
            cy.wait(3000);
            taskPage.acceptFilterClear().click();
            cy.wait(3000);
            taskPage.acceptFilter().eq(2).click();
            cy.wait(2000);
          }

          if (filtercolumn == data.filtercolumn.acptenddate) {
            taskPage.acceptFilter().eq(3).click();
            cy.wait(3000);
            taskPage.acceptFilterClear().click();
            cy.wait(3000);
            taskPage.acceptFilter().eq(3).click();
            cy.wait(2000);
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
      }
    );

    Cypress.Commands.add("accptfltrclearfilter", (filtercolumn) => {
      const taskPage = new taskpage();

      if (filtercolumn == data.filtercolumn.username) {
        taskPage.acceptFilter().eq(0).click({ force: true });
        cy.wait(2000);
        taskPage.acceptFilterClear().click({ force: true });
        cy.wait(2000);
      }

      if (filtercolumn == data.filtercolumn.acptstartdate) {
        taskPage.acceptFilter().eq(2).click({ force: true });
        cy.wait(2000);
        taskPage.acceptFilterClear().click({ force: true });
        cy.wait(2000);
      }

      if (filtercolumn == data.filtercolumn.acptenddate) {
        taskPage.acceptFilter().eq(3).click({ force: true });
        cy.wait(2000);
        taskPage.acceptFilterClear().click({ force: true });
        cy.wait(2000);
      }
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
