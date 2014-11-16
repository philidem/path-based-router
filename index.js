function extend(target, source) {
    if (!target) {
        target = {};
    }

    if (source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }

    return target;
}

function Placeholder(key) {
    this.key = key;
}

Placeholder.prototype.toString = function(params) {
    if (params) {
        return params[this.key] || '';
    } else {
        return ':' + this.key;
    }
};

function Route(config) {
    if (config) {
        this.path = config.path;
        this._tokens = config.tokens;
        this._regex = config.regex;
        this._placeholders = config.placeholders;
    }
}

Route.prototype = {

    /**
     * @return object containing parameters (or empty object if no placeholders) or
     *  false if the path does not match this route
     */
    matches: function(path) {
        var placeholders = this._placeholders;

        if (this._regex) {
            var captures = this._regex.exec(path);
            if (!captures) {
                return false;
            }

            var params = {};

            for (var i = 1; i < captures.length; i++) {
                var capture = captures[i];
                params[placeholders[i-1].key] = capture;
            }

            return params;
        } else {
            return (this.path === path) ? {} : false;
        }
    },

    toString: function(params) {

        if (params === undefined) {
            return this.path;
        } else if (this._tokens) {
            var tokens = this._tokens;
            var parts = new Array(tokens.length);
            for (var i = 0; i < tokens.length; i++) {
                parts[i] = tokens[i].toString(params);
            }
            return parts.join('/');
        } else {
            return this.path;
        }
    },

    isRoutable: function() {
        return !!this.path;
    }
};

/*
 * The following characters will automatically be escaped with backslash when building
 * regex pattern. We only need to add the characters that are "special" for regex and
 * that are allowed to appear in URL.
 */
var escapeRegex = /([\/.\\])/g;

function _parseRoute(path) {

    // the tokens that can be used to serialize a route
    var tokens = [];

    // location of dynamic properties (assumes each propery is only used once)
    var placeholders = [];
    var regexPattern = [];

    // first, split the route into parts using the '/' as a delimiter
    var parts = path.split('/');
    for (var i = 0; i < parts.length; i++) {

        var part = parts[i];
        if (part.length > 0) {

            var key;
            var placeholder;

            // placeholder parts always begin with ':'
            if (part.charAt(0) === ':') {
                // placeholder
                key = part.substring(1);
                placeholder = new Placeholder(key);
                placeholders.push(placeholder);
                tokens.push(placeholder);
                regexPattern.push('([^/]*)');
            } else if (part === '**') {
                // wildcard
                key = placeholders.length;
                placeholder = new Placeholder(key);
                placeholders.push(placeholder);
                tokens.push(placeholder);
                regexPattern.push('(.*)');
            } else if (part === '?') {
                // optional slash
                regexPattern.push('?');
            } else {
                // normal path part
                tokens.push(part);
                regexPattern.push(part.replace(escapeRegex, '\\$1'));
            }
        } else {
            // this part is an empty string (for example, the part before the leading '/')
            tokens.push('');
            regexPattern.push('');
        }
    }

    if (regexPattern.length > 0) {
        // combine the regex parts to form the final regex pattern
        var pattern = '^' + regexPattern.join('\\/') + '$';
        return new Route({
            path: path,
            tokens: tokens,
            placeholders: (placeholders.length > 0) ? placeholders : undefined,
            regex: new RegExp(pattern)
        });
    } else {
        // path contains no placeholders so we will only need to check for exact match
        return new Route({
            path: path
        });
    }

}

function _createRoute(routeConfig) {
    var route;

    if (routeConfig.constructor === String) {
        // routeConfig is a simple route pattern
        route = _parseRoute(routeConfig);
    } else {

        if (routeConfig.path === undefined) {
            route = new Route();
        } else {
            // routeConfig is a route configuration
            // that contains a "route" property.
            route = _parseRoute(routeConfig.path);
        }

        // transfer config properties to route
        extend(route, routeConfig);
    }

    return route;
}

function Router(options) {
    this.routes = [];

    if (options && options.routes) {
        for (var i = 0; i < options.routes.length; i++) {
            this.addRoute(options.routes[i]);
        }
    }
}

extend(Router.prototype, {

    /*
     * Find the route that matches the given path and return
     * an object with "route" and "params" property.
     * The "route" property is the Route entry that matched.
     * The "params" property is an object that contains the
     * placeholder string values.
     *
     * @param {String} path the path to match
     * @param {Number} i the index to start searching from
     */
    findRoute: function(path, i) {
        if (i === undefined) {
            i = 0;
        }

        var len = this.routes.length;
        for (; i < len; i++) {
            var route = this.routes[i];
            var params = route.matches(path);
            if (params) {
                // found a matching route so return the match
                return {
                    route: route,
                    params: params,
                    routeIndex: i
                };
            }
        }
        return null;
    },

    addRoute: function(routeConfig) {

        var route = _createRoute(routeConfig);

        if (route.isRoutable()) {
            // add route to our array
            this.routes.push(route);
        }

        // return the Route instance
        return route;
    },

    getRoutes: function() {
        return this.routes;
    },

    reset: function() {
        this.routes = [];
    }
});

module.exports = {
    create: function(options) {
        return new Router(options);
    },

    createRoute: function(routeConfig) {
        return new Route(routeConfig);
    },

    Router: Router,

    Route: Route
};

module.exports.createRouter = module.exports.create;
