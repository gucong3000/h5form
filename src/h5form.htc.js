/* global element, placeholder, $, seajs, requirejs */
/* jshint strict: false, jquery: false */

var validityGetter = {
		patternMismatch: function() {
			return hasVal() && !!elem.pattern && !new RegExp("^(?:" + elem.pattern + ")$").test(elem.value);
		},
		rangeUnderflow: function() {
			return isNum() && num(elem.value) < num(elem.min);
		},
		rangeOverflow: function() {
			return isNum() && num(elem.value) > num(elem.max);
		},
		stepMismatch: function() {
			return isNum() && elem.step && ((num(elem.value) - num(elem.min) || (num(elem.max) - num(elem.value))) % num(elem.step)) !== 0;
		},
		typeMismatch: function() {
			var regexp = regexpTypes[getType()];
			return hasVal() && regexp && !regexp.test(elem.value);
		},
		valueMissing: function() {
			return elem.willValidate && elem.required && !(/^checkbox$/i.test(elem.type) ? elem.checked : (/^radio$/i.test(elem.type) ? isSiblingChecked(elem) : elem.value));
		},
		badInput: function() {
			return false;
		},
		tooLong: function() {
			elem.value && elem.value.length > elem.maxLength;
		}
	},
	ValidityState = function() {

	},
	regexpTypes = {
		email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		number: /^[+-]?\d+(\.\d+)?$/,
		url: /[a-z][\-\.+a-z]*:\/\//i,
		color: /#[\da-f]{6}/i
	},
	typeErrors = {
		email: "请输入电子邮件地址。",
		number: "请输入一个数字。",
		color: "请输入一个颜色值",
		url: "请输入一个URL。"
	},
	strFormNoValidate = "formNoValidate",
	strNoValidate = "noValidate",
	strAutofocus = "autofocus",
	strRequired = "required",
	win = window,
	validityObj = new ValidityState(),
	setTimeoutFn = win.setTimeout,
	num = top.parseFloat,
	strCustomError = "",
	attrData = {},
	elem = element,
	oldValue = elem.value,
	doc = elem.document,
	isDocumentReady,
	isContentReady,
	getValidationMessage,
	setFormNoValidate,
	getFormNoValidate,
	getWillValidate,
	setNoValidate,
	getNoValidate,
	setAutofocus,
	getAutofocus,
	setRequired,
	getRequired,
	getValidity,
	stepMismatchMsg,
	valueChange,
	setHolder,
	propertychange,
	documentready,
	trigger;

/*ValidityState对象原型*/
ValidityState.prototype = {
	patternMismatch: false,
	rangeUnderflow: false,
	rangeOverflow: false,
	stepMismatch: false,
	typeMismatch: false,
	valueMissing: false,
	customError: false,
	valid: true
};

if (!win.ValidityState) {
	win.ValidityState = ValidityState;
}
/*ValidityState对象原型 END*/

