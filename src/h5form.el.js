/**
 * 高端浏览器原生对象，h5form提供polyfill
 * @class HTMLInputElement
 */

/**
 * @description autofocus 属性规定在页面加载时，域自动地获得焦点。如：&lt;input type=&quot;text&quot; autofocus&gt;
 * @property {Boolean} autofocus
 * @default false
 */

/**
 * @description 用在button和input节点上，来阻止提交时验证此节点。如：&lt;input type="submit" value="Do NOT Validate" formnovalidate&gt;
 * @property {Boolean} formNoValidate
 */

/**
 * @description 规定输入域所允许的最小值。适用于以下类型的 input 标签：date pickers、number 以及 range。
 * @property {Number|String} min
 * @default ""
 */

/**
 * @description 规定输入域所允许的最大值。适用于以下类型的 input 标签：date pickers、number 以及 range。
 * @property {Number|String} max
 * @default ""
 */

/**
 * @description 输入域规定合法的数字间隔（如果 step="3"，则合法的数是 -3,0,3,6 等）。适用于以下类型的 input 标签：date pickers、number 以及 range。
 * @property {Number|String} step
 * @default ""
 */

/**
 * @description 正则表达式，用于验证 input 域。
 * @property {String} pattern
 * @default ""
 */

/**
 * @description placeholder 属性提供一种提示（hint），描述输入域所期待的值。适用于以下类型的 input 标签：text, search, url, telephone, email 以及 password。
 * @property {String} placeholder
 * @default ""
 */

/**
 * @description 规定必须在提交之前填写输入域（不能为空）。
 * @property {Boolean} required
 * @default false
 */

/**
 * @description willValidate 属性标识了这个DOM节点是否使用约束验证。对于可以提交的元素来说这个属性会被设置成 true 除非因为某些原因被禁止使用约束验证，例如有 disabled 属性时。
 * @property willValidate
 * @type {Boolean}
 * @default true
 * @readOnly
 */

/**
 * @description Dom节点的validity 属性会返回一个 ValidityState对象，它包含了一系列与节点相关的布尔属性的验证结果。
 * @property {ValidityState} validity
 * @readOnly
 */

/**
 * @description 浏览器为这个属性提供了一个默认的本地化信息。如果DOM节点不需要验证或者节点包含正确的内容，那么validationMessage会被设置为空字符串。
 * @property {String} validationMessage
 * @readOnly
 */

/**
 * @description 表单元素节点的checkValidity方法在元素包含正确内容的时候会返回 true。表单（form）节点的checkValidity方法会在其所有子节点都包含正确内容的时候返回true。另外，每次通过checkValidity方法验证表单元素正确性的时候且验证失败，出错节点的invalid事件会被触发。
 * @method checkValidity
 * @return {Boolean} 元素包含正确内容的时候会返回 true
 */

/**
 * @description setCustomValidity方法改变了validationMessage属性，也允许你添加自定义的验证规则。
 * @method setCustomValidity
 * @param {String} CustomValidityMessage 新的错误消息
 */

/**
 * @description 文本变化事件，用于替代keypress事件，以便解决中文输入不触发问题
 * @event input
 */

/**
 * @description 表单验证失败事件
 * @event invalid
 */

/**
 * @description 高端浏览器原生对象，h5form提供polyfill
 * @class HTMLFormElement
 */

/**
 * @description 当使用这个属性的时候，就表示表单所有的输入内容在提交时不需要验证了, 如：&lt;form novalidate&gt;&lt;/form&gt;
 * @property {Boolean} noValidate
 */

/**
 * @description 高端浏览器原生对象，h5form提供polyfill，方法、属性、事件请参考[HTMLInputElement](HTMLInputElement.html)
 * @see HTMLInputElement
 * @class HTMLTextAreaElement
 */

/**
 * @description ValidityState对象是通过表单域的 validity 属性获取的，该对象属性值均为布尔值。
 * @class ValidityState
 */

/**
 * @description 必填的表单元素的值为空。
 * 如果表单元素设置了required特性，则为必填项。如果必填项的值为空，就无法通过表单验证，valueMissing属性会返回true，否则返回false。
 * @property {Boolean} valueMissing
 */

