/* h5form v0.0.13
 * homepage: https://github.com/gucong3000/h5form
 */
!function(a,b,c){"use strict";var d=b.querySelector?b.documentMode:7,e=b.scripts||b.querySelector("script"),f="color:gray; opacity:1;",g="uniqueID"in b,h=b.documentElement.children[0],i=o("style"),j="placeholder",k,l,m=a.jQuery,n=a.JSON;function o(a){return a=b.createElement(a),h.insertBefore(a,h.firstChild),a}function p(b,c,d){a.addEventListener(b,c,d)}function q(a,c){var d=a+"{"+c+"}";if(i.styleSheet)try{i.styleSheet.addRule(a,c)}catch(e){i.styleSheet.cssText+=d}else i.appendChild(b.createTextNode(d))}function r(a,b){return b in a?a[b]:!!a.attributes[b]}function s(a){return a&&/^submit$/i.test(a.type)&&a.form&&!(r(a,"formNoValidate")||r(a.form,"noValidate"))}function t(a,b){b=b||"focus",a&&a[b]&&setTimeout(function(){a[b]()},0)}function u(a){return e?e.replace(/\.js/,a):void 0}e=e[e.length-1];try{k=e.innerHTML.replace(/[\s]+/g," "),k&&(k=m?m.parseJSON(k):n?n.parse(k):new Function("return "+k)()||{})}catch(v){}k=k||{},e=e.getAttribute("src",2);try{b.querySelector(":invalid"),l=!0}catch(v){}l?(p("invalid",function(a){a.cancelBubble||(a.preventDefault(),m&&(a.stopPropagation(),a.stopImmediatePropagation(),m(a.target).trigger("invalid")))},!0),d&&g?q(":-ms-input-"+j,"color:transparent !important;"):(setTimeout(function(){p("click",function(a){var b=a.target;a.defaultPrevented||1!==a.which||!s(b)||b.form.checkValidity()||(a.preventDefault(),t(b.form.querySelector(":invalid:not(:disabled)")))},!1)},200),q(("netscape"in a?"::-moz-":"::-webkit-input-")+j,f))):(m&&m.extend(m.expr[":"],{invalid:function(a){return a.validity&&!a.validity.valid},valid:function(a){return a.validity&&a.validity.valid}}),b.attachEvent("onclick",function(){var a=event,b=a.returnValue,d=a.srcElement,e=d.form,f,g,h,i;if((b||b===c)&&s(d)){for(i=0,g=e.elements;i<g.length;i++)h=g[i],h.validity&&!h.validity.valid&&(f||(f=!0,t(h)),t(h,"checkValidity"));f&&(a.returnValue=!f)}})),d&&(q(j,"position:absolute;cursor:text;color:gray;padding:0;border:0;overflow:hidden;-ms-user-select:none;user-select:none;pointer-events:none;"),9>d?(k.htc=k.htc||u(".htc"),k.htc&&q("form,input,select,textarea","behavior: url("+k.htc+");")):g&&(k.js=k.js||u(".el.js"),k.js&&(o("script").src=k.js)))}(this,document);