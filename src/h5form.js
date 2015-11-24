/**
 * @description HTML5 form polyfill
 * @class h5form
 * @author gucong3000
 * @static
 */

/* global jQuery, seajs */

(function(factory) {
	"use strict";
	if (window.jQuery) {
		factory(jQuery);
	} else if (window.seajs) {
		seajs.use(["jquery"], factory);
	} else {
		factory();
	}
})(function(jQuery) {
	"use strict";
	(function(window, undefined) {
		var document = window.document,
			documentMode = document.querySelector ? document.documentMode : 7,
			path = document.scripts || document.querySelector("script"),
			head = document.documentElement.children[0],
			supportUniqueID = "uniqueID" in document,
			options = window.h5form || {},
			seajs = window.seajs,
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
				return path.replace(/[^\/]+$/, filename);
			}
		}

		path = path[path.length - 1];
		try {
			options = options || eval.call(window, path.innerHTML) || {};
		} catch (ex) {}
		// window.h5form = options;

		path = path.getAttribute("src", 2) || "";

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

			if (!(documentMode && supportUniqueID)) {
				setTimeout(function() {
					addEventListener("click", function(e) {
						var target = e.target;
						//即使是Safari支持约束验证API的情况下Safari（版本 5、6）也不会因为表单的数据没有满足约束验证而阻止用户提交。所以一律js重新实现一遍
						if (!e.defaultPrevented && e.which === 1 && isSubmitClick(target) && !target.form.checkValidity()) {
							e.preventDefault();
							//IE10、IE11中，querySelector（":invalid"）有时会选中disabled状态的文本框，所以加not排除
							triggerFn(target.form.querySelector(":invalid:not(:disabled)"));
						}
					}, false);
				}, 10);
			}
		} else {

			//让jquery支持“:invalid”和“:valid”伪类
			if (jQuery) {
				(function() {
					// 判断对象是否表单元素,且需要表单验证
					function isInput(elem) {
						if (/^(?:input|select|textarea|button)$/i.test(elem.nodeName) && !(elem.validity && elem.willValidate)) {
							console.log(elem.outerHTML);
							console.log(elem.validity);
							console.log(elem.willValidate);
						}

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
				if ((!!returnValue || returnValue === undefined) && isSubmitClick(btn)) {
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

		if (documentMode) {
			if (documentMode < 9) {
				/**
				 * @property {String} htc
				 * @description h5form.htc文件所在路径
				 * @default 当前js所在目录下的h5form.htc
				 */
				//IE6\7\8下通过htc方式加载
				options.htc = (seajs ? (seajs.data.dir + "h5form.htc") : (options.htc || getPath("h5form.htc"))).replace(/^\w+:\/\/[^\/]+/, "");
				if (options.htc) {
					addStyleRule("form,input,select,textarea,button", "behavior: url(" + options.htc + ");");
				}

				// IE 6、7下需要延迟jQuery的Realy事件，以免调用setCustomValidity或其他属性时，h5form.htc还未运行，从而导致报错
				if (jQuery && documentMode < 8) {
					jQuery.holdReady(true);
					jQuery.ajax({
						url: options.htc,
						complete: function() {
							jQuery.holdReady(false);
						}
					});
				}

				// 判断如果是IE
			} else if (supportUniqueID) {
				/**
				 * @property {String} js
				 * @description h5form.el.js文件所在路径
				 * @default 当前js所在目录下的h5form.el.js
				 */
				if (seajs) {
					// seajs方式加载h5form.el.js
					seajs.use(["h5form.el"]);
				} else if (!window.ValidityState || /^\[.*\]$/.test(window.ValidityState)) {
					// 判断未加载过h5form.el.js
					options.js = options.js || getPath("h5form.el.js");
					if (options.js) {
						createElement("script").src = options.js;
					}
				}
			}
		}

	})(window);
});