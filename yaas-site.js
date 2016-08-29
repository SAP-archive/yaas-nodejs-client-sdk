'use strict';

var pathSiteBase = '/hybris/site/v1/{{projectId}}/sites';

var Site = function(rh) {
	this.requestHelper = rh;

	this.get = function (siteCode) {
		return this.requestHelper.get(pathSiteBase + '/' + siteCode, {});
	};
};

module.exports = Site;
