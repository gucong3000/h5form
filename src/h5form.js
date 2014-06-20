(function(window, document, undefined){
	"use strict";

	var	documentMode = document.querySelector ? document.documentMode : 7,
		path = document.scripts || document.querySelector("script"),
		placeholderCssRest = "color:gray; opacity:1;",
		supportUniqueID = "uniqueID" in document,
		head = document.documentElement.children[0],
		styleNode = createElement("style"),
		strPlaceholder = "placeholder",
		options,
		support,
		jQuery = window.jQuery,
		JSON = window.JSON;

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

	//添加css规则
	function addStyleRule(sSelector, sStyle){
		var cssText = sSelector + "{" + sStyle + "}";
		if(styleNode.styleSheet){
			try {
				styleNode.styleSheet.addRule(sSelector, sStyle);
			} catch (ex) {
				styleNode.styleSheet.cssText += cssText;
			}
		} else {
			styleNode.appendChild(document.createTextNode(cssText));
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

	function getPath(ext){
		if(path){
			return path.replace(/\.js/, ext);
		}
	}

	path = path[path.length - 1];
	try {
		options = path.innerHTML.replace(/[\s]+/g, " ");
		if(options){
			if(jQuery){
				options = jQuery.parseJSON(options);
			} else if(JSON){
				options = JSON.parse(options);
			} else {
				/* jshint ignore:start */
				options = new Function("return " + options)() || {};
				/* jshint ignore:end */
			}
		}
	} catch (ex){}
	options = options || {};
	path = path.getAttribute("src", 2);

	try {
		document.querySelector(":invalid");
		support = true;
	} catch (ex) {
	}

	if(support) {

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

		if(documentMode && supportUniqueID){
			//IE 10+中placeholder在文本框focus时则消失，这与其他浏览器有差异，用css干掉其原生的placeholder功能
			addStyleRule(":-ms-input-" + strPlaceholder, "color:transparent !important;");
		} else {
			setTimeout(function(){
				addEventListener("click", function(e){
					var target = e.target;
					//即使是Safari支持约束验证API的情况下Safari（版本 5、6）也不会因为表单的数据没有满足约束验证而阻止用户提交。所以一律js重新实现一遍
					if(!e.defaultPrevented && isSubmitClick(target) && !target.form.checkValidity()){
						e.preventDefault();
						//IE10、IE11中，querySelector（":invalid“）有时会选中disabled状态的文本框，所以加not排除
						target = target.form.querySelector(":invalid:not(:disabled)");
						if(target){
							target.focus();
						}
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
					if(node.checkValidity && !node.checkValidity()){
						if(!defaultPrevented){
							defaultPrevented = true;
							node.focus();
						}
					}
				}
				if(defaultPrevented){
					e.returnValue = !defaultPrevented;
				}
			}
		});
	}

	if(documentMode){
		addStyleRule(strPlaceholder, "position:absolute;cursor:text;color:gray;padding:0;border:0;overflow:hidden;-ms-user-select:none;user-select:none;pointer-events:none;");
		if( documentMode < 9 ){
			//IE6\7\8下通过htc方式加载
			options.htc = options.htc || getPath(".htc");
			if(options.htc){
				addStyleRule("form,input,select,textarea", "behavior: url(" + options.htc + ");");
			}
		} else if( supportUniqueID ) {
			//IE9、10、11下通过js方式加载
			options.js = options.js || getPath(".el.js");
			if(options.js){
				createElement("script").src = options.js;
			}
		}
	}

})(this, document);
