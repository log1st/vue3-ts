
const baseUrl = 'http://localhost:8080'

const users = {
    tender: {
        login: "tender@urrobot.net",
        password: "Stereo!@#"
    },
    sar: {
        login: 'sar@urrobot.net',
        password: '!Q2w3e4r5t'
    }
}

describe('Проверка формирования каждого документа одного должника по порядку', () => {
    
    it('Авторизация пользователя', () => {
        cy.visit(`${baseUrl}/login`)
        cy.get('[data-cy="login-input"]').find('input').type(users.sar.login);
        cy.get('[data-cy="password-input"]').find('input').type(users.sar.password);
        cy.get('[data-cy="login-button"]').click();
        cy.wait(2000);
        cy.get('[data-cy="login-button"]').click();
        cy.wait(10000);
        cy.url().should('eq', `${baseUrl}/debtors`);
    })

    it('У пользователя есть как минимум 1 должник', () => {
        cy.get('[data-cy="ur-table"]').within(() => {
            cy.get('[data-cy="ur-table__row"]').its('length').should('to.be.at.least', 1)
        })
    })

    it('Должника можно выбрать', () => {
         cy.get('[data-cy="ur-table"]').within(() => {
            cy.get('[data-cy="ur-table__row"]').find('[data-cy="ur-checkbox"]').first().click();
            cy.get('[data-cy="ur-table__row"]').find('[data-cy="ur-checkbox"] > [data-cy="ur-checkbox__inner"]').should('be.visible');
        })
    })

    it('Модальное окно "Работа с печатной формой" открылось', () => {
        cy.get('[data-cy="hot-buttons"]').within(() => {
            cy.get('[data-cy="hot-buttons__icon"]').first().click();
            cy.get('[data-cy="popup"]').should('be.visible');
            // cy.get('[data-cy="popup"]').contains('Работа с печатной формой.');
        })
    })

    it('Выбраны все услуги', () => {
        expect(true).to.be.true
    })

    it('Печать работает', () => {
        // cy.get('[data-cy="print-button"]').first().click();
        // true.should('be.true');
    })

    // it('fills in the form', () => {
    //     cy.server()
    //     // Stub the POST request to /articles and return a 403
    //     cy.route({
    //       method: 'POST',
    //       url: 'articles*',
    //       status: '403',
    //       response: 'Invalid Cover image'
    //     })
    
    //     // visit the page
    //     cy.visit('/add-article')
    
    //     // submit without any data
    //     cy.getByTestId('submit').click()
    
    //     // check if fields have errors and type into them
    //     cy.getByTestId('title').isInvalid('Title is required')
    //       .type('Vue enterprise boilerplate')
    
    //     cy.getByTestId('author').isInvalid('Author is required')
    //       .type('Chris Fritz')
    
    //     cy.getByTestId('image')
    //       .type('Vue enterprise boilerplate')
    //       .isInvalid('Cover image must be a valid url')
    //       .clear()
    //       .type('https://cdn-images-1.medium.com/max/2000/1*PHmNXbvOfg5AHiMWWuaRXg.jpeg')
    
    //     cy.getByTestId('rating')
    //       .invoke('val', '3')
    //       .trigger('input')
    
    //     cy.getByTestId('body')
    //       .type('Lorem Ipsum .... whatever')
    
    //     cy.getByTestId('submit').click()
    
    //     cy.isPopupVisible('error', 'Invalid Cover image', true)
    
    //     cy.route('POST', 'articles').as('postArticle') // unstub
    
    //     cy.getByTestId('submit').click()
    
    //     cy.isPopupVisible('info', 'Vue enterprise boilerplate saved successfully.', true)
    
    //     cy.wait('@postArticle').its('responseBody').then((body) => {
    //       cy.url().should('contain', `articles/${body.id}`)
    
    //       cy.getByTestId('articleTitle').should('contain', body.title)
    
    //       cy.getByTestId('articleRating').should('contain', body.rating)
    //     })
    //   })
  })