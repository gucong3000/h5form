/* h5form v0.2.4
 * homepage: http://gucong3000.github.io/h5form/
 */
!function(a){"use strict";window.jQuery?a(jQuery):window.seajs?seajs.use(["jquery"],a):a()}(function(a){"use strict";!function(b,c){var d=b.document,e=d.querySelector?d.documentMode:7,f=d.scripts||d.querySelector("script"),g=d.documentElement.children[0],h="uniqueID"in d,i=b.h5form||{},j=b.seajs,k,l;function m(a){return a=d.createElement(a),g.insertBefore(a,g.firstChild),a}function n(a,c,d){b.addEventListener(a,c,d)}function o(a,b){k||(k=m("style"));var c=a+"{"+b+"}";try{k.appendChild(d.createTextNode(c))}catch(e){try{k.styleSheet.addRule(a,b)}catch(e){k.styleSheet.cssText+=c}}}function p(a,b){return"boolean"==typeof a[b]?a[b]:!!a.attributes[b]}function q(a){return a&&/^submit$/i.test(a.type)&&a.form&&!(p(a,"formNoValidate")||p(a.form,"noValidate"))}function r(a,b){b=b||"focus",a&&a[b]&&setTimeout(function(){a[b]()},0)}function s(a){return f?f.replace(/[^\/]+$/,a):void 0}f=f[f.length-1];try{i=i||eval.call(b,f.innerHTML)||{}}catch(t){}f=f.getAttribute("src",2)||"";try{n("invalid",function(b){b.cancelBubble||(b.preventDefault(),a&&(b.stopPropagation(),b.stopImmediatePropagation(),a(b.target).trigger("invalid")))},!0),d.querySelector(":invalid"),l=!0}catch(t){}l?e&&h||setTimeout(function(){n("click",function(a){var b=a.target;a.defaultPrevented||1!==a.which||!q(b)||b.form.checkValidity()||(a.preventDefault(),r(b.form.querySelector(":invalid:not(:disabled)")))},!1)},10):(a&&!function(){function b(a){return!/^(?:input|select|textarea|button)$/i.test(a.nodeName)||a.validity&&a.willValidate||(console.log(a.outerHTML),console.log(a.validity),console.log(a.willValidate)),/^(?:input|select|textarea|button)$/i.test(a.nodeName)&&a.validity&&a.willValidate}function c(a){return/^form$/i.test(a.nodeName)}function d(a){return a.validity.valid}function e(c){var e=!0;return a.each(c.elements,function(a,c){b(c)&&(e&=d(c))}),e}a.extend(a.expr[":"],{invalid:function(a){return c(a)?!e(a):b(a)?!d(a):!1},valid:function(a){return c(a)?e(a):b(a)?d(a):!1}})}(),d.attachEvent("onclick",function(){var a=event,b=a.returnValue,d=a.srcElement,e=d.form,f,g,h,i;if((b||b===c)&&q(d)){for(i=0,g=e.elements;i<g.length;i++)h=g[i],h.validity&&!h.validity.valid&&(f||(f=!0,r(h)),r(h,"checkValidity"));f&&(a.returnValue=!f)}})),e&&(9>e?(i.htc=(j?j.data.dir+"h5form.htc":i.htc||s("h5form.htc")).replace(/^\w+:\/\/[^/]+/,""),i.htc&&o("form,input,select,textarea,button","behavior: url("+i.htc+");"),a&&8>e&&(a.holdReady(!0),a.ajax({url:i.htc,complete:function(){a.holdReady(!1)}}))):h&&(j?j.use(["h5form.el"]):(!b.ValidityState||/^\[.*\]$/.test(b.ValidityState))&&(i.js=i.js||s("h5form.el.js"),i.js&&(m("script").src=i.js))))}(window)});