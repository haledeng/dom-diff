var VNode = require('./lib/vNode');
var applyProps = require('./lib/attribute');
var diffProps = require('./lib/diffProps');
var diffDom = require('./lib/diffDom');
var patch = require('./lib/patch');
window.domDiff = {
	applyProps: applyProps,
	diffProps: diffProps,
	VNode: VNode,
	diffDom: diffDom,
	patch: patch
};