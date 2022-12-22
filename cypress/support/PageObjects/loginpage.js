class loginpage {

    getEmail() {
        return cy.get("#gigya-loginID-77152811960799260")
    }

    login() {

        return cy.get("#gigya-login-form > .gigya-layout-row.with-divider > .with-site-login > .sign-in-button > .gigya-input-submit")
    }

    getPassword() {
        return cy.get("#gigya-password-116353530441464400")
    }


}

export default loginpage