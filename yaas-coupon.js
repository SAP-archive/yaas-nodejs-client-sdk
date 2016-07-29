var pathCouponBase = '/hybris/coupon/v1/{{projectId}}/coupons';

var Coupon = function(rh) {
  this.requestHelper = rh;

  this.post = function(coupon) {
    return this.requestHelper.post(pathCouponBase, 'application/json', coupon);
  };

  this.get = function(couponCode) {
    return this.requestHelper.get(pathCouponBase + '/' + couponCode);
  };

  this.delete = function(couponCode) {
    return this.requestHelper.delete(pathCouponBase + '/' + couponCode);
  };

};

module.exports = Coupon;
