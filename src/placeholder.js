(function(window, document, undefined){

	"use strict";

	var	h5form = window.h5form || (window.h5form = {}),
		addStyleRule = h5form.addStyleRule,
		strPlaceholder = "placeholder",
		attrName = "data-" + strPlaceholder + new Date().getTime() + Math.random(),
		strDOMAttrModified = "DOMAttrModified",
		parseInt = window.parseInt,
		supportDOMAttrModified,
		placeholderCache = {},
		strNormal = "normal",
		strStatic = "static",
		strPx = "px",
		getComputedStyle = window.getComputedStyle ? function(node) {
			return window.getComputedStyle(node, null);
		} : 0;

	if(h5form[strPlaceholder] && h5form[strPlaceholder].call){
		return;
	}

	//判断对象是否文本框
	function isTextbox(node) {
		return /^text(area)?|password|email|search|tel|url$/i.test(node.type);
	}

	//设置节点的holder
	function setPlaceholder(node, value){
		if(node.uniqueID){
			placeholderCache[node.uniqueID] = value;
		} else {
			node[attrName] = value;
		}
	}

	//获取节点的holder状态
	function getPlaceholder(node){
		var value;
		if(node.uniqueID){
			value = placeholderCache[node.uniqueID];
			placeholderCache[node.uniqueID] = value || true;
		} else {
			value = node[attrName];
			node[attrName] = value || true;
		}
		return value;
	}

	//获取node的style对象，优先使用runtimeStyle
	function runtimeStyle(node) {
		return node.runtimeStyle || node.style;
	}

	//获取node的计算样式，兼容IE，非IE
	function currentStyle(node) {
		return node.currentStyle || getComputedStyle(node);
	}

	function forEach(array, fn) {
		if (array) {
			[].slice.call(array, 0).forEach(fn);
		}
	}

	function addEventListener(node, type, listener, useCapture) {
		node.addEventListener(type, listener, !!useCapture);
	}

	//为input建立模拟的placeholder
	function createHolder(input) {
		var	winEvents = ["resize", "scroll"],
			currStyle = currentStyle(input),
			holder = getPlaceholder(input),
			timer,
			on = function(eType, fn, node) {
				addEventListener(node || input, eType, fn, true);
			},
			//更新placeholder文本
			setText = function() {
				//读取placeholder
				var text = input[strPlaceholder];
				//如果placeholder属性不为空而node还没有建立
				if((!holder || !holder.tagName) && text){
					//建立一个node
					holder = document.createElement(strPlaceholder);
					holder.onmousedown = function() {
						//鼠标点holder是文本框获得焦点
						setTimeout(function() {
							input.focus();
						}, 1);
						return false;
					};
					setPlaceholder(input, holder);
				}
				//如果有node，更新其内容为placeholder属性值
				if (holder && holder.tagName) {
					holder.innerHTML = text || "";
				}
			},
			//控制node的样式
			setDisplay = function() {
				clearTimeout(timer);
				if (holder && holder.tagName) {
					var	show = holder.innerHTML && !input.value && isTextbox(input),
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
							style.maxWidth = getComputedStyle && !/^auto$/.test(currStyle.width) ? currStyle.width : (input.clientWidth - parseInt(currStyle.paddingLeft) - parseInt(currStyle.paddingRight)) + strPx;
							style.width = "XMLHttpRequest" in window && currStyle.textAlign === "left" ? "auto" : style.maxWidth;
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
								//style.wordWrap = "break-word";
								currCss("lineHeight");
							}

							currCss("textAlign");
							currCss("textIndent");
							currCss("fontFamily");
							//currCss("fontWidth");
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

		if(!holder){
			try {

				//高级浏览器下事件注册
				forEach(["input", "change", "keypress", strDOMAttrModified], function(eType) {
					on(eType, function() {
						setTimeout(function() {
							setText();
							setDisplay();
						}, 0);
					});
				});

				if(currStyle.resize && !/^none$/.test(currStyle.resize)){
					//winEvents.push("mousemove");
				}

				forEach(winEvents, function(eType) {
					on(eType, setDisplay, window);
				});

			} catch(ex) {
				window.attachEvent("onresize", setDisplay);
				input.attachEvent("onpropertychange", function(){
					var propName = event.propName;
					setTimeout(function(){
						switch(propName){
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
		} else if(supportDOMAttrModified) {
			return;
		}
		//初始化placeholder及其样式
		setText();
		setDisplay();
	}

	function init(){
		forEach(document.querySelectorAll("input,textarea"), createHolder);
	}

	if(addStyleRule){
		addStyleRule(strPlaceholder, "position:absolute;cursor:text;color:gray;padding:0;border:0;overflow:hidden;-ms-user-select:none;user-select:none;pointer-events:none;");
		addStyleRule("textarea", "overflow: auto;");
	}

	try {
		addEventListener(document, "DOMContentLoaded", init);
		//init();
		setInterval(init, 200);

		if(addStyleRule){
			//textarea的滚动条可能和展位字符串重叠，干掉。Firefox和Chrome默认就是auto
			//IE 10+、Safari中placeholder在文本框focus时则消失，这与其他浏览器有差异，用css干掉其原生的placeholder功能
			forEach([":-ms-input-", "::-webkit-input-"], function(prefix){
				addStyleRule(prefix + strPlaceholder, "color:transparent !important;");
			});
		}
		supportDOMAttrModified = (function() {
			var root = document.documentElement,
				id = root.id;

			function fn() {
				root.removeEventListener(strDOMAttrModified, fn, false);
				supportDOMAttrModified = true;
			}

			root.addEventListener(strDOMAttrModified, fn, false);
			root.id = "mass";//更新属性
			root.id = id;//无论如何也还原它
			return supportDOMAttrModified;
		})();
	} catch(ex) {
	}

	h5form[strPlaceholder] = createHolder;

})(this, document);
