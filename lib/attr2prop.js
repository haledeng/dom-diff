var _ = require('./util');
var transformStyleName = function(name) {
    var reg = /\-([a-z])/g;
    return name.replace(reg, function(all, key) {
        return key.toUpperCase();
    });
};

module.exports = function(attr) {

    // style
    var attrReg = /([a-zA-Z\-]*)\s*?\:\s*?([a-zA-Z0-9%\-\s]*);?/g;
    var attrs = {};
    attr && attr.replace(attrReg, function(all, key, value) {
        key = transformStyleName(key);
        attrs[key] = _.trim(value);
    });
    return attrs;
};