describe('Todos page (index page) tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('passes', () => {
    cy.contains(/Add new todo/i);
  });
});
