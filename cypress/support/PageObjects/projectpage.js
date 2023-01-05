class projectpage {

    clickProject() {

        return cy.get(':nth-child(2) > .nav-link')
    }

    addProject() {
        return cy.get("button[routerlink='/project/create']")
    }

    enterProjectName() {
        return cy.get("input[formcontrolname='projectName']")
    }

    enterStartDate() {
        return cy.get("input[id*='ej2-datepicker']").eq(0)


    }

    enterStartDate1() {

        return cy.get("input[id*='ej2-datepicker']").eq(0)


    }

    enterDueDate1() {
        return cy.get("input[id*='ej2-datepicker']").eq(1)
    }

    enterDueDate() {
        return cy.get("input[id*='ej2-datepicker']").eq(1)
    }


    enterTagName() {
        return cy.get("input[formcontrolname='tags']")
    }

    addTag() {
        return cy.get(".btn-small.mb-1")
    }

    enterDescription() {
        return cy.get("textarea[formcontrolname='objective']")
    }

    createProject() {
        return cy.xpath("//button[contains(text(),'Create')]")
    }

    validateProjectName() {
        return cy.xpath("//p[@class='m-0 textBreak']")
    }

    closeBtn() {
        return cy.get(".actionWrap > :nth-child(1)")
    }

    projectFilter() {
        return cy.get("div[class*='e-icon-filter']")
    }

    projectFilterclear() {
        return cy.get('.e-flmenu-cancelbtn')
    }
    enterFilterCondition() {
        return cy.get("input[id*='strui-grid-column']")
    }

    filterOK() {
        return cy.get(".e-flmenu-okbtn")
    }

    selectProject() {
        return cy.get("tr.e-row td")
    }
    editBtn() {
        return cy.get(".actionWrap > :nth-child(3)")
    }
    updateProj() {
        return cy.get('.actionWrap > .btn-primary')
    }

    deletebtn() {
        return cy.get(".actionWrap > :nth-child(2)")
    }
    deletebtnYes() {
        return cy.get('.e-confirm-dialog > .e-footer-content > .e-primary')
    }
    deleteValidation() {
        return cy.get(".e-lastrowcell")
    }

    getOwner() {
        return cy.get(":nth-child(2) > .select")
    }

    getManager() {
        return cy.get(":nth-child(3) > .select")
    }

    getResult() {
        return cy.get(".e-toast-content")
    }

    getList() {
        return cy.get("a[href='/eln-webapp-test/elndev/project/list']")
    }
    addTagBtn() {
        return cy.xpath("//button[@class='btn-small mb-1']")
    }

    tagerror() {
        return cy.get('.error')
    }

    projgridcolfilter() {
        return cy.get("div[class='e-flm_optrdiv'] span[class='e-input-group-icon e-ddl-icon e-search-icon']")
    }

    pagedropdown() {
        return cy.get('span[class="e-pagecountmsg"]')
    }

    pagecount() {
        return cy.get(".e-pagerdropdown > .e-input-group")
    }
    nextpage() {
        return cy.get('div[title="Go to next page"]')
    }

    previouspage() {
        return cy.get('div[title="Go to previous page"]')
    }

    lastpage() {
        return cy.get('div[title="Go to last page"]')
    }

    firstpage() {
        return cy.get('div[title="Go to first page"]')
    }

    countdropdown() {
        return cy.get("span[class*='e-alldrop']")
    }

    nextpager() {
        return cy.get("a[title='Go to next pager']")
    }

    previouspager() {
        return cy.get("a[title='Go to previous pager']")
    }

    pagenomsg() {
        return cy.get("span[class='e-pagenomsg']")
    }



    enterfilterdate() {
        return cy.get("div[class='e-flmenu-valuediv'] input[id*='ej2-datepicker']")
    }
    enterdaysleft() {
        return cy.get("input[id*='numberui-grid']")
    }

    decrementdaysleft() {
        return cy.get("span[aria-label='Decrement value']")
    }
    incrementdaysleft() {
        return cy.get("span[aria-label='Increment value']")
    }

    addproject1() {
        return cy.xpath("//button[@routerlink='/project/create']")
    }

    resetbtn() {
        return cy.xpath("//button[contains(text(),'Reset')]")
    }
    resetok() {
        return cy.xpath("//div[@class='e-footer-content']//button[contains(text(),'OK')]")
    }

    taglist() {
        return cy.get("div[class='tagslist']")

    }
    resetcancel() {

        return cy.xpath("//div[@class='e-footer-content']//button[contains(text(),'Cancel')]")
    }

    dialogbtn() {
        return cy.get("div[class*='e-confirm-dialog'] div [class*='e-primary']")
    }

    addcollborator() {
        return cy.xpath("//button[contains(text(),' Collaborator')]")
    }

    searchbox() {
        return cy.get("#searchbar")
    }

    searchgroup() {
        return cy.get("#searchbarUserGroup")
    }

    selectnames() {
        return cy.xpath("//div[@class='userWrap']/div/div/input[contains(@id,'checkBoxID')]")
    }

    selectgroup() {
        return cy.get("input[id*='checkBoxGroupID']")
    }

    groupitems() {
        return cy.xpath("//div[@formarrayname='users']//div//div//div//select[@formcontrolname='roleId']")
    }
    assetdrodown() {
        return cy.get("select[formcontrolname='roleId']")
    }

    selbtn() {
        return cy.get("button[class='button btn-primary']")
    }

    validateusername() {
        return cy.get("#username")
    }

    collaboratorCount() {
        return cy.get('.collaboratorCount')
    }

    selusrslist() {
        return cy.xpath("//div[@formarrayname='users']/div/div/div/input")
    }

    removeUsrBtn() {
        return cy.get("button[id *= 'e-dropdown-btn']")
    }

    collaboratorCloseBtn() {
        return cy.get("em[role='button']").eq(1)
    }

    errorMsg() {
        return cy.get("div[class*='align-items-center justify-content-center']")
    }


}

export default projectpage