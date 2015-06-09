## Cachomatic: The API

##### Provider Methods

###### setCachePrefix([string] prefix)

This function will set the cache prefix for all cache keys. If you do not
provide one in your module configuration then this will be ignored.

##### Service Methods

###### getCachePrefix : [string]

This function will return the previously set cache prefix in use for all
cache keys.

###### exists([string] key) : [boolean]

This function will return a boolean value denoting whether or not there is a
value which exists at the supplied key value.

###### clear([string] key)

This function will clear out any value which is located at the supplied key
index. If the key does not exist in the cache then it will act as a no-op.

###### clearAll

This function will clear the __entire__ cache. This is a special clear function
as it will only reset keys that are prefixed with the cache prefix in use.

###### get([string] key) : [string]

This function will retrieve the value that is stored at the supplied key.

###### set([string] key, [string|number] value, [number] expiration)

This function will set a value in the cache at the supplied key. The expiration
parameter is the time __from now__ in which the value will expire __in seconds__.

###### getObject([string] key) : [object]

This function will retrieve the value that is stored at the supplied key. The
different between this and the standard "get" is that it will JSON.parse the
value being retreived.

###### setObject([string] key, [object] value, [number] expiration)

This function will set a value in the cache at the supplied key. The expiration
parameter is the time __from now__ in which the value will expire __in seconds__.
The only difference between this function and the standard "set" is that the
value being stored will be JSON.stringify.

###### getExpriation([string] key) : [number]

This function will return the epoch time (in ms) in which the value stored in
the cache at this key index will expire.

###### setExpiration([string] key, [number] expiration)

This function will set the expiration __from now__ in which the value will
expire __in seconds__. It can act as a "refresh" function for the cache.

###### isExpired([string] key) : [boolean]

This function will return a boolean value denoting whether or not the value
stored in the cache at this key value is expired.
