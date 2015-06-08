# @author    Ryan Page <ryanpager@gmail.com>
# @see       https://github.com/ryanpager/cachomatic
# @version   1.0.0

(->
  'use strict'

  # @name Cachomatic
  # @description
  # This class will handle the caching interface provider for the module.
  class Cachomatic
    # @type {object}
    # @description
    # Dependencies to be injected on instantiation.
    $inject: ['$windowProvider', 'moment']

    # @constructor
    # @param {!angular.$windowProvider} $windowProvider
    # @param {object} moment
    constructor: ($windowProvider, moment) ->
      @$window = $windowProvider.$get()
      @moment  = moment

    # @type {string}
    # @description
    # This will set the cache prefix for all keys.
    cachePrefix: null

    # @name setCachePrefix
    # @description
    # This function will set the cache prefix for all cache keys.
    setCachePrefix: (prefix) ->
      @cachePrefix = prefix

    # @name getCachePrefix
    # @description
    # This function will return the key prefix for all cached values.
    getCachePrefix: =>
      return @cachePrefix

    # @name getCacheKey
    # @description
    # This will return the built cache key used for storing data in the
    #  cache.
    #
    # @param {string} key
    #
    # @return {string}
    getCacheKey: (key) =>
      prefix = @getCachePrefix()
      return if prefix is null then key else """#{prefix}-#{key}"""

    # @name getExpirationCacheKey
    # @description
    # This will return the built expiration cache key used for storing
    #  data in the cache.
    #
    # @param {string} key
    #
    # @return {string}
    getExpirationCacheKey: (key) ->
      return """#{@getCacheKey(key)}-expiration"""

    # @name exists
    # @description
    # This function will return a boolean value describing whether or not
    #  a value is stored in cache at the specific index.
    #
    # @param {string} key
    #
    # @return {boolean}
    exists: (key) =>
      unless @$window.localStorage[@getCacheKey(key)]?
        return false

      return true

    # @name clear
    # @description
    # This function will clear a specific index from the cache.
    #
    # @param {string} key
    clear: (key) =>
      expiration = @getExpiration(key)
      if expiration?
        delete @$window.localStorage[@getExpirationCacheKey(key)]

      if @exists(key)
        delete @$window.localStorage[@getCacheKey(key)]

    # @name clearAll
    # @description
    # This function will clear the entire cache.
    clearAll: =>
      # Filter the localstorage array. If the key contains the assigned
      #  cache prefix then we want to remove it from the array.
      for k, v of @$window.localStorage
        if k.indexOf(@getCachePrefix()) >= 0
          delete @$window.localStorage[k]

    # @name get
    # @description
    # This function will retreive a key from the cache at the specific key
    #  index.
    #
    # @param {string} get
    #
    # @return {string|null}
    get: (key) =>
      # If the data at this key is expired, we clear it from the
      #  cache and return null indicating its bunk data.
      if @isExpired(key)
        @clear(key)
        return null

      unless @exists(key)
        return null

      return @$window.localStorage[@getCacheKey(key)]

    # @name set
    # @description
    # This function will set a value in the cache, along with its expiration
    #  if one is set.
    #
    # @param {string} key
    # @param {string} value
    # @param {number} expiration
    set: (key, value, expiration = null) =>
      @$window.localStorage[@getCacheKey(key)] = value
      if expiration? then @setExpiration(key, expiration)

    # @name getObject
    # @description
    # This function will retreive an object from the cache at a specific
    #  key index.
    #
    # @param {string} key
    #
    # @return {string|null}
    getObject: (key) =>
      return JSON.parse(@get(key))

    # @name set
    # @description
    # This function will set an object value in the cache, along
    #  with its expiration if one is set.
    #
    # @param {string} key
    # @param {string} value
    # @param {number} expiration
    setObject: (key, value, expiration) =>
      @set(key, JSON.stringify(value), expiration)

    # @name getExpiration
    # @description
    # This function will return the expiration time (epoch) for the key
    #  associated in the cache.
    #
    # @param {string} key
    #
    # @return {number|null}
    getExpiration: (key) =>
      expirationCacheKey = @getExpirationCacheKey(key)

      unless @$window.localStorage[expirationCacheKey]?
        return null

      return @$window.localStorage[expirationCacheKey]

    # @name setExpiration
    # @description
    # This function will set the expiration for a key index in the cache
    #  based on the passed expiration modifier (in seconds).
    #
    # @param {string} key
    # @param {number} expiration
    setExpiration: (key, expiration) =>
      expirationCacheKey = @getExpirationCacheKey(key)

      @$window.localStorage[expirationCacheKey] =
        @moment().add(parseInt(expiration), 's').valueOf()

    # @name isExpired
    # @description
    # This function will return a boolean value of whether or not a value
    #  in the cache at the specific key index is expired.
    #
    # @param {string} key
    #
    # @return {boolean}
    isExpired: (key) =>
      expiration = @getExpiration(key)
      unless expiration
        return false

      if @moment().valueOf() > parseInt(expiration)
        return true

      return false

    # @name $get
    # @description
    # This is a magic method which will allow the service to be returned while
    #  injected with the correct configuration variables.
    $get: ->
      return {
        getCachePrefix: @getCachePrefix
        exists: @exists
        clear: @clear
        clearAll: @clearAll
        get: @get
        set: @set
        getObject: @getObject
        setObject: @setObject
        getExpiration: @getExpiration
        setExpiration: @setExpiration
        isExpired: @isExpired
      }

  # @description
  # The module declaration for the Cachomatic module. Will also provide the
  #  constants needed to inject into the module for maximum module testability.
  angular
    .module 'sbb.cachomatic', []
    .constant 'moment', moment
    .provider 'Cachomatic', Cachomatic
)()
