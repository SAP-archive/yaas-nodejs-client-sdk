var pathCouponBase = '/hybris/coupon/v1/{{projectId}}/coupons';

var Coupon = function(rh) {
  this.requestHelper = rh;

  this.get = function(couponCode) {
    return this.requestHelper.get(pathCouponBase + '/' + couponCode);
  };

};

module.exports = Coupon;
