/**
 * @description HTML5 form polyfill
 * @class h5form
 * @author gucong3000
 * @static
 */

/* global define */
(function(window, undefined) {
	"use strict";
	var jQuery = window.jQuery,
		document = window.document,
		documentMode = document.querySelector ? document.documentMode : 7,
		// 获取当前js路径
		path = (function() {
			var path;
			try {
				throw new Error("_");
			} catch (e) {
				if (e.stack) {
					e.stack.replace(/(?:\bat\b|@).*?(\b\w+\:\/{2,}.*?)(?:\:\d+){2,}/g, function(m, url) {
						if (!path) {
							path = url;
						}
					});
					return path;
				}
			}

			var scripts = document.scripts || document.getElementsByTagName("script");
			var lastScript;
			for (var i = scripts.length - 1; i >= 0; i--) {
				var script = scripts[i];
				if (script.src) {
					if (script.readyState === "interactive") {
						return script.src;
					} else if (!lastScript) {
						lastScript = script;
					}
				}
			}
			if (lastScript) {
				return lastScript.src;
			}
		})();

	(function(factory) {

		if (typeof define === "function") {
			var desp = ["jquery"];
			if (!window.ValidityState && Object.defineProperty && !(documentMode < 9)) {
				desp.push("h5form.el");
			}
			define("h5form", desp, factory);
		} else if (typeof exports === "object") {
			exports = factory(jQuery);
		} else {
			factory(jQuery);
		}
	})(function(jQuery) {
		var head = document.documentElement.children[0],
			options = window.h5form || {},
			styleNode,
			support;

		//在header中创建元素
		function createElement(tag) {
			tag = document.createElement(tag);
			head.insertBefore(tag, head.firstChild);
			return tag;
		}

		//事件绑定
		function addEventListener(type, listener, useCapture) {
			window.addEventListener(type, listener, useCapture);
		}

		/**
		 * @method addStyleRule
		 * @param {String} sSelector css选择符
		 * @param {String} sStyle css属性
		 */

		//添加css规则
		function addStyleRule(sSelector, sStyle) {
			if (!styleNode) {
				styleNode = createElement("style");
			}
			var cssText = sSelector + "{" + sStyle + "}";
			try {
				styleNode.appendChild(document.createTextNode(cssText));
			} catch (ex) {
				try {
					styleNode.styleSheet.addRule(sSelector, sStyle);
				} catch (ex) {
					styleNode.styleSheet.cssText += cssText;
				}
			}
		}

		//获取元素的对象属性值，当不存在时，获取标签属性值
		function getBoolProp(elem, name) {
			return typeof elem[name] === "boolean" ? elem[name] : !!elem.attributes[name];
		}

		//判断一个元素是submit按钮，且其所属表单未禁止表单验证
		function isSubmitClick(btn) {
			return btn && /^submit$/i.test(btn.type) && btn.form && !(getBoolProp(btn, "formNoValidate") || getBoolProp(btn.form, "noValidate"));
		}

		//触发表单对象方法
		function triggerFn(node, fn) {
			fn = fn || "focus";
			if (node && node[fn]) {
				setTimeout(function() {
					node[fn]();
				}, 0);
			}
		}

		//根据完整url，返回path
		function getPath(filename) {
			if (path) {
				return path.replace(/[^\/]+(?:\?.*)?(?:#.*)?$/, filename);
			}
		}

		try {
			addEventListener("invalid", function(e) {
				if (!e.cancelBubble) {
					e.preventDefault();
					if (jQuery) {
						e.stopPropagation();
						e.stopImmediatePropagation();
						jQuery(e.target).trigger("invalid");
					}
				}
			}, true);
			document.querySelector(":invalid");
			support = true;
		} catch (ex) {}

		if (support) {
			addEventListener("click", function(e) {
				var target = e.target;
				// 即使是Safari支持约束验证API的情况下Safari（版本 5、6）也不会因为表单的数据没有满足约束验证而阻止用户提交。所以一律js重新实现一遍
				if (!e.defaultPrevented && e.which === 1 && isSubmitClick(target) && !target.form.checkValidity()) {
					e.preventDefault();
					// IE10、IE11中，querySelector（":invalid"）有时会选中disabled状态的文本框，所以加not排除
					triggerFn(target.form.querySelector(":invalid:not(:disabled)"));
				}
			}, false);
		} else {

			//让jquery支持“:invalid”和“:valid”伪类
			if (jQuery) {
				(function() {

					// 判断对象是否表单元素,且需要表单验证
					function isInput(elem) {
						return /^(?:input|select|textarea|button)$/i.test(elem.nodeName) && elem.validity && elem.willValidate;
					}

					// 判断对象是否表单
					function isForm(elem) {
						return /^form$/i.test(elem.nodeName);
					}

					// 判断表单元素是否值正确
					function getInputValid(elem) {
						return elem.validity.valid;
					}

					// 判断表单的所有表单元素是否值正确
					function getFormValid(form) {
						var valid = true;
						jQuery.each(form.elements, function(i, elem) {
							if (isInput(elem)) {
								valid &= getInputValid(elem);
							}
						});
						return valid;
					}

					jQuery.extend(jQuery.expr[":"], {
						invalid: function(elem) {
							return isForm(elem) ? !getFormValid(elem) : (isInput(elem) ? !getInputValid(elem) : false);
						},
						valid: function(elem) {
							return isForm(elem) ? getFormValid(elem) : (isInput(elem) ? getInputValid(elem) : false);
						}
					});
				})();
			}

			document.attachEvent("onclick", function() {
				var e = event,
					returnValue = e.returnValue,
					btn = e.srcElement,
					form = btn.form,
					defaultPrevented,
					nodes,
					node,
					i;
				if ((!!returnValue || returnValue === undefined) && isSubmitClick(btn) && e.button === 1) {
					for (i = 0, nodes = form.elements; i < nodes.length; i++) {
						node = nodes[i];
						if (node.validity && !node.validity.valid) {
							if (!defaultPrevented) {
								defaultPrevented = true;
								triggerFn(node);
							}
							triggerFn(node, "checkValidity");
						}
					}
					if (defaultPrevented) {
						e.returnValue = !defaultPrevented;
					}
				}
			});
		}
		if (!window.ValidityState) {
			if (documentMode < 9) {
				/**
				 * @property {String} htc
				 * @description h5form.htc文件所在路径
				 * @default 当前js所在目录下的h5form.htc
				 */
				// IE6\7\8下通过htc方式加载
				var htcPath = options.htc || getPath("h5form.htc");
				addStyleRule("form,input,select,textarea,button", "behavior: url(" + htcPath + ");");

				// IE 6、7下需要延迟jQuery的Realy事件，以免调用setCustomValidity或其他属性时，h5form.htc还未运行，从而导致报错
				if (jQuery) {
					jQuery.holdReady(true);
					jQuery.ajax({
						url: htcPath,
						complete: function() {
							setTimeout(function() {
								jQuery.holdReady(false);
							}, 0);
						},
						error: function() {
							jQuery.holdReady(false);
						}
					});
				}
			} else {
				createElement("script").src = options.el || getPath("h5form.el.js");
			}
		}
	});
})(window);