
var formulaes = {
	'midpoint': function (f, a, b) {
		return (b - a) * f((a + b) / 2);
	},
	'trapezoid': function (f, a, b) {
		return ((b - a) / 2) * (f(a) + f(b));
	},
	'simpsons': function (f, a, b) {
		// return (b.minus(a).dividedBy(6)).times(
				// f(a).plus(f(a.plus(b).dividedBy(2)).times(4)).plus(f(b)));
		return ((b - a) / 6) *
				(f(a) + 4 * f((a + b) / 2) + f(b));
	},
	'simpsons3/8': function (f, a, b) {
		var h = (b - a) / 3;
		return ((b - a) / 8) *
				(f(a) + 3 * f(a + h) + 3 * f(a + 2 * h) + f(b));
	},
	'boole': function (f, a, b) {
		var h = (b - a) / 4;
		return ((b - a) / 90) *
			(7 * f(a) + 32 * f(a + h) + 12 * f(a + 2 * h) + 32 * f(a + 3 * h) + 7 * f(b));
	}
};
	
module.exports = quadrature;

/**
* Finds a numerical integral approximation
*
* @method quadrature
* @param {Function} f is the integrand to evaluate
* @param {Object} args
* @return {Number} numerical approximation of integral
*/
function quadrature(f, a, b, args) {
	//function f check
	if (typeof f !== 'function') {
		throw Error('must provide f as a function');
	} else if (f.length !== 1) {
		throw Error('function f can only have one argument');
	}
	
	//object check
	if (args && typeof args !== 'object') {
		throw Error('args argument must be an object');
	}
	
	var options = clone(args);
	//set up options
	if (arguments.length === 4) {
		options.start = a;
		options.end = b;
	} else if (arguments.length === 3) {
		options = {
			start: a,
			end: b
		};
	} else if (arguments.length === 2) {
		options = a;
	} else if (arguments.length === 1) {
		throw Error('must supply arguments a and b or provide args argument');
	} else {
		throw Error('invalid number of arguments');
	}
	options.nintervals = options.nintervals || 1000;
	options.rule = options.rule || 'simpsons';
	
	//argument validation
	if (typeof options.start !== 'number' && options.start !== -Infinity && options.start !== Infinity) {
		throw Error('start must be a number');
	} else if (typeof options.end !== 'number' && options.end !== Infinity && options.end !== -Infinity) {
		throw Error('end must be a number');
	} else if (typeof options.nintervals !== 'number' || options.nintervals <= 0) {
		throw Error('nintervals must be a positive number');
	} else if (!(options.rule in formulaes)) {
		throw Error(options.rule + " is not a supported rule");
	}
	
	var sum = calculate(f, options);
		
	//attempt convergence test
	if (testConvergence(f, options, sum)) {
		return sum;
	} else {
		//might be a good place to check for 
		//oscillations and return undefined
		if (sum >= 0) {
			return Infinity;
		} else {
			return -Infinity;
		}
	}
}

function calculate(f, options) {
	var n = Math.floor(options.nintervals), //n
		start = options.start, //a
		end = options.end, //b
		stepSize, //h
		i,
		sum = 0,
		approximation = formulaes[options.rule],
		newF = f,
		reverseIntegral = false;
		
	//check start === end
	//then check start > end and switch them if need be
	if (start === end) {
		return 0;
	} else if (start > end) {
		start = options.end;
		end = options.start;
		reverseIntegral = true;
	}
	
	//improper integral check, change of variables to finite interval 
	if (start === -Infinity && end === Infinity) {
		newF = function (t) {
			//prevent divide by 0
			if (t === 0) {
				t = 0.000001;
			}
			var tSquared = Math.pow(t, 2);
			//prevent divide by 0
			if (tSquared === 1) {
				tSquared = 0.999999;
			}
			return f(t / (1 - tSquared)) * (1 + tSquared) / Math.pow(1 - tSquared, 2);
		};
		start = -1;
		end = 1;
	} else if (start !== -Infinity && end === Infinity) {
		newF = (function () {
			var a = start;
			return function (t) {
				//prevent divide by 0
				if (t === 1) {
					t = 0.999999;
				}
				return f(a + (t / (1 - t))) / Math.pow(1 - t, 2);
			};
		}());
		start = 0;
		end = 1;
	} else if (start === -Infinity && end !== Infinity) {
		newF = (function () {
			var b = end;
			return function (t) {
				//prevent divide by 0
				if (t === 0) {
					t = 0.000001;
				}
				return f(b - (1 - t) / t) / Math.pow(t, 2);
			};
		}());
		start = 0;
		end = 1;
	}
	
	stepSize = (end - start) / n;
	
	//another improper integral check
	//we want to find the limit as we approach an end point
	//so we evaluate the integral close to the end point
	//and hope the new result is close to the limit if one exists
	if (newF(start) === Infinity || newF(start) === -Infinity || isNaN(newF(start))) {
		start += 0.000001 //this seemed to smallest value that wouldn't break tests
	}
	if (newF(end) === Infinity || newF(end) === -Infinity || isNaN(newF(end))) {
		end -= 0.000001;
	}
	
	for (i = 0; i < n; i += 1) {
		var a1 = start + stepSize * i,
			b1 = start + stepSize * (i + 1),
			approx = approximation(newF, a1, b1);
		
		//isNaN check, e.g. 0 / 0, sin(infinity), and infinity / infinity return NaN
		if (isNaN(approx)){
			throw Error('interval approximation for [' + a1 + ',' + b1 + '] returned ' + approx);	
		}
		sum += approx;
	}
	
	return reverseIntegral ? -sum : sum;
}

function testConvergence(f, options, previousResult) {
	var i,
		iterations = options.nintervals <= 100 ? 7 : 5,
		CLOSE = 0.01,
		converges = false,
		currentResult;
		
	//double the intervals and compare to previous result
	//if the previous and current results are 'CLOSE'
	//we assume convergence
	for (i = 0; i < iterations; i += 1) {
		options.nintervals *= 2;
		currentResult = calculate(f, options);
		if (Math.abs(previousResult - currentResult) < CLOSE) {
			converges = true;
			break;
		}
		previousResult = currentResult;
	}
	
	return converges;
}

function computeLimit(f, a, b) {
	
}

function clone(options) {
	var newObj = {};
	for (var prop in options) {
		if (options.hasOwnProperty(prop)) {
			newObj[prop] = options[prop];
		}
	}
	return newObj;
}
