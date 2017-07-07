'use strict';

// require enviroment variables:
// TEST_YAAS_CLIENT_ID
// TEST_YAAS_CLIENT_SECRET
// TEST_YAAS_IDENTIFIER

const YaaS = require('../yaas.js');
const should = require('should');
const it = require("mocha").it;
const describe = require("mocha").describe;
const yaas = new YaaS();

const scopes = "hybris.document_view hybris.document_manage hybris.document_admin hybris.schema_manage hybris.schema_view hybris.schema_admin hybris.configuration_view hybris.configuration_manage hybris.configuration_admin hybris.document-backup_backup hybris.document-backup_restore hybris.document-backup_view hybris.document-backup_manage";

yaas.init(process.env.TEST_YAAS_CLIENT_ID, process.env.TEST_YAAS_CLIENT_SECRET, scopes, process.env.TEST_YAAS_IDENTIFIER.split('.')[0]);

const testType = 'test' + Date.now();
const objectPayloads = [
    {'testID': 5, 'testName': 'Julian'},
    {'testID': 23, 'testName': 'Dick'},
    {'testID': 42, 'testName': 'George'},
    {'testID': 1337, 'testName': 'Anne'},
    {'testID': 5, 'testName': 'Timmy'}
    ];
let documentIds = [];
let allDocuments;

describe('Document', function () {
    describe('Create objects', function () {
        it('should find no objects', function (done) {
            yaas.document.getCount(process.env.TEST_YAAS_IDENTIFIER, testType, {})
                .then(function (res) {
                    res.headers.should.be.an.Object();
                    res.headers.should.have.property('hybris-count', '0');
                    done();
                })
                .catch(done);
        });

        objectPayloads.forEach(createObject);

        it('should find 5 objects in total', function (done) {
            yaas.document.getCount(process.env.TEST_YAAS_IDENTIFIER, testType, {})
                .then(function (res) {
                    res.headers.should.be.an.Object();
                    res.headers.should.have.property('hybris-count', '5');
                    done();
                })
                .catch(done);
        });
    });

    describe('Create objects', function () {
        it('should get all 5 objects', function (done) {
            yaas.document.getAll(process.env.TEST_YAAS_IDENTIFIER, testType, {})
                .then(function (res) {
                    res.body.should.be.an.Array();
                    res.body.should.have.length(5);
                    allDocuments = res.body;
                    done();
                })
                .catch(done);
        });

        it('should get 2 objects with ID 5', function (done) {
            yaas.document.getAll(process.env.TEST_YAAS_IDENTIFIER, testType, {q: 'testID:5'})
                .then(function (res) {
                    res.body.should.be.an.Array();
                    res.body.should.have.length(2);
                    should.equal(res.body[0].testName, 'Julian');
                    should.equal(res.body[1].testName, 'Timmy');
                    done();
                })
                .catch(done);
        });

        it('should get 1 object named George', function (done) {
            yaas.document.getAll(process.env.TEST_YAAS_IDENTIFIER, testType, {q: 'testName:"George"'})
                .then(function (res) {
                    res.body.should.be.an.Array();
                    res.body.should.have.length(1);
                    should.equal(res.body[0].testName, 'George');
                    done();
                })
                .catch(done);
        });

        it('should get a single object by documentId', function (done) {
            yaas.document.get(process.env.TEST_YAAS_IDENTIFIER, testType, documentIds[3], {})
                .then(function (res) {
                    res.body.should.be.an.Object();
                    should.equal(res.body.testName, 'Anne');
                    should.equal(res.body.testID, 1337);
                    should.equal(res.body.id, documentIds[3]);
                    done();
                })
                .catch(done);
        });
    });

    describe('Modify objects', function () {
        let dick;
        it('should check the object before modification', function (done) {
            yaas.document.get(process.env.TEST_YAAS_IDENTIFIER, testType, documentIds[1], {})
                .then(function (res) {
                    res.body.should.be.an.Object();
                    should.equal(res.body.testName, 'Dick');
                    should.equal(res.body.testID, 23);
                    should.equal(res.body.id, documentIds[1]);
                    dick = res.body;
                    done();
                })
                .catch(done);
        });

        it('should perform a replacement of an object', function (done) {
            dick.testName = 'Dylan';
            yaas.document.update(process.env.TEST_YAAS_IDENTIFIER, testType, documentIds[1], dick)
                .then(function (res) {
                    res.statusCode.should.equal(200);
                    done();
                })
                .catch(done);
        });

        it('should see the updated value in the object', function (done) {
            yaas.document.get(process.env.TEST_YAAS_IDENTIFIER, testType, documentIds[1], {})
                .then(function (res) {
                    res.body.should.be.an.Object();
                    should.equal(res.body.testName, 'Dylan');
                    should.equal(res.body.testID, 23);
                    should.equal(res.body.id, documentIds[1]);
                    done();
                })
                .catch(done);
        });

        it.skip('should perform a partial update of an object', function (done) {
            yaas.document.update(process.env.TEST_YAAS_IDENTIFIER, testType, documentIds[1], {'testID': 666})
                .then(function (res) {
                    res.statusCode.should.equal(200);
                    done();
                })
                .catch(done);
        });

        it.skip('should see the updated value in the object', function (done) {
            yaas.document.get(process.env.TEST_YAAS_IDENTIFIER, testType, documentIds[1], {})
                .then(function (res) {
                    res.body.should.be.an.Object();
                    should.equal(res.body.testName, 'Dylan');
                    should.equal(res.body.testID, 666);
                    should.equal(res.body.id, documentIds[1]);
                    done();
                })
                .catch(done);
        });

        it.skip('should perform a partial update of an object introducing a new property', function (done) {
            yaas.document.update(process.env.TEST_YAAS_IDENTIFIER, testType, documentIds[1], {'testAddition': 'Hello World!'})
                .then(function (res) {
                    res.statusCode.should.equal(201);
                    res.body.should.be.an.Object();
                    should.equal(res.body.testName, 'Anne');
                    should.equal(res.body.testID, 1337);
                    should.equal(res.body.id, documentIds[3]);
                    done();
                })
                .catch(done);
        });

        it.skip('should see the updated value in the object', function (done) {
            yaas.document.get(process.env.TEST_YAAS_IDENTIFIER, testType, documentIds[1], {})
                .then(function (res) {
                    res.body.should.be.an.Object();
                    should.equal(res.body.testName, 'Dylan');
                    should.equal(res.body.testID, 666);
                    should.equal(res.body.testAddition, 'Hello World!');
                    should.equal(res.body.id, documentIds[1]);
                    done();
                })
                .catch(done);
        });
    });

    describe('Delete objects', function () {
        it('should get delete a single object by documentId', function (done) {
            yaas.document.destroy(process.env.TEST_YAAS_IDENTIFIER, testType, documentIds[3])
                .then(function (res) {
                    res.statusCode.should.equal(204);
                    done();
                })
                .catch(done);
        });

        it('should not find the deleted object anymore', function (done) {
            yaas.document.get(process.env.TEST_YAAS_IDENTIFIER, testType, documentIds[3], {})
                .then(function () {
                    done(new Error('Request should not have succeeded'));
                })
                .catch(function (error) {
                    error.statusCode.should.equal(404);
                    done();
                });
        });
    });
});

function createObject(payload) {
    it('should create a test object', function (done) {
        yaas.document.create(process.env.TEST_YAAS_IDENTIFIER, testType, payload)
            .then(function (res) {
                res.statusCode.should.equal(201);
                res.body.should.have.property('link');
                res.body.should.have.property('id');
                documentIds.push(res.body.id);
                done();
            })
            .catch(done);
    });
}
