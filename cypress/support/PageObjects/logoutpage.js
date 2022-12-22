class logoutpage {

    logout() {
        return cy.get("#e-dropdown-btn_0")
    }

    signout() {

        return cy.xpath("//button[contains(text(),'Sign Out')]")
    }

    logoutCheck() {
        return cy.get("#status")
    }

    profileView() {
        return cy.xpath("//a[@href='/eln-webapp-test/elndev/configuration/my-profile']")
    }

    validateName() {
        return cy.get(".basicInfo > h5")
    }

    validateDesignation() {
        return cy.get(".basicInfo > :nth-child(3)")
    }
    validateRole() {
        return cy.get(".basicInfo > :nth-child(4)")
    }
    validateEmail() {
        return cy.get(":nth-child(1) > .emailinfo")
    }


}

export default logoutpage