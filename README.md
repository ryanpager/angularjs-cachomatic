## Cachomatic: An AngularJS Local Storage Module

This module will provide an abstraction and extension layer to the $window's object localStorage object. Since localStorage can be used as a caching layer on mobile devices, it also acts as a lightweight persistence layer for mobile applications running on a cordova platform.

###### Browser Support

http://caniuse.com/#search=localstorage

###### Dependencies

* AngularJS (http://angularjs.org/)
* MomentJS (http://momentjs.com/)

###### Documentation

* [API](https://github.com/ryanpager/cachomatic/edit/master/API.md)
* [Example Usage](https://github.com/ryanpager/cachomatic/edit/master/example.html)
* [License](https://github.com/ryanpager/cachomatic/edit/master/LICENSE)
* [Issue Tracking](https://github.com/ryanpager/cachomatic/issues)

###### Installation

```
bower install --save cachomatic
```

###### Building

```
# checkout the repository
git clone git@github.com:ryanpager/cachomatic.git <folder>

# install npm dependencies
npm install

# install bower dependencies (moment)
bower install

# build the source
gulp build
```

###### Coming Soon

* No more reliance on MomentJS
* Unit-tests
* Encryption
