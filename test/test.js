var should = require("should"),
	quadrature = require("../index");
	
describe('Quadrature', function () {
	var x2 = function (x) {
		return x * x;
	}; 
	var gaussian = function (x) {
		return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(x * x) / 2);
	};
	var inverse_x = function (x) {
		return 1 / x;
	};
	var inverse_x2 = function (x) {
		return 1 / (x * x);
	};
	var inverse_rootx = function (x) {
		return 1 / Math.sqrt(x);
	};
	var xsinx = function (x) {
		return x * Math.sin(x);
	};
	var sin_inverse_x = function (x) {
		return Math.sin(1 / x);
	};
	var x = function (x) {
		return x;
	};
	
	describe('Midpoint rule x2 0 to 1', function () {
		it('one interval', function () {
			var sum = quadrature(x2, {start: 0, end: 1, nintervals: 1, rule: 'midpoint'});
			sum.should.equal(0.25);
		});		
		
		it('two intervals', function () {
			var sum = quadrature(x2, {start: 0, end: 1, nintervals: 2, rule: 'midpoint'});
			sum.should.equal(0.3125);
		});
		
		it('1000 intervals', function () {
			var sum = quadrature(x2, {start: 0, end: 1, nintervals: 1000, rule: 'midpoint'}),
				error = 1e-6;
			sum.should.be.approximately(1 / 3, error);
		});
	});
	
	describe('Trapezoid rule x2 0 to 1', function () {
		it('one interval', function () {
			var sum = quadrature(x2, {start: 0, end: 1, nintervals: 1, rule: 'trapezoid'});
			sum.should.equal(0.5);
		});
		
		it('two intervals', function () {
			var sum = quadrature(x2, {start: 0, end: 1, nintervals: 2, rule: 'trapezoid'});
			sum.should.equal(0.375);
		});
		
		it('1000 intervals', function () {
			var sum = quadrature(x2, {start: 0, end: 1, nintervals: 1000, rule: 'trapezoid'}),
				error = 1e-6;
			sum.should.be.approximately(1 / 3, error);
		});
	});
	
	describe('Simpsons rule x2 0 to 1', function () {
		it('one interval', function () {
			var sum = quadrature(x2, {start: 0, end: 1, nintervals: 1, rule: 'simpsons'});
			sum.should.equal(1 / 3);
		});
		
		it('two intervals', function () {
			var sum = quadrature(x2, {start: 0, end: 1, nintervals: 2, rule: 'simpsons'});
			sum.should.equal(1 / 3);
		});
		
		it('1000 intervals', function () {
			var sum = quadrature(x2, {start: 0, end: 1, nintervals: 1000, rule: 'simpsons'}),
				error = 1e-6;
			sum.should.be.approximately(1 / 3, error);
		});
	});
	
	describe('Simpsons3/8 rule x2 0 to 1', function () {
		it('one interval', function () {
			var sum = quadrature(x2, {start: 0, end: 1, nintervals: 1, rule: 'simpsons3/8'});
			sum.should.equal(1 / 3);
		});
		
		it('two intervals', function () {
			var sum = quadrature(x2, {start: 0, end: 1, nintervals: 2, rule: 'simpsons3/8'});
			sum.should.equal(1 / 3);
		});
		
		it('1000 intervals', function () {
			var sum = quadrature(x2, {start: 0, end: 1, nintervals: 1000, rule: 'simpsons3/8'}),
				error = 1e-6;
			sum.should.be.approximately(1 / 3, error);
		});
	});
	
	describe('Boole rule x2 0 to 1', function () {
		it('one interval', function () {
			var sum = quadrature(x2, {start: 0, end: 1, nintervals: 1, rule: 'boole'}),
				error = 1e-6;
			sum.should.be.approximately(1 / 3, error);
		});
		
		it('two intervals', function () {
			var sum = quadrature(x2, {start: 0, end: 1, nintervals: 2, rule: 'boole'}),
				error = 1e-6;
			sum.should.be.approximately(1 / 3, error);
		});
		
		it('1000 intervals', function () {
			var sum = quadrature(x2, {start: 0, end: 1, nintervals: 1000, rule: 'boole'}),
				error = 1e-6;
			sum.should.be.approximately(1 / 3, error);
		});
	});
	
	describe('gaussian confidence intervals (symmetric around 0)', function () {
		var error = 1e-6;
		it('50% confidence interval', function () {
			var sum = quadrature(gaussian, {start: -0.67449, end: 0.67449, nintervals: 1000});
			sum.should.be.approximately(0.5, error);
		});
		
		it('75% confidence interval', function () {
			var sum = quadrature(gaussian, {start: -1.15035, end: 1.15035, nintervals: 1000});
			sum.should.be.approximately(0.75, error);
		});
		
		it('90% confidence interval', function () {
			var sum = quadrature(gaussian, {start: -1.64485, end: 1.64485, nintervals: 1000});
			sum.should.be.approximately(0.90, error);
		});
		
		it('95% confidence interval', function () {
			var sum = quadrature(gaussian, {start: -1.95996, end: 1.95996, nintervals: 1000});
			sum.should.be.approximately(0.95, error);
		});
		
		it('97% confidence interval', function () {
			var sum = quadrature(gaussian, {start: -2.17009, end: 2.17009, nintervals: 1000});
			sum.should.be.approximately(0.97, error);
		});
		
		it('99% confidence interval', function () {
			var sum = quadrature(gaussian, {start: -2.57583, end: 2.57583, nintervals: 1000});
			sum.should.be.approximately(0.99, error);
		});
		
		it('99.9% confidence interval', function () {
			var sum = quadrature(gaussian, {start: -3.29053, end: 3.29053, nintervals: 1000});
			sum.should.be.approximately(0.999, error);
		});
	});
	
	describe('improper integrals', function () {
		var error = 1e-6;
		describe('gaussian', function () {
			it('-Infinity to 0 should equal 0.5', function () {
				var sum = quadrature(gaussian, {start: -Infinity, end: 0, nintervals: 1000});
				sum.should.be.approximately(0.5, error);
			});
			
			it('0 to Infinity should equal 0.5', function () {
				var sum = quadrature(gaussian, {start: 0, end: Infinity, nintervals: 1000});
				sum.should.be.approximately(0.5, error);
			});
			
			it('-Infinity to Infinity should equal 1', function () {
				var sum = quadrature(gaussian, {start: -Infinity, end: Infinity, nintervals: 1000});
				sum.should.be.approximately(1, error);
			});
		});
		
		describe('1 / x', function () {
			it('0 to 1 should equal infinity', function () {
				var sum = quadrature(inverse_x, 0, 1);
				sum.should.equal(Infinity);
			});
			
			it('1 to Infinity should equal infinity', function () {
				var sum = quadrature(inverse_x, 1, Infinity);
				sum.should.equal(Infinity);
			});
			
			it('0 to Infinity should equal infinity', function () {
				var sum = quadrature(inverse_x, 0, Infinity);
				sum.should.equal(Infinity);
			});
		});
		
		describe('1 / x^2', function () {
			it('0 to 1 should equal infinity', function () {
				var sum = quadrature(inverse_x2, 0, 1);
				sum.should.equal(Infinity);
			});
			
			it('1 to Infinity should equal 1', function () {
				var sum = quadrature(inverse_x2, 1, Infinity),
					error = 1e-5;
				sum.should.be.approximately(1, error);
			});
		});
		
		describe('1 / sqrt(x)', function () {
			it('1 to Infinity should equal infinity', function () {
				var sum = quadrature(inverse_rootx, 1, Infinity);
				sum.should.equal(Infinity);
			});
			
			it('0 to 1 should equal 2', function () {
				var sum = quadrature(inverse_rootx, 0, 1, {nintervals: 10000});
					error = 0.01;
				sum.should.be.approximately(2, error);
			});
		});
		
		describe('x^2', function () {
			it('0 to Infinity should equal infinity', function () {
				var sum = quadrature(x2, 0, Infinity);
				sum.should.equal(Infinity);
			});
			
			it('-Infinity to 0 should equal infinity', function () {
				var sum = quadrature(x2, -Infinity, 0);
				sum.should.equal(Infinity);
			});
			
			it('-Infinity to Infinity should equal infinity' ,function () {
				var sum = quadrature(x2, -Infinity, Infinity);
				sum.should.equal(Infinity);
			});
		});
		
		describe('xsinx', function () {
			it.skip('1 to Infinity should equal undefined', function () {
				var sum = quadrature(xsinx, 1, Infinity);
				sum.should.equal(undefined);
			});
		});
		
		describe('x', function () {
			it('-Infinity to 0 should equal -infinity', function () {
				var sum = quadrature(x, -Infinity, 0);
				sum.should.equal(-Infinity);
			});
			
			it('0 to Infinity should equal infinity', function () {
				var sum = quadrature(x, 0, Infinity);
				sum.should.equal(Infinity);
			});
			
			it('-Infinity to Infinity should equal 0', function () {
				var sum = quadrature(x, -Infinity, Infinity);
				sum.should.be.approximately(0, error);
			});
		});
		
	});
	
	describe('hard to compute integrals with known values', function () {		
		var error = 1e-2;
		it('sin(1/x) from 0 to 1/Math.PI should equal -0.073668', function() {
			var sum = quadrature(sin_inverse_x, 0, 1 / Math.PI);
			sum.should.be.approximately(-0.073668, error);
		});
		
		it('1/sqrt(x) 0 to 1 should equal 2', function () {
			var sum = quadrature(inverse_rootx, 0, 1, {nintervals: 10000});
				error = 0.01;
			sum.should.be.approximately(2, error);
		});
	});
	
});