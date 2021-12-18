/// <reference types="cypress" />


describe('example to-do app', () => {
    beforeEach(() => {
        cy.visit('http://ec2-35-158-103-6.eu-central-1.compute.amazonaws.com/login')
    })

    it('required fields', () => {

        cy.get('.jss3 div').should('have.length', 5)

    })

})