var pathDocumentBase = '/hybris/document/v1/{{projectId}}';

var Document = function(rh) {
  this.requestHelper = rh;

  this.write = function(applicationId, documentType, payload) {
  return this.requestHelper.post(
     pathDocumentBase + '/' + applicationId + '/data/' + documentType,
    'application/json',
    {
      payload: payload
    }
  );
  }

};

module.exports = Document;
