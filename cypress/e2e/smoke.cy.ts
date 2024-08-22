describe('smoke tests', () => {
  it('should show basic list of products and add new item to checkout', () => {
    cy.visitAndCheck('/');

    cy.findAllByTestId('items-list-item-2')
      .findAllByTestId('add-to-cart-button')
      .click();

    cy.findAllByTestId('navigate-to-cart-button').click();

    cy.checkLocation('/cart');

    cy.findAllByTestId('checkout-item-2');
  });
});