/**
 * @description 输入值与type类型不匹配。
 * HTML 5新增的表单类型如email、number、url等，都包含一个原始的类型验证。如果用户输入的内容与表单类型不符合，则typeMismatch属性将返回true，否则返回false。
 * @property {Boolean} typeMismatch
 */

/**
 * @description 输入值与pattern特性的正则不匹配。
 * 表单元素可通过pattern特性设置正则表达式的验证模式。如果输入的内容不符合验证模式的规则，则patternMismatch属性将返回true，否则返回false。
 * @property {Boolean} patternMismatch
 */

/**
 * @description 输入的内容超过了表单元素的maxLength 特性限定的字符长度。
 * 表单元素可使用maxLength特性设置输入内容的最大长度。虽然在输入的时候会限制表单内容的长度，但在某种情况下，如通过程序设置，还是会超出最大长度限制。如果输入的内容超过了最大长度限制，则tooLong属性返回true，否则返回false。
 * @property {Boolean} tooLong
 */

/**
 * @description 输入的值小于min特性的值。
 * 一般用于填写数值的表单元素，都可能会使用min特性设置数值范围的最小值。如果输入的数值小于最小值，则rangeUnderflow属性返回true，否则返回false。
 * @property {Boolean} rangeUnderflow
 */

/**
 * @description 输入的值大于max特性的值。
 * 一般用于填写数值的表单元素，也可能会使用max特性设置数值范围的最大值。如果输入的数值大于最大值，则rangeOverflow属性返回true，否则返回false。
 * @property {Boolean} rangeOverflow
 */

/**
 * @description 输入的值不符合step特性所推算出的规则。
 * 用于填写数值的表单元素，可能需要同时设置min、max和step特性，这就限制了输入的值必须是最小值与step特性值的倍数之和。如范围从0到10，step特性值为2，因为合法值为该范围内的偶数，其他数值均无法通过验证。如果输入值不符合要求，则stepMismatch属性返回true，否则返回false。
 * @property {Boolean} stepMismatch
 */

/**
 * @description 使用自定义的验证错误提示信息。
 * 有时候，不太适合使用浏览器内置的验证错误提示信息，需要自己定义。当输入值不符合语义规则时，会提示自定义的错误提示信息。
 * 通常使用setCustomValidity()方法自定义错误提示信息：setCustomValidity(message)会把错误提示信息自定义为message，此时customError属性值为true；setCustomValidity("")会清除自定义的错误信息，此时customError属性值为false。
 * @property {Boolean} customError
 */