if (/^form$/i.test(elem.tagName)) {
	elem.checkValidity = function() {
		var valid = true,
			nodes = elem.elements,
			node,
			i;
		for (i = 0; i < nodes.length; i++) {
			node = nodes[i];
			if (node.checkValidity && node.willValidate) {
				valid &= node.checkValidity();
			}
		}
		return !!(valid && isDocumentReady);
	};

	// noValidate属性getter方法
	getNoValidate = defineGetter(strNoValidate);

	// noValidate属性setter方法
	setNoValidate = defineSetter(strNoValidate);


} else {
	// formNoValidate属性getter方法
	getFormNoValidate = defineGetter(strFormNoValidate);

	// formNoValidate属性setter方法
	setFormNoValidate = defineSetter(strFormNoValidate);


	// required属性getter方法
	getRequired = defineGetter(strRequired);

	// required属性setter方法
	setRequired = defineSetter(strRequired);


	// autofocus属性getter方法
	getAutofocus = defineGetter(strAutofocus);

	// autofocus属性setter方法
	setAutofocus = defineSetter(strAutofocus);

	stepMismatchMsg = function() {
		var val = num(elem.value),
			step = num(elem.step),
			deff = (val - num(elem.min) || (num(elem.max) - val)) % step,
			min = val - deff,
			max = min + step;
		return "值应该为 " + min + " 或 " + max;
	};

	// validationMessage属性getter方法
	getValidationMessage = function() {
		return strCustomError || (validityObj.valueMissing ? "请填写此字段。" : (validityObj.patternMismatch ? "请匹配要求的格式。" : (validityObj.typeMismatch ? typeErrors[getType()] : (validityObj.rangeOverflow ? "值必须小于或等于 " + elem.max : (validityObj.rangeUnderflow ? "值必须大于或等于 " + elem.min : (validityObj.stepMismatch ? stepMismatchMsg() : ""))))));
	};

	// validationMessage属性getter方法
	getWillValidate = function() {
		return !(elem.disabled || elem.readOnly || (/^input$/i.test(elem.nodeName) && /^hidden$/i.test(elem.type)));
	};

	// validity属性getter方法
	getValidity = function() {
		for (var name in validityGetter) {
			validityObj[name] = validityGetter[name]();
		}
		valid();
		return validityObj;
	};

	elem.setCustomValidity = function(val) {
		strCustomError = val;
		validityObj.customError = !!val;
		valid();
	};

	elem.checkValidity = function() {
		getValidity();
		var valid = validityObj.valid;
		if (!valid) {
			trigger("invalid");
		}
		return valid;
	};

	if (!/^button$/i.test(elem.tagName)) {
		if (!doc.querySelector && /input/i.test(elem.tagName)) {
			elem.className += " type_" + getType();
		}

		// 未设置placeholder等属性的元素，访问该属性应返回空字符串而非null
		(function() {
			var propNames = ["placeholder", "pattern", "step", "max", "min"];
			for (var i = 0; i < propNames.length; i++) {
				if (!elem.getAttribute(propNames[i], 2)) {
					elem[propNames[i]] = "";
				}
			}
		})();

		if (/^text(area)?|password$/i.test(elem.type)) {

			// 模拟input事件
			valueChange = function() {
				getValidity();
				setTimeoutFn(function() {
					if (oldValue !== elem.value) {
						oldValue = elem.value;
						trigger("input");
					}
				}, 0);
			};

			setHolder = function() {
				if (win.placeholder) {
					placeholder(elem);
				} else {
					loadJsMoudle("placeholder", function(placeholder) {
						placeholder(elem);
					});
				}
			};
			setHolder();
		}
	}
	trigger = function(type) {
		if (win.$) {
			$(elem).trigger(type);
		} else {
			loadJsMoudle("jquery", function($) {
				$(elem).trigger(type);
			});
		}
	};

}

/**
 * 检查元素是否设置了autofocus且可以获得焦点(页面上可见)
 * @param  {[type]} elem [description]
 * @return {[type]}      [description]
 */
function canFocus(elem) {
	return elem.focus && elem.attributes.autofocus && elem.offsetHeight && elem.offsetWidth;
}

documentready = function() {
	isDocumentReady = true;
	if (canFocus(elem)) {
		// 倒序遍历页面上所有表单的表单元素，找到最后一个可获取焦点的元素
		for (var forms = doc.forms, i = forms.length - 1; i >= 0; i--) {
			for (var nodes = forms[i].elements, j = nodes.length - 1; j >= 0; j--) {
				var node = nodes[j];
				// 找到了可获取焦点的元素
				if (canFocus(node)) {
					// 如果最后一个可获取焦点的元素就是当前的元素，则让其获取焦点
					if (node === elem) {
						try {
							node.focus();
						} catch (ex) {

						}
					}
					// 退出循环，以便只操作最后一个符合的表单元素
					return;
				}
			}
		}
	}
};

propertychange = function() {
	var propName = event.propertyName;
	if (propName in attrData && isContentReady) {
		attrData[propName] = !!elem.attributes[propName];
	}
	if (setHolder) {
		setHolder(propName);
	}
	if (valueChange) {
		valueChange();
	}
};

function defineGetter(name) {
	return function() {
		return !!(attrData[name]);
	};
}

function defineSetter(name) {
	return function(val) {
		attrData[name] = (isContentReady || typeof val === "boolean") ? val : true;
	};
}

function valid() {
	validityObj.valid = !(validityObj.tooLong || validityObj.customError || validityObj.valueMissing || validityObj.patternMismatch || validityObj.typeMismatch || validityObj.rangeOverflow || validityObj.rangeUnderflow || validityObj.stepMismatch);
}

/**
 * 检查与el同名的、同属一个form的表单元素是否有任何一个，checked属性为true
 * @param  {Element}  要检查的
 * @return {Boolean}    [description]
 */
function isSiblingChecked(el) {
	var siblings = el.form[el.name || el.id],
		i;
	for (i = 0; i < siblings.length; i++) {
		if (siblings[i].checked) {
			return true;
		}
	}
}

/**
 * 加载js模块，使用seasj或者requirejs
 * @param  {String}   moudul   要加载的模块名
 * @param  {Function} callback 加载成功的回调函数
 */
function loadJsMoudle(moudul, callback) {
	if (win.seajs) {
		seajs.use([moudul], callback);
	} else if (win.requirejs) {
		requirejs([moudul], callback);
	}
}

function hasVal() {
	return elem.willValidate && !!elem.value;
}

function getType() {
	return (elem.getAttribute("type", 2) || elem.type).toLowerCase();
}

function isNum() {
	return hasVal() && /^number|range$/i.test(getType());
}