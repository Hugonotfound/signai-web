const request = require('supertest');
const app = require('../app.js')

describe('PROJECT CREATION ROUTE', () => {
    test('Project created', async () => {
        let logToken;

        const logRes = await request(app).post('/auth/login').send({
            email: "hugo.poisot@epitech.eu",
            password: "azerty1234",
        })
        logToken = "bearer " + logRes.body.accessToken;

        const response = await request(app).post('/project/')
        .set( 'Authorization', logToken)
        .send({
            name: "ProjectTest1",
            description: "Project description test 1",
            departCoordinates: {
                lat: 24,
                log: 42
            },
            departAddress: "Address test1",
            radius: 100,
            contraints: [{
                contraint: "test1 contraint1",
                position: {
                    lat: 24,
                    long: 42
                },
            }, {
                contraint: "test1 contraint2",
                position: {
                    lat: 24,
                    long: 42
                },
            }],
            company: "Company test",
            managers: ["manager1", "manager2"],
            observators: ["observator1", "observator2"],
        });
        expect(response.statusCode).toBe(200);
    });

    test('missing fields', async () => {
        let logToken;

        const logRes = await request(app).post('/auth/login').send({
            email: "hugo.poisot@epitech.eu",
            password: "azerty1234",
        })
        logToken = "bearer " + logRes.body.accessToken;

        const response = await request(app).post('/project/')
        .set( 'Authorization', logToken)
        .send({
            description: "Project description test 1",
            departCoordinates: {
                lat: 24,
                log: 42
            },
            departAddress: "Address test1",
            radius: 100,
            contraints: [{
                contraint: "test1 contraint1",
                position: {
                    lat: 24,
                    long: 42
                },
            }, {
                contraint: "test1 contraint2",
                position: {
                    lat: 24,
                    long: 42
                },
            }],
            company: "Company test",
            managers: ["manager1", "manager2"],
            observators: ["observator1", "observator2"],
        });
        expect(response.statusCode).toBe(500);
    });

    test('wrong token', async () => {
        const logToken = "bearer glbskf";

        const response = await request(app).post('/project/')
        .set( 'Authorization', logToken)
        .send({
            name: 'Project test',
            description: "Project description test 1",
            departCoordinates: {
                lat: 24,
                log: 42
            },
            departAddress: "Address test1",
            radius: 100,
            contraints: [{
                contraint: "test1 contraint1",
                position: {
                    lat: 24,
                    long: 42
                },
            }, {
                contraint: "test1 contraint2",
                position: {
                    lat: 24,
                    long: 42
                },
            }],
            company: "Company test",
            managers: ["manager1", "manager2"],
            observators: ["observator1", "observator2"],
        });
        expect(response.statusCode).toBe(403);
    });

    test('wrong type in coordinates', async () => {
        const logToken = "bearer glbskf";

        const response = await request(app).post('/project/')
        .set( 'Authorization', logToken)
        .send({
            name: 'ProjectTest 5',
            description: "Project description test 1",
            departCoordinates: {
                lat: 'test',
                log: 42
            },
            departAddress: "Address test1",
            radius: 100,
            contraints: [{
                contraint: "test1 contraint1",
                position: {
                    lat: 24,
                    long: 42
                },
            }, {
                contraint: "test1 contraint2",
                position: {
                    lat: 24,
                    long: 42
                },
            }],
            company: "Company test",
            managers: ["manager1", "manager2"],
            observators: ["observator1", "observator2"],
        });
        expect(response.statusCode).toBe(500);
    });

    test('dont have privilege', async () => {
        let logToken;

        const logRes = await request(app).post('/auth/login').send({
            email: "thomas.dalem@epitech.eu",
            password: "azerty1234",
        })
        logToken = "bearer " + logRes.body.accessToken;

        const response = await request(app).post('/project/')
        .set( 'Authorization', logToken)
        .send({
            name: "ProjectTest1",
            description: "Project description test 1",
            departCoordinates: {
                lat: 24,
                log: 42
            },
            departAddress: "Address test1",
            radius: 100,
            contraints: [{
                contraint: "test1 contraint1",
                position: {
                    lat: 24,
                    long: 42
                },
            }, {
                contraint: "test1 contraint2",
                position: {
                    lat: 24,
                    long: 42
                },
            }],
            company: "Company test",
            managers: ["manager1", "manager2"],
            observators: ["observator1", "observator2"],
        });
        expect(response.statusCode).toBe(403);
    });
    
});