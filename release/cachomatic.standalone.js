/**
 * Cachomatic: An AngularJS Local Storage Module
 * @author Ryan Page <ryanpager@gmail.com>
 * @version v1.0.0
 * @see https://github.com/ryanpager/cachomatic
 * @license https://github.com/ryanpager/cachomatic/blob/master/LICENSE
 */
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function() {
  'use strict';
  var Cachomatic;
  Cachomatic = (function() {
    Cachomatic.prototype.$inject = ['$windowProvider', 'moment'];

    function Cachomatic($windowProvider, moment) {
      this.isExpired = bind(this.isExpired, this);
      this.setExpiration = bind(this.setExpiration, this);
      this.getExpiration = bind(this.getExpiration, this);
      this.setObject = bind(this.setObject, this);
      this.getObject = bind(this.getObject, this);
      this.set = bind(this.set, this);
      this.get = bind(this.get, this);
      this.clearAll = bind(this.clearAll, this);
      this.clear = bind(this.clear, this);
      this.exists = bind(this.exists, this);
      this.getCacheKey = bind(this.getCacheKey, this);
      this.getCachePrefix = bind(this.getCachePrefix, this);
      this.$window = $windowProvider.$get();
      this.moment = moment;
    }

    Cachomatic.prototype.cachePrefix = null;

    Cachomatic.prototype.setCachePrefix = function(prefix) {
      return this.cachePrefix = prefix;
    };

    Cachomatic.prototype.getCachePrefix = function() {
      return this.cachePrefix;
    };

    Cachomatic.prototype.getCacheKey = function(key) {
      var prefix;
      prefix = this.getCachePrefix();
      if (prefix === null) {
        return key;
      } else {
        return prefix + "-" + key;
      }
    };

    Cachomatic.prototype.getExpirationCacheKey = function(key) {
      return (this.getCacheKey(key)) + "-expiration";
    };

    Cachomatic.prototype.exists = function(key) {
      if (this.$window.localStorage[this.getCacheKey(key)] == null) {
        return false;
      }
      return true;
    };

    Cachomatic.prototype.clear = function(key) {
      var expiration;
      expiration = this.getExpiration(key);
      if (expiration != null) {
        delete this.$window.localStorage[this.getExpirationCacheKey(key)];
      }
      if (this.exists(key)) {
        return delete this.$window.localStorage[this.getCacheKey(key)];
      }
    };

    Cachomatic.prototype.clearAll = function() {
      var k, ref, results, v;
      ref = this.$window.localStorage;
      results = [];
      for (k in ref) {
        v = ref[k];
        if (k.indexOf(this.getCachePrefix()) >= 0) {
          results.push(delete this.$window.localStorage[k]);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Cachomatic.prototype.get = function(key) {
      if (this.isExpired(key)) {
        this.clear(key);
        return null;
      }
      if (!this.exists(key)) {
        return null;
      }
      return this.$window.localStorage[this.getCacheKey(key)];
    };

    Cachomatic.prototype.set = function(key, value, expiration) {
      if (expiration == null) {
        expiration = null;
      }
      this.$window.localStorage[this.getCacheKey(key)] = value;
      if (expiration != null) {
        return this.setExpiration(key, expiration);
      }
    };

    Cachomatic.prototype.getObject = function(key) {
      return JSON.parse(this.get(key));
    };

    Cachomatic.prototype.setObject = function(key, value, expiration) {
      return this.set(key, JSON.stringify(value), expiration);
    };

    Cachomatic.prototype.getExpiration = function(key) {
      var expirationCacheKey;
      expirationCacheKey = this.getExpirationCacheKey(key);
      if (this.$window.localStorage[expirationCacheKey] == null) {
        return null;
      }
      return this.$window.localStorage[expirationCacheKey];
    };

    Cachomatic.prototype.setExpiration = function(key, expiration) {
      var expirationCacheKey;
      expirationCacheKey = this.getExpirationCacheKey(key);
      return this.$window.localStorage[expirationCacheKey] = this.moment().add(parseInt(expiration), 's').valueOf();
    };

    Cachomatic.prototype.isExpired = function(key) {
      var expiration;
      expiration = this.getExpiration(key);
      if (!expiration) {
        return false;
      }
      if (this.moment().valueOf() > parseInt(expiration)) {
        return true;
      }
      return false;
    };

    Cachomatic.prototype.$get = function() {
      return {
        getCachePrefix: this.getCachePrefix,
        exists: this.exists,
        clear: this.clear,
        clearAll: this.clearAll,
        get: this.get,
        set: this.set,
        getObject: this.getObject,
        setObject: this.setObject,
        getExpiration: this.getExpiration,
        setExpiration: this.setExpiration,
        isExpired: this.isExpired
      };
    };

    return Cachomatic;

  })();
  return angular.module('sbb.cachomatic', []).constant('moment', moment).provider('Cachomatic', Cachomatic);
})();
