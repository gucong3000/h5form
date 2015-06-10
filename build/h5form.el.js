/* h5form v0.2.5
 * homepage: http://gucong3000.github.io/h5form/
 */
!function(a,b){"use strict";var c="DOMContentLoaded",d="input",e="prototype",f=w(HTMLFormElement),g=b.documentMode,h=!g||b.documentMode>8,i=a.setTimeout,j=a.parseFloat,k={email:/^[a-zA-Z0-9.!#$%&'*+-\/=?\^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,number:/^[+-]?\d+(\.\d+)?$/,url:/[a-z][\-\.+a-z]*:\/\//i,color:/#[\da-f]{6}/i},l={email:"请输入电子邮件地址。",number:"请输入一个数字。",color:"请输入一个颜色值",url:"请输入一个URL。"},m=a.jQuery,n={},o={},p={},q;try{b.querySelector(":invalid"),q=!0}catch(r){}function s(){}s[e]={patternMismatch:!1,rangeUnderflow:!1,rangeOverflow:!1,stepMismatch:!1,typeMismatch:!1,valueMissing:!1,customError:!1,tooLong:!1,valid:!0};function t(a){return b.createElement(a)}function u(a,b,c){c.enumerable=h,Object.defineProperty(a,b,c)}function v(a,b){for(var c in b)u(a,c,{get:b[c]})}function w(a){return a[e]||a}function x(a){return(a.getAttribute("type",2)||a.type).toLowerCase()}function y(a,b){return q||(a=w(a),B(b,function(c){c in a||u(a,c,b[c]?{get:function(){return this.getAttribute(c,2)||""},set:function(a){this.setAttribute(c,a)}}:{get:function(){return!!this.attributes[c]},set:function(a){a?this.setAttribute(c,c):this.removeAttribute(c)}})})),a}function z(a){var b=j(a.value),c=j(a.step),d=(b-j(a.min)||j(a.max)-b)%c,e=b-d,f=e+c;return"值应该为 "+e+" 或 "+f}function A(a){a=y(a,{required:0,pattern:1}),v(a,{validity:function(){var a=this,c=n[a.uniqueID],d;function e(){return a.willValidate}function f(){return e()&&!!a.value}function g(){return x(a)}function h(){return f()&&/^number|range$/i.test(g())}if(!c){c=new s,d={patternMismatch:function(){return f()&&!!a.pattern&&!new RegExp("^(?:"+a.pattern+")$").test(a.value)},rangeUnderflow:function(){return h()&&j(a.value)<j(a.min)},rangeOverflow:function(){return h()&&j(a.value)>j(a.max)},stepMismatch:function(){return h()&&a.step&&(j(a.value)-j(a.min)||j(a.max)-j(a.value))%j(a.step)!==0},typeMismatch:function(){var b=k[g()];return f()&&b&&!b.test(a.value)},valueMissing:function(){return e()&&a.required&&!(/^checkbox$/i.test(a.type)?a.checked:/^radio$/i.test(a.type)?(a.form||b).querySelector("[name='"+a.name+"']:checked"):a.value)},customError:function(){return!!o[a.uniqueID]},badInput:function(){return!1},tooLong:function(){a.value&&a.value.length>a.maxLength},valid:function(){var b=a.validity;return!(b.tooLong||b.customError||b.valueMissing||b.patternMismatch||b.typeMismatch||b.rangeOverflow||b.rangeUnderflow||b.stepMismatch)}};try{v(c,d)}catch(i){c=t("ValidityState"),v(c,d)}n[a.uniqueID]=c}return c},willValidate:function(){var a=this;return!(a.disabled||/^input$/i.test(a.nodeName)&&/^hidden$/i.test(a.type))},validationMessage:function(){var a=this.validity;return o[this.uniqueID]||(a.valueMissing?"请填写此字段。":a.patternMismatch?"请匹配要求的格式。":a.typeMismatch?l[x(this)]:a.rangeOverflow?"值必须小于或等于 "+this.max:a.rangeUnderflow?"值必须大于或等于 "+this.min:a.stepMismatch?z(this):"")},setCustomValidity:function(){var a=this.uniqueID;return function(b){o[a]=b}}}),v(a,{checkValidity:function(){var a=this;return function(){var b=a.validity.valid;return b||E(a,"invalid"),b}}})}function B(a,b){if(a){var c;if("length"in a){for(c=0;c<a.length;c++)if(b(a[c])===!1)return}else for(c in a)if(b(c)===!1)return}}function C(a,c){B(b.querySelectorAll(a),c)}function D(b,e,f,g){h?b.addEventListener(e,f,!!g):c===e?m?m(f):a.attachEvent("load",f):m&&e===d?m(b).bind(e+".h5form",f):b.attachEvent("on"+e,function(){var a={},c=event;a.target=c.srcElement,a.defaultPrevented=c.returnValue===!1,a.preventDefault=function(){a.defaultPrevented=!0,c.returnValue=!1},f.call(b,a)})}function E(a,c,d){if(b.createEvent){var e=b.createEvent("HTMLEvents");e.initEvent(c,!!d,!0),a.dispatchEvent(e)}else m&&m(a).trigger(c)}function F(a){var c=a?a.target:b.activeElement;(G(c)||I(c))&&i(function(){p[c.uniqueID]!==H(c)&&E(c,d,!0)},0)}function G(a){return a.contentEditable}function H(a){return G(a)?a.innerHTML:a.value}function I(a){return/^text(area)?|password|email|search|tel|url$/i.test(a.type)}function J(){i(function(){q?D(a,"click",function(a){var b=a.target,c=b.form;!a.defaultPrevented&&1===a.which&&b&&c&&/^submit$/i.test(b.type)&&!b.formNoValidate&&!c.noValidate&&(c.checkValidity()?m?m(c).submit():c.submit():(a.preventDefault(),B(c.elements,function(a){return a.validity&&!a.validity.valid&&a.focus?(a.focus(),!1):void 0})))}):C("[autofocus]",function(a){return a.focus(),!1})},250),h&&b.removeEventListener(c,J,!1)}B([d,"focusin"],function(b){D(a,b,function(a){var b=a.target;p[b.uniqueID]=H(b)},!0)}),B("change cut keypress focusout propertychange".split(/\s/),function(b){D(a,b,F,!0)}),h&&setInterval(F,200),q||(y(f,{noValidate:0}),y(HTMLButtonElement,{formNoValidate:0}),y(HTMLInputElement,{formNoValidate:0,placeholder:1,step:1,max:1,min:1}),y(HTMLTextAreaElement,{placeholder:1})),a.ValidityState=s,v(f,{checkValidity:function(){var a=this;return function(){var b=!0,c=a.elements,d,e;for(e=0;e<c.length;e++)d=c[e],d.checkValidity&&!d.disabled&&(b&=d.checkValidity());return b}}}),A(HTMLTextAreaElement),A(HTMLSelectElement),A(HTMLButtonElement),A(HTMLInputElement),/^interactive|complete$/.test(b.readyState)?J():D(b,c,J)}(this,document);