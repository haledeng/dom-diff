/**
 * dom增、删、改
 */
var applyAttr = require('./attribute');

function insertChild(node, apply) {
	if (!apply.left && apply.right) {
		node.appendChild(apply.right)
	}
}


// 替换节点
function replaceChild(node, apply) {
	var parent = node.parentNode;
	var newNode = apply.right.cloneNode(true);
	parent.replaceChild(newNode, node);
}

// 删除节点
function removeChild(node, apply) {
	apply.left.parentNode.removeChild(apply.left);
}

// textNode节点，替换内容
function replaceContent(node, apply) {
	if (apply && typeof apply.right === 'string') {
		node.innerHTML = apply.right;
	}
}

function applyAttributes(node, apply) {
	applyAttr.applyAttributes(node, apply.right);
}


module.exports = {
	insertChild: insertChild,
	removeChild: removeChild,
	replaceContent: replaceContent,
	replaceChild: replaceChild,
	applyAttributes: applyAttributes
};