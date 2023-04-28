const userName = 'JohnDoe';
const password = 'password1234';

type Header = {
  usr: string;
  eat: Date;
};

describe('Sign-up feature tests', () => {
  before('Clear session storage', () => {
    cy.visit('/');
    cy.contains(/Add new todo/i);
    cy.window().then((window) => window.sessionStorage.removeItem('token'));
    cy.reload();
    cy.wait(300);
  });

  it('Signup page is in order', () => {
    cy.contains(/Sign up/i).click();
    cy.url().should('include', '/signup');

    cy.get('input#userName');
    cy.get('input#password');
    cy.get('button[type="submit"]');
  });

  it('Sign up and receive token', () => {
    cy.visit('signup');
    cy.get('input#userName').type(userName);
    cy.get('input#password').type(password);
    cy.get('button[type="submit"]').click();

    const beforeSignup = new Date();
    cy.wait(300);

    cy.window().then((window) => {
      window.sessionStorage.getItem('token');
      const token = window.sessionStorage.getItem('token');

      expect(token).to.match(/(.+)\.(.+)/i);

      const headerJson = JSON.parse(
        Buffer.from(token.split('.')[0], 'base64').toString('utf-8')
      );

      const header: Header = {
        usr: headerJson.usr,
        eat: new Date(headerJson.eat)
      };

      console.log(header);

      expect(header.usr).to.eq(userName);
      expect(header.eat).to.be.lessThan(new Date());
      expect(header.eat).to.be.greaterThan(beforeSignup);
    });
  });
});
