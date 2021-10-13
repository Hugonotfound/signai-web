const request = require('supertest');

const app = require('../app.js')

describe('LOGIN ROUTE', () => {
    test('successful login', async () => {
        const response = await request(app).post('/auth/login').send({
            email: "hugo.poisot@epitech.eu",
            password: "azerty1234",
        })
        expect(response.statusCode).toBe(200);
    });

    test('wrong password', async () => {
        const response = await request(app).post('/auth/login').send({
            email: "hugo.poisot@epitech.eu",
            password: "baguette",
        })
        expect(response.statusCode).toBe(400);
    });

    test('unknow email', async () => {
        const response = await request(app).post('/auth/login').send({
            email: "baguette@gouv.fr",
            password: "baguette",
        })
        expect(response.statusCode).toBe(400);
    });
});

describe('REGISTERING ROUTE', () => {
    test('With new and correct values', async () => {
        const response = await request(app).post('/auth/register').send({
            email: "test1@exemple.com",
            password: "azerty123456",
            firstname: "toto",
            name: "Exemple",
            type: "observator",
            phone: "0666666666",
            company: "CompanyEx"
        })
        expect(response.statusCode).toBe(201);
    });

    test('With new values but wrong type', async () => {
        const response = await request(app).post('/auth/register').send({
            email: "test2@exemple.com",
            password: "azerty123456",
            firstname: "toto",
            name: "Exemple",
            type: "teacher",
            phone: "0666666666",
            company: "CompanyEx"
        })
        expect(response.statusCode).toBe(400);
    });

    test('email already registered', async () => {
        const response = await request(app).post('/auth/register').send({
            email: "hugo.poisot@epitech.eu",
            password: "azerty1234",
            firstname: "toto",
            name: "Exemple",
            type: "observator",
            phone: "0666666666",
            company: "CompanyEx"
        })
        expect(response.statusCode).toBe(409);
    });

    test('put wrong characteres in phone number', async () => {
        const response = await request(app).post('/auth/register').send({
            email: "test3@exemple.com",
            password: "azerty123456",
            firstname: "toto",
            name: "Exemple",
            type: "observator",
            phone: "Baguette",
            company: "CompanyEx"
        })
        expect(response.statusCode).toBe(400);
    });
});