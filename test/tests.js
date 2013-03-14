module.exports = function(prefix, Router) {

	describe(prefix + ' amd-router/Router', function() {
    
	    (function() {
		        
	        var router = new Router({
	            routes : [
	                '/cars',
	                '/cars/:carId',
	                '/trucks',
	                '/trucks/:truckId'
	            ]
	        });
	        
	        it('should contain 4 routes', function() {
	            expect(router.getRoutes().length).toEqual(4);
	        });

	        it('should contain routes that we expect', function() {
	            expect(router.getRoutes()[0].toString()).toEqual('/cars');
	            expect(router.getRoutes()[1].toString()).toEqual('/cars/:carId');
	            expect(router.getRoutes()[2].toString()).toEqual('/trucks');
	            expect(router.getRoutes()[3].toString()).toEqual('/trucks/:truckId');
	        });

	        it('should find match /cars', function() {
	            var match = router.findRoute('/cars');
	            expect(match).toNotEqual(null);
	            expect(match.route.toString()).toEqual('/cars');
	        });

	        it('should find match /cars/123', function() {
	            var match = router.findRoute('/cars/123');
	            expect(match.params.carId).toEqual('123');
	            expect(match.route.toString(match.params)).toEqual('/cars/123');
	        });

	        it('should not find match /cars/123/bad', function() {
	            var match = router.findRoute('/cars/123/bad');
	            expect(match).toEqual(null);
	        });
	        
	        it('should support resetting of routing table', function() {
	            router.reset();
	            expect(router.getRoutes().length).toEqual(0);
	        });

	    })();
	});
};