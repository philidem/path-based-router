var chai = require('chai');
chai.Assertion.includeStack = true;
require('chai').should();
var expect = require('chai').expect;

var Router = require('../index.js').Router;

describe('raptor-async parallel' , function() {
    var routes = [
        '/cars',
        '/cars/:carId',
        '/trucks',
        '/trucks/:truckId',
        {
            path: '/boats/:boatId',
            extra: 'something'
        }
    ];

    var router = new Router({
        routes: routes
    });

    it('should allow access to routes', function() {
        expect(router.getRoutes().length).to.equal(routes.length);
    });

    it('should contain routes that we expect', function() {
        expect(router.getRoutes()[0].toString()).to.equal('/cars');
        expect(router.getRoutes()[1].toString()).to.equal('/cars/:carId');
        expect(router.getRoutes()[2].toString()).to.equal('/trucks');
        expect(router.getRoutes()[3].toString()).to.equal('/trucks/:truckId');
    });

    it('should allow access to path', function() {
        expect(router.getRoutes()[1].path).to.equal('/cars/:carId');
        expect(router.getRoutes()[4].path).to.equal('/boats/:boatId');
    });

    it('should allow toString(params)', function() {
        expect(router.getRoutes()[1].toString({carId: 1})).to.equal('/cars/1');
        expect(router.getRoutes()[3].toString({truckId: 2})).to.equal('/trucks/2');
    });

    it('should find match /cars', function() {
        var match = router.findRoute('/cars');
        expect(match).to.not.equal(null);
        expect(match.route.toString()).to.equal('/cars');
    });

    it('should find match /cars/123', function() {
        var match = router.findRoute('/cars/123');
        expect(match).to.not.equal(null);
        expect(match.params.carId).to.equal('123');
        expect(match.route.toString(match.params)).to.equal('/cars/123');
    });

    it('should not find match /cars/123/bad', function() {
        var match = router.findRoute('/cars/123/bad');
        expect(match).to.equal(null);
    });

    it('should allow route metadata', function() {
        var match = router.findRoute('/boats/123');
        expect(match.params.boatId).to.equal('123');
        expect(match.route.extra).to.equal('something');
    });

    it('should provide access to placeholders', function() {
        var router = new Router({
            routes: [
                '/something/:a/:b/:c'
            ]
        });
        
        var route = router.getRoutes()[0];
        expect(route.getPlaceholders()).to.deep.equal(['a', 'b', 'c']);
    });
    
    it('should support resetting of routing table', function() {
        router.reset();
        expect(router.getRoutes().length).to.equal(0);
    });
    
    
});
