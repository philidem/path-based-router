path-based-router
=========
## Installation
**Install path-based-router module:**
```bash
npm install path-based-router --save
```

## Usage
```javascript
// some assertion library (such as the one provided by NodeJS)
var assert = require('assert');

// Create instance of router
var router = require('path-based-router').create({
    routes: [
        // simple String paths
        '/cars',

        // :carId is a placeholder
        '/cars/:carId',

        // simple path
        '/trucks',

        // :truckId is a placeholder
        '/trucks/:truckId',

        // "**" matches any characters (including forward slashes)
        // so it will typically appear at the end of the path
        '/search/**',

        // If you want to attach metadata to route use object with "path" property
        {
            // "path" is a required property
            path: '/boats/:boatId',
            // Anything else is extra...
            anyExtraInformation: 'something'
        }
    ]
});

// You can also add routes after creation
router.addRoute('/some/thing');

// You can also add routes after creation
router.addRoute({
    path: '/some/thing/else'
});

var match = router.findRoute('/boats/123');
// match is not null then match was found
if (match) {
    // match will contain "route" which is an instance of Route.
    // match will also contain "params" which is an object that
    // contains values that were found for each placeholder.
    // A Route has a "path" property and any extra metadata.
    var route = match.route;
    var params = match.params;

    // this assertion will be true
    assert(params.boatId === '123');

    // this assertion will be true
    assert(route.anyExtraInformation === 'something');

    // toString() will return the original path with no placeholder substitution
    assert(route.toString() === '/boats/:boatId');

    // toString(params) will return the path with placeholders substituted
    // (NOTE: placeholders that did not have a value will be replaced with
    // empty string)
    assert(route.toString(params) === '/boats/123');
}
```

**Alternative constructor:**
```javascript
var Router = require('path-based-router').Router;
var router = new Router();
```
