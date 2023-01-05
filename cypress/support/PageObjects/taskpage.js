class taskpage {

    taskBtn() {
        return cy.get(':nth-child(3) > .nav-link')
    }

    expBtn() {
        return cy.get("a[href='/eln-webapp-test/elndev/task/experiment/list']")
    }

    sopBtn() {
        return cy.get("a[href='/eln-webapp-test/elndev/task/sop/list']")
    }
    addExpBtn() {
        return cy.xpath("//button[contains(text(),'Experiment')]")
    }

    expProjectFilter() {
        return cy.get("div[id='projectModalDialog_dialog-content'] div[class='e-filtermenudiv e-icons e-icon-filter']")
    }

    enterFilterCondition() {
        return cy.get("input[id*='strui-grid-column']")
    }

    filterOK() {
        return cy.get(".e-flmenu-okbtn")
    }

    selProjTemp() {
        return cy.get("input[name='select']")
    }

    selectionBtn() {
        return cy.xpath("//button[contains(text(),'Select')]").eq(0)
    }

    tempNameFilter() {
        return cy.xpath("//div[@id='templateModalDialog_dialog-content']//div[@class='e-filtermenudiv e-icons e-icon-filter']").eq(0)
    }

    selTemp() {
        return cy.get("div[id='templateModalDialog_dialog-content'] input[name='select']")
    }

    selectionTempBtn() {
        return cy.xpath("//div[@id='templateModalDialog_dialog-content']//button[contains(text(),'Select')]")
    }


    blockTypes() {
        return cy.get("span[class*='BlockComponent']")
    }

    expandBtn() {
        return cy.xpath("//button[contains(text(),' Open All')]")
    }

    collpaseBtn() {
        return cy.xpath("//button[contains(text(),' Close All')]")
    }

    enterTaskName() {
        return cy.get("input[placeholder='Enter Task Name']")
    }

    enterStartDate() {
        return cy.get("input[id*='ej2-datepicker']").eq(0)


    }

    enterDueDate() {
        return cy.get("input[id*='ej2-datepicker']").eq(1)
    }

    enterDuration() {
        return cy.get("input[id*='ej2_timepicker']")
    }

    enterTagName() {
        return cy.get("input[placeholder='Type Tag Name']")
    }

    enterDesc() {
        return cy.get("form[id*='CreateDefaultBlockForm'] div[id='defaultRte_rte-edit-view']")
    }

    instructionblockname() {
        return cy.get("form[id='CreateInstructionBlockForm'] input[placeholder='Name']")
    }
    instructionblockdesc() {
        return cy.get("form[id='CreateInstructionBlockForm'] input[placeholder='Description']")
    }

    instructionblockdesc() {
        return cy.get("form[id='CreateInstructionBlockForm'] div[id='defaultRte_rte-edit-view']")
    }

    createTaskBtn() {
        return cy.xpath("//button[contains(text(),' Create')]")
    }


    expNmaeFilter() {
        return cy.get("div[class*='e-icon-filter']")
    }

    taskActionBtn() {
        return cy.get("button[target='#FilterAction']")
    }

    taskExecuteBtn() {
        return cy.get("div[id='FilterAction'] ul[id*='ej2-menu'] li[id *='menuitem']")
    }

    assignUsrGeneralBlock() {
        return cy.xpath("//form[contains(@id,'CreateDefaultBlockForm')]//button[contains(text(),' Assign User')]")
    }

    assignUsrInstructionBlock() {
        return cy.xpath("//form[contains(@id,'CreateInstructionBlockForm')]//button[contains(text(),' Assign User')]")
    }

    assignuserBtn() {
        return cy.xpath("//div[@id='modalDialog_dialog-content']//em[@role='button']")
    }

    assignUsrSearchBox() {
        return cy.get("#searchbar")
    }

    selUsrCheckBox() {
        return cy.get("input[id*='checkBoxID']")
    }

    assetdrodown() {
        return cy.get("div[formarrayname='users'] select[formcontrolname='assetRole']")
    }

    enterTaskStartDate() {
        return cy.xpath("//div[@formarrayname='users']//label[@for='startDate']//parent::div//span[@aria-label='select']")
    }

    enterTaskEndDate() {
        return cy.xpath("//div[@formarrayname='users']//label[@for='endDate']//parent::div//span[@aria-label='select']")
    }

    enterTaskDuration() {
        return cy.get("div[formarrayname='users'] input[id*='ej2_timepicker']")
    }

    taskAssignBtn() {
        return cy.xpath("//div[contains(@class,'usergrid')]//button[contains(text(),'Assign')]")
    }

    taskAssignCnlBtn() {
        return cy.xpath("//div[contains(@class,'usergrid')]//button[contains(text(),'Cancel')]")
    }

    tasksavBtn() {

        return cy.xpath("//app-task-execute//button[contains(text(),'Save')]")
    }

    taskAccptBtn() {
        return cy.xpath("//app-task-execute//button[contains(text(),'Accept')]")
    }

    taskCloseBtn() {
        return cy.xpath("//app-task-execute//button[contains(text(),'Close')]")
    }

    accptTaskNameFltr() {
        return cy.get("div[class*='occurances acceptDialog'] th div[class*='e-icon-filter']").eq(5)
    }

    accptTaskBlockFltr() {
        return cy.get("div[class*='occurances acceptDialog'] th div[class*='e-icon-filter']").eq(6)
    }

    accptTaskActBtn() {
        return cy.get("button[id*='e-dropdown-btn']")
    }

    accpttaskBtn() {

        return cy.get("li[aria-label='Accept']")

    }

    rejctTaskActBtn() {

        return cy.get("li[aria-label='Reject']")
    }

    rejctTaskCmnt() {
        return cy.get("#comment")
    }

    rejctTaskBtn() {
        return cy.xpath("//div[contains(@class,'dialogContent')]//button[contains(text(),'Reject')]")
    }

    rejectCnclBtn() {
        return cy.xpath("//div[contains(@class,'dialogContent')]//button[@class='btn btn-secondary']")
    }

    accptCloseBtn() {
        return cy.xpath("//ejs-dialog[contains(@class,'acceptDialog')]//button[contains(text(),'Close')]")
    }

    userlistCheck() {
        return cy.xpath("//div[@id='modalDialog_dialog-content']//strong[contains(text(),'All Users')]")
    }

    clickProject() {

        return cy.get(':nth-child(2) > .nav-link')

    }

    projectFilter() {
        return cy.get("div[class*='e-icon-filter']")
    }

    enterFilterCondition() {
        return cy.get("input[id*='strui-grid-column']")
    }

    filterOK() {
        return cy.get(".e-flmenu-okbtn")
    }

    deleteValidation() {
        return cy.get(".e-lastrowcell")
    }

    projectFilterclear() {
        return cy.get('.e-flmenu-cancelbtn')
    }

    schedulercheck() {
        return cy.get("ejs-schedule[aria-label*='Timeline Week of'] div div div button span")
    }

    addSchedule() {
        return cy.get('.e-current-day > .e-header-date')
    }

    scheduleTitle() {
        return cy.get("input[placeholder='Add title']")
    }

    addMoreDetailsBtn() {
        return cy.get("button[title='More Details']")
    }

    addschedulelocation() {
        return cy.get("input[id='Location']")
    }

    saveSchedule() {
        return cy.get("button[class*='e-event-save']")
    }

    selSchedule() {
        return cy.get("div[class*='e-appointment-details']")
    }

    editSchedule() {
        return cy.get("span[class*='e-edit-icon']")
    }

    deleteSchedule() {
        return cy.get("span[class*='e-delete-icon']")
    }
    deleteconfirmSchedule() {
        return cy.get("button[class*='e-quick-dialog-delete']")
    }

    schedulePrevBtn() {
        return cy.get("button[title='Previous']")
    }
    scheduleNxtBtn() {
        return cy.get("button[title='Next']")
    }
    scheduleDayView() {
        return cy.get("button[aria-label='Day']")
    }

    scheduleWeekView() {
        return cy.get("button[aria-label='Timeline Week']")
    }

    scheduleCalendarBtn() {
        return cy.get("div[class*='e-date-range'] button[id*='e-tbr-btn']")
    }

    delusrBtn() {
        return cy.get("div[formarrayname='users'] button[id*='e-dropdown-btn']")
    }

    shceduleName() {
        return cy.get("div[class='e-subject']")
    }

    validateScheduleName() {
        return cy.get("div[class='e-appointment-wrapper'] div[class='e-subject']")
    }

    asignUsrColumnHeaders() {
        return cy.get("table[class*='e-table'] tr[class='e-columnheader'] th")
    }

    taskResourceName() {
        return cy.get("td[class*='e-resource-cells']")
    }

    schedulerLabel() {
        return cy.get("button[aria-label='Scheduler'] span")
    }

    headerDates() {
        return cy.get("tr[class='e-header-row'] span[class='e-header-date e-navigate']")
    }

    collaboratorCount() {
        return cy.get("form[id='CreateDefaultBlockForm'] .collaboratorCount")
    }

    schedulerAllDayBox() {
        return cy.get("#IsAllDay")
    }
    schedulerTimezoneBox() {
        return cy.get("#Timezone")
    }

    schedulerStartTime() {
        return cy.get("input[id='StartTime']")
    }

    schedulerEndTime() {
        return cy.get("input[id='EndTime']")
    }

    startTimeZone() {
        return cy.get("div[aria-owns='StartTimezone_options']")
    }

    endTimeZone() {
        return cy.get("div[aria-owns='EndTimezone_options']")
    }

    scheduleRepeat() {
        return cy.get("div[label='repeat-element']")
    }

    taskPageSchedule() {
        return cy.get("div[title='automationevent']")
    }

    accepterrordialog() {
        return cy.get("#QuickDialog_dialog-content")
    }

    accepterrorOK() {

        return cy.get("button[class*='e-quick-dialog-alert-btn']")
    }

    eventCnl() {
        return cy.get("button[class*='e-event-cancel']")
    }

    acceptFilter() {
        return cy.get("div[class*='e-icon-filter']")
    }

    acceptFilterClear() {
        return cy.get("button[class*='e-flmenu-cancelbtn e-flat']")
    }


    fltrGridcolFilter() {
        return cy.xpath("//input[@id='grid-column0-floptr']//parent::span//parent::div//span[@class='e-input-group-icon e-ddl-icon e-search-icon']")
    }

    pagedropdown() {
        return cy.get('span[class="e-pagecountmsg"]')
    }

    pagecount() {
        return cy.get('.e-pagerdropdown > .e-input-group')
    }

    nextpage() {
        return cy.get('div[title="Go to next page"]')
    }

    enteracptdatefilter() {
        return cy.get("div[class='e-flmenu-valuediv'] input[id*='ej2-datepicker']")
    }

    errorMsg() {
        return cy.get("div[class*='align-items-center justify-content-center']")
    }




}

export default taskpage