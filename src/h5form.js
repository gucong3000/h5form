/**
 * @description HTML5 form polyfill
 * @class h5form
 * @author gucong3000
 */

(function(window, document, undefined){
	"use strict";

	var	documentMode = document.querySelector ? document.documentMode : 7,
		path = document.scripts || document.querySelector("script"),
		placeholderCssRest = "color:gray; opacity:1;",
		head = document.documentElement.children[0],
		supportUniqueID = "uniqueID" in document,
		strPlaceholder = "placeholder",
		options = window.h5form || {},
		jQuery = window.jQuery,
		styleNode,
		support;

	//在header中创建元素
	function createElement(tag){
		tag = document.createElement(tag);
		head.insertBefore(tag, head.firstChild);
		return tag;
	}

	//事件绑定
	function addEventListener(type, listener, useCapture){
		window.addEventListener(type, listener, useCapture);
	}

	/**
	 * @method addStyleRule
	 * @param {String} sSelector css选择符
	 * @param {String} sStyle css属性
	 */

	//添加css规则
	function addStyleRule(sSelector, sStyle){
		if(!styleNode){
			styleNode = createElement("style");
		}
		var cssText = sSelector + "{" + sStyle + "}";
		try {
			styleNode.appendChild(document.createTextNode(cssText));
		} catch (ex) {
			try {
				styleNode.styleSheet.addRule(sSelector, sStyle);
			} catch(ex){
				styleNode.styleSheet.cssText += cssText;
			}
		}
	}

	//获取元素的对象属性值，当不存在时，获取标签属性值
	function getProp(elem, name){
		return name in elem ? elem[name] : !!elem.attributes[name];
	}

	//判断一个元素是submit按钮，且其所属表单未禁止表单验证
	function isSubmitClick(btn){
		return btn && /^submit$/i.test(btn.type) && btn.form && !( getProp(btn, "formNoValidate") || getProp(btn.form, "noValidate"));
	}

	//触发表单对象方法
	function triggerFn(node, fn){
		fn = fn || "focus";
		if(node && node[fn]){
			setTimeout(function(){
				node[fn]();
			}, 0);
		}
	}

	//根据完整url，返回path
	function getPath(filename){
		if(path){
			return path.replace(/[^\/]+$/, filename);
		}
	}

	path = path[path.length - 1];
	try {
		options = options || eval.call(window, path.innerHTML) || {};
	} catch (ex){}
	window.h5form = options;

	path = path.getAttribute("src", 2) || "";

	try {
		addEventListener("invalid", function(e){
			if(!e.cancelBubble){
				e.preventDefault();
				if(jQuery){
					e.stopPropagation();
					e.stopImmediatePropagation();
					jQuery(e.target).trigger("invalid");
				}
			}
		}, true);
		document.querySelector(":invalid");
		support = true;
	} catch (ex) {
	}

	if(support) {

		if(!(documentMode && supportUniqueID)){
			setTimeout(function(){
				addEventListener("click", function(e){
					var target = e.target;
					//即使是Safari支持约束验证API的情况下Safari（版本 5、6）也不会因为表单的数据没有满足约束验证而阻止用户提交。所以一律js重新实现一遍
					if(!e.defaultPrevented && e.which === 1 && isSubmitClick(target) && !target.form.checkValidity()){
						e.preventDefault();
						//IE10、IE11中，querySelector（":invalid“）有时会选中disabled状态的文本框，所以加not排除
						triggerFn(target.form.querySelector(":invalid:not(:disabled)"));
					}
				}, false);
			}, 200);
			//高端浏览器下写入关于placeholder的css rest
			addStyleRule(("netscape" in window ? "::-moz-": "::-webkit-input-") + strPlaceholder, placeholderCssRest);
			//未来浏览器厂商推出无前缀的placeholder选择器后，在此行添加css rest
			//addStyleRule("::" + strPlaceholder, placeholderCssRest);
		}
	} else {

		//让jquery支持“:invalid”和“:valid”伪类
		if(jQuery) {
			jQuery.extend(jQuery.expr[":"], {
				invalid: function(elm){
					return elm.validity && !elm.validity.valid;
				},
				valid: function(elm){
					return elm.validity && elm.validity.valid;
				}
			});
		}

		document.attachEvent("onclick", function(){
			var	e = event,
				returnValue = e.returnValue,
				btn = e.srcElement,
				form = btn.form,
				defaultPrevented,
				nodes,
				node,
				i;
			if( (!!returnValue || returnValue === undefined) && isSubmitClick(btn) ){
				for(i = 0, nodes = form.elements; i < nodes.length; i++){
					node = nodes[i];
					if(node.validity && !node.validity.valid){
						if(!defaultPrevented){
							defaultPrevented = true;
							triggerFn(node);
						}
						triggerFn(node, "checkValidity");
					}
				}
				if(defaultPrevented){
					e.returnValue = !defaultPrevented;
				}
			}
		});
	}

	if(documentMode){
		if( documentMode < 9 ){
			/**
			 * @property {String} htc
			 * @description h5form.htc文件所在路径
			 * @default 当前js所在目录下的h5form.htc
			 */
			//IE6\7\8下通过htc方式加载
			options.htc = options.htc || getPath("h5form.htc");
			if(options.htc){
				addStyleRule("form,input,select,textarea", "behavior: url(" + options.htc + ");");
			}
		} else if( supportUniqueID ) {
			/**
			 * @property {String} js
			 * @description h5form.el.js文件所在路径
			 * @default 当前js所在目录下的h5form.el.js
			 */
			//IE9、10、11下通过js方式加载
			options.js = options.js || getPath("h5form.el.js");
			if(options.js && (!window.ValidityState || /^\[.*\]$/.test(window.ValidityState))){
				createElement("script").src = options.js;
			}
		}
	}

	options.addStyleRule = addStyleRule;

	/**
	 * @description placeholder.js文件所在路径
	 * @property {String} placeholder
	 * @default 当前js所在目录下的placeholder.js
	 */

	//修复IE9+、Safari下placeholder与其他浏览器的差异
	//原本opera12以下也需要修复，但找不到办法去除原生样式，加之市场占有率不高，故不作处理了
	if(!(window.netscape || window.chrome || window.opera)){
		options[strPlaceholder] = options[strPlaceholder] || getPath(strPlaceholder + ".js");
		if(options[strPlaceholder] && typeof options[strPlaceholder] === "string"){
			createElement("script").src = options[strPlaceholder];
		}
	}

})(this, document);
