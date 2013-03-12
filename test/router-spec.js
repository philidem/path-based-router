var raptor = require('raptor');
var resources = raptor.require('raptor/resources');
var files = raptor.require('raptor/files');
var packaging = raptor.require('raptor/packaging');

require = raptor.require;

var moduleManifest = resources.createFileResource(files.joinPaths(__dirname, '../package.json'));
packaging.load(packaging.getPackageManifest(moduleManifest));

var router = require('router');

var Router = require('router/Router');


describe('router/Router', function() {
    
    (function() {
        
        var myRouter = router.create({
            routes : [
                '/cars',
                '/cars/:carId',
                '/trucks',
                '/trucks/:truckId'
            ]
        });
        
        it('should contain 4 routes', function() {
            expect(myRouter.getRoutes().length).toEqual(4);
        });

        it('should contain routes that we expect', function() {
            expect(myRouter.getRoutes()[0].toString()).toEqual('/cars');
            expect(myRouter.getRoutes()[1].toString()).toEqual('/cars/:carId');
            expect(myRouter.getRoutes()[2].toString()).toEqual('/trucks');
            expect(myRouter.getRoutes()[3].toString()).toEqual('/trucks/:truckId');
        });

        it('should find match /cars', function() {
            var match = myRouter.findRoute('/cars');
            expect(match.route.toString()).toEqual('/cars');
        });

        it('should find match /cars/123', function() {
            var match = myRouter.findRoute('/cars/123');
            expect(match.params.carId).toEqual('123');
            expect(match.route.toString(match.params)).toEqual('/cars/123');
        });
        
        it('should support resetting of routing table', function() {
            myRouter.reset();
            expect(myRouter.getRoutes().length).toEqual(0);
        });

    })();
});