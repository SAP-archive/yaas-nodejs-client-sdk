var pathLoyaltyConfigurationBase = '/hybris/loy-config/v1';


var Configuration = function (rh)
{
	this.requestHelper = rh;
	this.getProgramConfigurations = function() {
		return this.requestHelper.get(pathLoyaltyConfigurationBase + '/programConfigurations');		
	};

};


module.exports = Configuration;