define('router', function(require) {

    var Router = require('router/Router');

    return {
        create : function(options) {
            return new Router(options);
        }
    };
    
});