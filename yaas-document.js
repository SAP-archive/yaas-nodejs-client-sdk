var pathDocumentBase = '/hybris/document/v1/{{projectId}}';

var Document = function(rh) {
  this.requestHelper = rh;

  // DEPRECATED
  this.write = function(applicationId, documentType, payload) {
    return this.requestHelper.post(
              pathDocumentBase + '/' + applicationId + '/data/' + documentType,
              'application/json',
              { payload: payload }
            );
  }

  this.create = function(applicationId, documentType, payload) {
    return this.requestHelper.post(pathDocumentBase + '/' + applicationId + '/data/' + documentType, 'application/json', payload);
  };

  this.getAll = function(applicationId, documentType, queryParameters) {
    return this.requestHelper.get(pathDocumentBase + '/' + applicationId + '/data/' + documentType, queryParameters);
  };

  this.get = function(applicationId, documentType, documentId, queryParameters) {
    return this.requestHelper.get(pathDocumentBase + '/' + applicationId + '/data/' + documentType + '/' + documentId, queryParameters);
  };

};

module.exports = Document;
