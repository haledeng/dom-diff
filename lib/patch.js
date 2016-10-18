var patch = {};
var VPatch = require('./vPatch');
var applyAttr = require('./attribute');
var _ = require('./util');
var findIndexNode = require('./traversal');

// 遍历tree的index
patch.patchProps = function(one, two, diff) {

};

var findPatchNode = function(node, patch) {
	var children = {};
	for (var index in patch) {
		if (index !== 'left') {
			var child = findIndexNode(node, index);
			children[index] = child;
		}
	}
	return children;
}

// 增量渲染
// 边查找边操作有bug
var patchDom = function(node, patch, index) {
	// 先把dom和index关系查找完毕，在进行dom操作
	var domIndex = findPatchNode(node, patch);
	for (var index in patch) {
		if (index !== 'left') {
			var child = domIndex[index];
			var applies = patch[index];
			if (!_.isArray(applies)) {
				applies = [applies];
			}
			applies.forEach(function(apply) {
				switch (apply.type) {
					case VPatch.REMOVE:
						removeChild(apply);
						break;
					case VPatch.INSERT:
						insertChild(child, apply);
						break;
					case VPatch.REPLACE:
						replaceChild(child, apply);
						break;
					case VPatch.PROPS:
						applyAttr.applyAttributes(child, apply.right);
						break;
					case VPatch.TEXTNODE:
						replaceContent(child, apply.right);
						break;
					default:
						break;
				}
			});
		}
	}
};

// textNode节点，替换内容
function replaceContent(node, text) {
	node.innerHTML = text;
}

// 删除节点
function removeChild(apply) {
	apply.left.parentNode.removeChild(apply.left);
}


// 添加节点
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


patch.patchDom = function(patch) {
	var node = patch.left;
	patchDom(node, patch, 0);
}

module.exports = exports = patch;