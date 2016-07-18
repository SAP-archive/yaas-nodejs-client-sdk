var base = '/hybris/loy-member/v1';

var Member = function(rh) {
	this.requestHelper = rh;

	this.createMember = function(member) {
		return this.requestHelper.post(base + '/members' , 'application/json', member);
	};	

	this.getMembers = function(params) {
		return this.requestHelper.get(base + "/members", params);
	};

	this.getMember = function(id) {
		return this.requestHelper.get(base + "/members/" + id);	
	};

	this.updateMember = function(id, member, params) {
		return this.requestHelper.put(base + "/members/" + id, 'application/json' , member, params);
	};
};


module.exports = Member;
