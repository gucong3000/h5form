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
		setHolder,
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
				defineProperty(Element, aName, prop[aName] ? {
					get: function() {
						return this.getAttribute(aName, 2);
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
			});
		}
		return Element;
	}

	function stepMismatchMsg(elem) {
		var val = num(elem.value),
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
							return willValidate() && elem.required && !(/^checkbox$/i.test(elem.type) ? elem.checked : (/^radio$/i.test(elem.type) ? elem.form.querySelector("[name='" + elem.name + "']:checked") : elem.value));
						},
						customError: function() {
							return !!customCache[elem.uniqueID];
						},
						tooLong: function(){
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
					var e = {},
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
					var target = e.target,
							form = target.form;

					if (!e.defaultPrevented && target && form && /^submit$/i.test(target.type) && !(target.formNoValidate || form.noValidate)) {
						if (form.checkValidity()) {
							form.submit();
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

			//修复placeholder
			selector("input,textarea", setHolder);
			if (enumerable) {
				addEventListener(document, "DOMNodeInserted", function(e) {
					var target = e.target;
					if (/^input|textarea&/i.test(target.tagName)) {
						setHolder(target);
					}
				}, true);
			}
		}, 250);
		if (enumerable) {
			document.removeEventListener(strDOMContentLoaded, documentready, false);//清除注册的事件监听函数
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

	setHolder = (function() {
		var strPlaceholder = "placeholder",
				parseInt = window.parseInt,
				placeholderCache = {},
				strNormal = "normal",
				strStatic = "static",
				strPx = "px",
				getComputedStyle = window.getComputedStyle ? function(node) {
					return window.getComputedStyle(node, null);
				} : 0;

		//获取node的style对象，优先使用runtimeStyle
		function runtimeStyle(node) {
			return node.runtimeStyle || node.style;
		}

		//获取node的计算样式，兼容IE，非IE
		function currentStyle(node) {
			return node.currentStyle || getComputedStyle(node);
		}

		//为input建立模拟的placeholder
		function createHolder(input) {
			var uniqueID = input.uniqueID,
					holder,
					timer,
					on = function(eType, fn, node) {
						addEventListener(node || input, eType, fn, true);
					},
					//更新placeholder文本
					setText = function() {
						//读取placeholder
						var text = input[strPlaceholder];
						//如果placeholder属性不为空而node还没有建立
						if (!holder && text) {
							//建立一个node
							holder = createElement(strPlaceholder);
							holder.onmousedown = function() {
								//鼠标点holder是文本框获得焦点
								setTimeout(function() {
									input.focus();
								}, 1);
								return false;
							};
						}
						//如果有node，更新其内容为placeholder属性值
						if (holder) {
							holder.innerHTML = text || "";
						}
					},
					//控制node的样式
					setDisplay = function() {
						clearTimeout(timer);
						if (holder) {
							var show = holder.innerHTML && !input.value && isTextbox(input),
									currStyle = currentStyle(input),
									style = runtimeStyle(holder),
									parent = input.parentNode,
									disp = parent && (input.offsetHeight || input.offsetWidth);
							style.display = show && disp ? "block" : "none";
							//如果文本框可见时
							if (!disp) {
								//文本框不可见时延迟运行setDisplay
								timer = setTimeout(setDisplay, 50);
							} else if (show) {
								if (currStyle.position === strStatic && currentStyle(parent).position === strStatic) {
									runtimeStyle(input).position = "relative";
									timer = setTimeout(setDisplay, 0);
								} else {
									//如果文本框或其父元素定位不为static，则自动计算placeholder的位置
									style.maxWidth = getComputedStyle ? currStyle.width : (input.clientWidth - parseInt(currStyle.paddingLeft) - parseInt(currStyle.paddingRight)) + strPx;
									style.width = currStyle.textAlign === "left" ? "auto" : style.maxWidth;
									style.left = (input.offsetLeft + input.clientLeft) + strPx;
									style.top = (input.offsetTop + input.clientTop) + strPx;
									currCss("marginLeft", "paddingLeft");
									currCss("marginTop", "paddingTop");

									if (/^input$/i.test(input.tagName)) {
										style.whiteSpace = "nowrap";
										style.wordBreak = strNormal;
										if (getComputedStyle) {
											style.lineHeight = getComputedStyle(input).height;
										} else {
											currCss("lineHeight");
										}
									} else {
										style.whiteSpace = strNormal;
										style.wordBreak = "break-all";
										currCss("lineHeight");
									}

									currCss("textAlign");
									currCss("fontFamily");
									currCss("fontWidth");
									currCss("fontSize");

									//将node插入文本框之后
									if (input.nextSibling) {
										parent.insertBefore(holder, input.nextSibling);
									} else {
										parent.appendChild(holder);
									}
								}
							}
						}
					},
					//样式继承，取文本框的样式赋值给placeholder
					currCss = function(name, attr) {
						try {
							runtimeStyle(holder)[name] = currentStyle(input)[attr || name];
						} catch (e) {
						}
					};

			if (!placeholderCache[uniqueID]) {
				//高级浏览器下事件注册
				if (enumerable) {
					forEach([strInput, "DOMAttrModified"], function(eType) {
						on(eType, function() {
							setTimeout(function() {
								setText();
								setDisplay();
							}, 0);
						});
					});
				} else {
					on("propertychange", function() {
						var propName = event.propertyName;
						setTimeout(function() {
							switch (propName) {
								//如placeholder属性发生改变，重置文案和样式
								case strPlaceholder :
									setText();
									//如value属性发生改变，重置重置样式
									/* falls through */
								default :
									setDisplay();
							}
						}, 0);
					});
				}

				on("resize", setDisplay, window);
				on("scroll", setDisplay, window);
				//初始化placeholder及其样式
				setText();
				setDisplay();
				placeholderCache[uniqueID] = true;
			}
		}
		return createHolder;
	})();

	//让IE9支持autofocus属性和placeholder属性
	if (/^interactive|complete$/.test(document.readyState)) {
		documentready();
	} else {
		addEventListener(document, strDOMContentLoaded, documentready);
	}

})(this, document);
