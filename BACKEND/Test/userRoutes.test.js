const request = require('supertest');

const app = require('../app.js')

describe('CONNECTED USER INFO ROUTE', () => {
    test('user exist', async () => {
        let logToken;

        const logRes = await request(app).post('/auth/login').send({
            email: "hugo.poisot@epitech.eu",
            password: "azerty1234",
        })
        logToken = "bearer " + logRes.body.accessToken;

        const response = await request(app).get('/user/info/me')
        .set( 'Authorization', logToken)
        .send()
        expect(response.statusCode).toBe(200);
    });

    test('wrong Token', async () => {
        const response = await request(app).get('/user/info/me')
        .set( 'Authorization', 'bearer dfgjhvkjg')
        .send()
        expect(response.statusCode).toBe(403);
    });
});

describe('USER INFO ROUTE', ()=> {
    test('correct', async () => {
        let logToken;

        const logRes = await request(app).post('/auth/login').send({
            email: "hugo.poisot@epitech.eu",
            password: "azerty1234",
        })
        logToken = "bearer " + logRes.body.accessToken;

        const response = await request(app).get('/user/info')
        .set( 'Authorization', logToken)
        .send({
            email: "thomas.dalem@epitech.eu",
        })
        expect(response.statusCode).toBe(200);
    });
    test('unknow user', async () => {
        let logToken;

        const logRes = await request(app).post('/auth/login').send({
            email: "hugo.poisot@epitech.eu",
            password: "azerty1234",
        })
        logToken = "bearer " + logRes.body.accessToken;

        const response = await request(app).get('/user/info')
        .set( 'Authorization', logToken)
        .send({
            email: "ergergrg@rklggk.com",
        })
        expect(response.statusCode).toBe(400);
    });
    test('wrong token', async () => {
        let logToken = "bearer glebskefu";

        const response = await request(app).get('/user/info')
        .set( 'Authorization', logToken)
        .send({
            email: "thomas.dalem@epitech.eu",
        })
        expect(response.statusCode).toBe(403);
    });
});

describe('USER LIST ROUTE', () => {
    test('user not allowed', async () => {
        let logToken;

        const logRes = await request(app).post('/auth/login').send({
            email: "thomas.dalem@epitech.eu",
            password: "azerty1234",
        })
        logToken = "bearer " + logRes.body.accessToken;

        const response = await request(app).get('/user/list')
        .set( 'Authorization', logToken)
        .send()
        expect(response.statusCode).toBe(403);
    });

    test('successfuly work', async () => {
        let logToken;

        const logRes = await request(app).post('/auth/login').send({
            email: "hugo.poisot@epitech.eu",
            password: "azerty1234",
        })
        logToken = "bearer " + logRes.body.accessToken;

        const response = await request(app).get('/user/list')
        .set( 'Authorization', logToken)
        .send()
        expect(response.statusCode).toBe(200);
    });

    test('dont have privilege', async () => {
        let logToken;

        const logRes = await request(app).post('/auth/login').send({
            email: "thomas.dalem@epitech.eu",
            password: "azerty1234",
        })
        logToken = "bearer " + logRes.body.accessToken;

        const response = await request(app).get('/user/list')
        .set( 'Authorization', logToken)
        .send()
        expect(response.statusCode).toBe(403);
    });
});