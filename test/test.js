var chai = require('chai');
chai.Assertion.includeStack = true;
require('chai').should();
var expect = require('chai').expect;

var Router = require('../index.js').Router;

describe('raptor-async parallel' , function() {
    var router = new Router({
        routes: [
            '/cars',
            '/cars/:carId',
            '/trucks',
            '/trucks/:truckId'
        ]
    });

    it('should contain 4 routes', function() {
        expect(router.getRoutes().length).to.equal(4);
    });

    it('should contain routes that we expect', function() {
        expect(router.getRoutes()[0].toString()).to.equal('/cars');
        expect(router.getRoutes()[1].toString()).to.equal('/cars/:carId');
        expect(router.getRoutes()[2].toString()).to.equal('/trucks');
        expect(router.getRoutes()[3].toString()).to.equal('/trucks/:truckId');
    });

    it('should find match /cars', function() {
        var match = router.findRoute('/cars');
        expect(match).to.not.equal(null);
        expect(match.route.toString()).to.equal('/cars');
    });

    it('should find match /cars/123', function() {
        var match = router.findRoute('/cars/123');
        expect(match.params.carId).to.equal('123');
        expect(match.route.toString(match.params)).to.equal('/cars/123');
    });

    it('should not find match /cars/123/bad', function() {
        var match = router.findRoute('/cars/123/bad');
        expect(match).to.equal(null);
    });

    it('should support resetting of routing table', function() {
        router.reset();
        expect(router.getRoutes().length).to.equal(0);
    });
});