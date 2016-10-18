var _ = exports = module.exports = {};

var toString = Object.prototype.toString;
_.trim = function(str) {
	return str.replace(/(^\s*)|(\s*$)/, '');
};

/**
 * is Object
 * @param    {[type]}                 obj [description]
 * @return   {Boolean}                    [description]
 */
_.isObject = function(obj) {
	return '[object Object]' === toString.call(obj);
}

/**
 * is object an array
 * @param    {object}                 obj [description]
 * @return   {Boolean}                    [description]
 */
_.isArray = function(obj) {
	return '[object Array]' === toString.call(obj);
}

/**
 * is empty string
 * @param    {string}                 obj [description]
 * @return   {Boolean}                    [description]
 */
_.isEmptyStr = function(obj) {
	return obj === '';
}


_.isFunction = function(fn) {
	return fn && typeof fn === 'function';
}