(function(window, document) {
	"use strict";

	var	strDOMContentLoaded = "DOMContentLoaded",
		strInput = "input",
		strPrototype = "prototype",
		HTMLFormElementPrototype = getPrototype(HTMLFormElement),
		documentMode = document.documentMode,
		enumerable = !documentMode || document.documentMode > 8,
		setTimeout = window.setTimeout,
		num = window.parseFloat,
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
		jQuery = window.jQuery,
		validityCache = {},
		customCache = {},
		valueCache = {},
		support;

	try {
		document.querySelector(":invalid");
		support = true;
	} catch (ex) {
	}

	function ValidityObj() {
	}

	ValidityObj[strPrototype] = {
		patternMismatch: false,
		rangeUnderflow: false,
		rangeOverflow: false,
		stepMismatch: false,
		typeMismatch: false,
		valueMissing: false,
		customError: false,
		tooLong: false,
		valid: true
	};

	//document.createElement缩写
	function createElement(tag) {
		return document.createElement(tag);
	}

	function defineProperty(obj, name, descriptor) {
		descriptor.enumerable = enumerable;
		Object.defineProperty(obj, name, descriptor);
	}

	function defineGetter(obj, props) {
		for (var pName in props) {
			defineProperty(obj, pName, {
				get: props[pName]
			});
		}
	}

	function getPrototype(obj) {
		return obj[strPrototype] || obj;
	}

	function getElemType(elem) {
		return (elem.getAttribute("type", 2) || elem.type).toLowerCase();
	}

	function defineAttr(Element, prop) {
		if (!support) {
			Element = getPrototype(Element);
			forEach(prop, function(aName) {
				if (!(aName in Element)) {
					defineProperty(Element, aName, prop[aName] ? {
						get: function() {
							return this.getAttribute(aName, 2) || "";
						},
						set: function(val) {
							this.setAttribute(aName, val);
						}
					} : {
						get: function() {
							return !!(this.attributes[aName]);
						},
						set: function(val) {
							if (val) {
								this.setAttribute(aName, aName);
							} else {
								this.removeAttribute(aName);
							}
						}
					});
				}
			});
		}
		return Element;
	}

	function stepMismatchMsg(elem) {
		var	val = num(elem.value),
			step = num(elem.step),
			deff = (val - num(elem.min) || (num(elem.max) - val)) % step,
			min = val - deff,
			max = min + step;
		return "值应该为 " + min + " 或 " + max;
	}

	function fixInputElement(Element) {
		Element = defineAttr(Element, {
			required: 0,
			pattern: 1
		});
		defineGetter(Element, {
			validity: function() {
				var elem = this,
					validity = validityCache[elem.uniqueID],
					validityGetter;

				function willValidate() {
					return elem.willValidate;
				}

				function hasVal() {
					return willValidate() && !!elem.value;
				}

				function getType() {
					return getElemType(elem);
				}

				function isNum() {
					return hasVal() && /^number|range$/i.test(getType());
				}

				if (!validity) {
					validity = new ValidityObj();

					validityGetter = {
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
							return willValidate() && elem.required && !(/^checkbox$/i.test(elem.type) ? elem.checked : (/^radio$/i.test(elem.type) ? (elem.form || document).querySelector("[name='" + elem.name + "']:checked") : elem.value));
						},
						customError: function() {
							return !!customCache[elem.uniqueID];
						},
						badInput: function(){
							return false;
						},
						tooLong: function() {
							elem.value && elem.value.length > elem.maxLength;
						},
						valid: function() {
							var validityObj = elem.validity;
							return !(validityObj.tooLong || validityObj.customError || validityObj.valueMissing || validityObj.patternMismatch || validityObj.typeMismatch || validityObj.rangeOverflow || validityObj.rangeUnderflow || validityObj.stepMismatch);
						}
					};
					try {
						defineGetter(validity, validityGetter);
					} catch (ex) {
						validity = createElement("ValidityState");
						defineGetter(validity, validityGetter);
					}
					validityCache[elem.uniqueID] = validity;
				}
				return validity;
			},
			willValidate: function() {
				return !this.disabled;
			},
			validationMessage: function() {
				var validityObj = this.validity;
				return customCache[this.uniqueID] || (validityObj.valueMissing ? "请填写此字段。" : (validityObj.patternMismatch ? "请匹配要求的格式。" : (validityObj.typeMismatch ? typeErrors[getElemType(this)] : (validityObj.rangeOverflow ? "值必须小于或等于 " + this.max : (validityObj.rangeUnderflow ? "值必须大于或等于 " + this.min : (validityObj.stepMismatch ? stepMismatchMsg(this) : ""))))));
			},
			setCustomValidity: function() {
				var uniqueID = this.uniqueID;
				return function(val) {
					customCache[uniqueID] = val;
				};
			}
		});

		defineGetter(Element, {
			checkValidity: function() {
				var node = this;
				return function() {
					var valid = node.validity.valid;
					if (!valid) {
						triggerEvent(node, "invalid");
					}
					return valid;
				};
			}
		});

	}

	function forEach(array, fn) {
		if (array) {
			var i;
			if ("length" in array) {
				for (i = 0; i < array.length; i++) {
					if (fn(array[i]) === false) {
						return;
					}
				}
			} else {
				for (i in array) {
					if (fn(i) === false) {
						return;
					}
				}
			}
		}
	}

	function selector(strSelector, fn) {
		forEach(document.querySelectorAll(strSelector), fn);
	}

	//事件绑定
	function addEventListener(node, type, listener, useCapture) {
		if (enumerable) {
			node.addEventListener(type, listener, !!useCapture);
		} else if (strDOMContentLoaded === type) {
			if (jQuery) {
				jQuery(listener);
			} else {
				window.attachEvent("load", listener);
			}
		} else {
			if (jQuery && type === strInput) {
				jQuery(node).bind(type + ".h5form", listener);
			} else {
				node.attachEvent("on" + type, function() {
					var	e = {},
						src = event;
					e.target = src.srcElement;
					e.defaultPrevented = src.returnValue === false;
					e.preventDefault = function() {
						e.defaultPrevented = true;
						src.returnValue = false;
					};
					listener.call(node, e);
				});
			}
		}
	}

	//事件触发
	function triggerEvent(node, type, cancelBubble) {
		if (document.createEvent) {
			var e = document.createEvent("HTMLEvents");
			e.initEvent(type, !!cancelBubble, true);
			node.dispatchEvent(e);
		} else if (jQuery) {
			jQuery(node).trigger(type);
		}
	}

	//对象值发生变化则触发一次input事件
	function checkValChange(e) {
		var target = e ? e.target : document.activeElement;
		if (isContentEditable(target) || isTextbox(target)) {
			setTimeout(function() {
				if (valueCache[target.uniqueID] !== getText(target)) {
					triggerEvent(target, strInput, true);
				}
			}, 0);
		}
	}

	//返回对象contentEditable属性值
	function isContentEditable(node) {
		return node.contentEditable;
	}

	//获取文本框的内容
	function getText(textbox) {
		return isContentEditable(textbox) ? textbox.innerHTML : textbox.value;
	}

	//判断对象是否文本框
	function isTextbox(node) {
		return /^text(area)?|password|email|search|tel|url$/i.test(node.type);
	}

	function documentready() {

		setTimeout(function() {
			if (support) {
				//重新定义表单提交行为避免IE原生表单验证bug导致该提交时不提交，或不该提交时提交了
				addEventListener(window, "click", function(e) {
					var	target = e.target,
						form = target.form;

					if (!e.defaultPrevented && e.which === 1 && target && form && /^submit$/i.test(target.type) && !(target.formNoValidate || form.noValidate)) {
						if (form.checkValidity()) {
							if (jQuery) {
								// 直接调用form.submit()会导致别处e.preventDefault()无效
								jQuery(form).submit();
							} else {
								form.submit();
							}
						} else {
							e.preventDefault();
							forEach(form.elements, function(node) {
								if (node.validity && !node.validity.valid && node.focus) {
									node.focus();
									return false;
								}
							});
						}
					}
				});
			} else {
				//修复autofocus
				selector("[autofocus]", function(input) {
					input.focus();
					return false;
				});
			}
		}, 250);
		if (enumerable) {
			//清除注册的事件监听函数
			document.removeEventListener(strDOMContentLoaded, documentready, false);
		}
	}

	/* 修正以下问题
	 * Input事件在IE9下的bug，详见http://blog.csdn.net/cuixiping/article/details/7450542
	 * IE9以上有contenteditable属性的元素没有input事件
	 * IE9以下，完全没有input事件
	 */
	forEach([strInput, "focusin"], function(eType) {
		addEventListener(window, eType, function(e) {
			var target = e.target;
			valueCache[target.uniqueID] = getText(target);
		}, true);
	});

	forEach("change cut keypress focusout propertychange".split(/\s/), function(eType) {
		addEventListener(window, eType, checkValChange, true);
	});

	if (enumerable) {
		setInterval(checkValChange, 200);
	}

	if (!support) {

		defineAttr(HTMLFormElementPrototype, {
			noValidate: 0
		});

		defineAttr(HTMLButtonElement, {
			formNoValidate: 0
		});

		defineAttr(HTMLInputElement, {
			formNoValidate: 0,
			placeholder: 1,
			step: 1,
			max: 1,
			min: 1
		});

		defineAttr(HTMLTextAreaElement, {
			placeholder: 1
		});

	}

	window.ValidityState = ValidityObj;

	defineGetter(HTMLFormElementPrototype, {
		checkValidity: function() {
			var form = this;
			return function() {
				var	valid = true,
					nodes = form.elements,
					node,
					i;
				for (i = 0; i < nodes.length; i++) {
					node = nodes[i];
					if (node.checkValidity && !node.disabled) {
						valid &= node.checkValidity();
					}
				}
				return valid;
			};
		}
	});

	fixInputElement(HTMLTextAreaElement);
	fixInputElement(HTMLSelectElement);
	fixInputElement(HTMLInputElement);

	//让IE9支持autofocus属性、干掉原生的气泡提示、修复某些浏览不会阻止表单提交的问题
	if (/^interactive|complete$/.test(document.readyState)) {
		documentready();
	} else {
		addEventListener(document, strDOMContentLoaded, documentready);
	}

})(this, document);
