var requestHelper;
var pathSiteBase = '/hybris/site/v1/{{projectId}}/sites';

function init(rh) {
	requestHelper = rh;
}

function get(siteCode) {
	return requestHelper.get(pathSiteBase + '/' + siteCode, {});
}

module.exports = {
	get: get,
	init: init
};