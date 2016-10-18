module.exports = exports = function diffProps(one, two) {
	var diff;
	for (var k in one) {
		if (!(k in two)) {
			diff = diff || {};
			diff[k] = undefined;
		}

		if (one[k] !== two[k]) {
			diff = diff || {};
			diff[k] = two[k];
		}
	}

	for (var key in two) {
		if (!(key in one)) {
			diff = diff || {};
			diff[key] = two[key];
		}
	}
	return diff;
};