/* global element, placeholder, $ */
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
		badInput: function(){
			return false;
		},
		tooLong: function() {
			elem.value && elem.value.length > elem.maxLength;
		}
	},
	ValidityState = function(){
	},
	regexpTypes = {
		email: /^[a-zA-Z0-9.!#$%&'*+-\/=?\^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
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
	setRequired,
	getRequired,
	getValidity,
	stepMismatchMsg,
	valueChange,
	setHolder,
	propertychange,
	documentready,
	seajs = win.seajs,
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

	//noValidate属性getter方法
	getNoValidate = defineGetter(strNoValidate);

	//noValidate属性setter方法
	setNoValidate = defineSetter(strNoValidate);


} else {
	//formNoValidate属性getter方法
	getFormNoValidate = defineGetter(strFormNoValidate);

	//formNoValidate属性setter方法
	setFormNoValidate = defineSetter(strFormNoValidate);

	if (!/^button$/i.test(elem.tagName)) {

		//required属性getter方法
		getRequired = defineGetter(strRequired);

		//required属性setter方法
		setRequired = defineSetter(strRequired);

		if (!doc.querySelector && /input/i.test(elem.tagName)) {
			elem.className += " type_" + getType();
		}

		stepMismatchMsg = function() {
			var val = num(elem.value),
				step = num(elem.step),
				deff = (val - num(elem.min) || (num(elem.max) - val)) % step,
				min = val - deff,
				max = min + step;
			return "值应该为 " + min + " 或 " + max;
		};

		//validationMessage属性getter方法
		getValidationMessage = function() {
			return strCustomError || (validityObj.valueMissing ? "请填写此字段。" : (validityObj.patternMismatch ? "请匹配要求的格式。" : (validityObj.typeMismatch ? typeErrors[getType()] : (validityObj.rangeOverflow ? "值必须小于或等于 " + elem.max : (validityObj.rangeUnderflow ? "值必须大于或等于 " + elem.min : (validityObj.stepMismatch ? stepMismatchMsg() : ""))))));
		};

		//validationMessage属性getter方法
		getWillValidate = function() {
			return !elem.disabled;
		};

		//validity属性getter方法
		getValidity = function() {
			for (var name in validityGetter) {
				validityObj[name] = validityGetter[name]();
			}
			valid();
			return validityObj;
		};

		//模拟input事件
		valueChange = function() {
			getValidity();
			if (/^text(area)?|password$/i.test(elem.type)) {
				setTimeoutFn(function() {
					if (oldValue !== elem.value) {
						oldValue = elem.value;
						trigger("input");
					}
				}, 0);
			}
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

		//未设置placeholder等属性的元素，方位该属性应返回空字符串而非null
		(function() {
			var propNames = ["placeholder", "pattern", "step", "max", "min"];
			for (var i = 0; i < propNames.length; i++) {
				if (!elem.getAttribute(propNames[i], 2)) {
					elem[propNames[i]] = "";
				}
			}
		})();

		setHolder = function() {
			if (/^text(area)?|password$/i.test(elem.type)) {
				if (win.placeholder) {
					placeholder(elem);
				} else if (seajs) {
					seajs.use(["placeholder"], function(placeholder) {
						placeholder(elem);
					});
				}
			}
		};
		setHolder();

		trigger = function(type) {
			if (win.$) {
				$(elem).trigger(type);
			} else if (seajs) {
				seajs.use(["jquery"], function($) {
					$(elem).trigger(type);
				});
			}
		};
	}
}

documentready = function() {
	isDocumentReady = true;
	if (elem.focus && elem.attributes.autofocus) {
		try {
			for (var forms = doc.forms, node, i = 0, j; i < forms.length; i++) {
				for (j = 0, node; j < forms[i].elements.length; j++) {
					node = forms[i].elements[j];
					if (node.focus && node.attributes.autofocus) {
						try {
							if (node === elem) {
								node.focus();
							}
							return;
						} catch(ex){
						}
					}
				}
			}
		} catch (ex) {
			elem.focus();
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
		//		return new RegExp("\\b" + name + "\\b", "i").test(elem.outerHTML);
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

function isSiblingChecked(el) {
	var siblings = el.form[el.name || el.id],
		i;
	for (i; i < siblings.length; i++) {
		if (siblings[i].checked) {
			return true;
		}
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