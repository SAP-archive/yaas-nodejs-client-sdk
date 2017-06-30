'use strict';

var pathSchemaBase = '/hybris/schema/v1/{{projectId}}';

class Schema {
    constructor(requestHelper) {
        this.requestHelper = requestHelper;
    }

    getAll(queryParameters) {
        return this.requestHelper.get(pathSchemaBase, queryParameters);
    }

    deleteAll() {
        return this.requestHelper.delete(pathSchemaBase);
    }

    get(schemaId) {
        return this.requestHelper.get(`${pathSchemaBase}/${schemaId}`);
    }

    create(schemaId, payload) {
        return this.requestHelper.post(
            `${pathSchemaBase}/${schemaId}`,
            'application/json',
            payload
        );
    }

    getMetadata(schemaId) {
        return this.requestHelper.get(`${pathSchemaBase}/${schemaId}/metadata`);
    }

    updateMetadata(schemaId, payload) {
        return this.requestHelper.put(
            `${pathSchemaBase}/${schemaId}/metadata`,
            'application/json',
            payload
        );
    }

    getTags(schemaId) {
        return this.requestHelper.get(`${pathSchemaBase}/${schemaId}/tags`);
    }

    createTag(schemaId, tagId, queryParameters) {
        return this.requestHelper.post(
            `${pathSchemaBase}/${schemaId}/tags/${tagId}`,
            'application/json',
            null,
            queryParameters
        );
    }

    deleteTag(schemaId, tagId, queryParameters) {
        return this.requestHelper.delete(`${pathSchemaBase}/${schemaId}/tags/${tagId}`, queryParameters);
    }

    getAllTagValues() {
        return this.requestHelper.get(`${pathSchemaBase}/all/tagvalues`);
    }

    getTagValue(tagId) {
        return this.requestHelper.get(`${pathSchemaBase}/all/tagvalues/${tagId}`);
    }
}

module.exports = Schema;
