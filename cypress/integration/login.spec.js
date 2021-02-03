var faker = require('faker');

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-test=welcome-page]').find('[data-test=username]').as('usernameInput');
    cy.get('[data-test=welcome-page]').find('[data-test=password]').as('passwordInput');
    cy.get('[data-test=welcome-page]').find('[data-test=login-submit]').as('submitButton');
    cy.get('[data-test=welcome-page]').find('[data-test=remember-me]').as('rememberMe');
    cy.get('.notifications-wrapper').as('flashNotification');
  });

  it('loads the login page with form and image', () => {
    const username = faker.internet.userName();
    const password = faker.internet.password();

    cy.get('[data-test=welcome-page]').find('h1').should('have.text', 'Kanbantam');
    cy.get('[data-test=welcome-page]').find('[data-test=remember-me]');
    cy.get('[data-test=welcome-page]').find('[data-test=login-image]');
    cy.get('@usernameInput').type(username).should('have.value', username);
    cy.get('@passwordInput').type(password).should('have.value', password);
    cy.get('@rememberMe').check().should('be.checked');
    cy.get('@submitButton').should('have.text', 'Log In');
  });

  context('submitting login form', () => {
    it('flashes error message when no inputs are filled in', () => {
      cy.get('@submitButton').click();
      cy.get('[data-test=welcome-page]').find('h1').should('have.text', 'Kanbantam');
      cy.get('@flashNotification')
        .get('.notification-message')
        .should('have.text', 'Missing credentials');
    });

    it('flashes error message when user enters incorrect username or password', () => {
      const username = faker.internet.userName();
      const password = faker.internet.password();

      cy.get('@usernameInput').type(username);
      cy.get('@passwordInput').type(password);
      cy.get('@submitButton').click();
      cy.get('[data-test=welcome-page]').find('h1').should('have.text', 'Kanbantam');
      cy.get('@flashNotification')
        .get('.notification-message')
        .should('have.text', 'Incorrect username or password.');
    });

    it('flashes success message and redirect to boards page when user successfully logs in', () => {
      const username = 'amelie';
      const password = faker.internet.password();

      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          message: 'Logged in successfully',
          user: {
            username: 'amelie',
            username_case: 'amelie',
            created_at: '2020-06-14T17:56:04.916Z',
            user: 1,
            id: '5ee664b49ad3ed1b06654c2a',
          },
        },
      });

      cy.intercept('GET', '/api/boards', {
        statusCode: 200,
        body: {
          message: 'Docs retrieved successfully',
          data: [],
        },
      });

      cy.get('@usernameInput').type(username);
      cy.get('@passwordInput').type(password);
      cy.get('@submitButton').click();

      cy.get('[data-test=navigation]');
      cy.get('[data-test=board-section]');

      cy.get('@flashNotification')
        .get('.notification-message')
        .should('have.text', 'Logged in successfully');
    });
  });
});
