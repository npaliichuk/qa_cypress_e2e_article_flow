describe('Article creation and deletion flow', () => {
  const uniqueId = Date.now();
  const user = {
    email: `user${uniqueId}@test.com`,
    password: 'Test1234!',
    username: `user${uniqueId}`
  };

  const article = {
    title: `Test article ${uniqueId}`,
    description: 'This is a test description',
    body: 'This is the article body used for testing',
    tag: 'e2e'
  };

  before(() => {
    cy.request('POST', 'https://api.realworld.io/api/users', {
      user: {
        username: user.username,
        email: user.email,
        password: user.password
      }
    });

    cy.login(user.email, user.password);
  });

  it('should create a new article', () => {
    cy.visit('https://conduit.mate.academy/');
    cy.contains('New Article').click();

    cy.get('input[placeholder="Article Title"]').type(article.title);
    cy.get('input[placeholder*="about"]').type(article.description);
    cy.get('textarea[placeholder="Write your article"]').type(article.body);
    cy.get('input[placeholder="Enter tags"]').type(`${article.tag}{enter}`);
    cy.contains('Publish Article').click();

    cy.url().should('include', '/article/');
    cy.contains(article.title).should('be.visible');
    cy.contains(article.body).should('be.visible');
  });

  it('should delete the created article', () => {
    cy.createArticle(article, user).then((slug) => {
      cy.visit(`https://conduit.mate.academy/article/${slug}`);
      cy.contains('Delete Article').click();
      cy.url().should('eq', 'https://conduit.mate.academy/');
      cy.visit(`/article/${slug}`);
      cy.contains('Page not found').should('exist');
    });
  });
});
