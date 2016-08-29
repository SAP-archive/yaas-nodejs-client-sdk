'use strict';

var pathDocumentBase = '/hybris/document/v1/{{projectId}}';

var Document = function(rh) {
  this.requestHelper = rh;

  this.getAll = function(applicationId, documentType, queryParameters) {
    return this.requestHelper.get(pathDocumentBase + '/' + applicationId + '/data/' + documentType, queryParameters);
  };

  this.get = function(applicationId, documentType, documentId, queryParameters) {
    return this.requestHelper.get(
      pathDocumentBase + '/' + applicationId + '/data/' + documentType + '/' + documentId, 
      queryParameters);
  };

  this.create = function(applicationId, documentType, payload) {
    return this.requestHelper.post(
      pathDocumentBase + '/' + applicationId + '/data/' + documentType,
      'application/json',
      payload
    );
  };

  this.update = function(applicationId, documentType, documentId, payload) {
    return this.requestHelper.put(
      pathDocumentBase + '/' + applicationId + '/data/' + documentType + '/' + documentId,
      'application/json',
      payload
    );
  };

  this.destroy = function(applicationId, documentType, documentId) {
    return this.requestHelper.delete(
      pathDocumentBase + '/' + applicationId + '/data/' + documentType + '/' + documentId);
  };

  // DEPRECATED!!!
  this.write = function(applicationId, documentType, payload) {
    return this.requestHelper.post(
              pathDocumentBase + '/' + applicationId + '/data/' + documentType,
              'application/json',
              { payload: payload }
            );
  };

};

module.exports = Document;
