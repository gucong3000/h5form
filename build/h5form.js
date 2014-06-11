/*! h5form v0.0.2*/
!function(a,b){"use strict";var c=b.querySelector?b.documentMode:7,d=b.scripts||b.querySelector("script"),e="color:gray; opacity:1;",f="uniqueID"in b,g=b.documentElement.firstChild,h=n("style"),i="placeholder",j,k,l=a.jQuery,m=a.JSON;function n(a){return a=b.createElement(a),g.insertBefore(a,g.firstChild),a}function o(b,c,d){a.addEventListener(b,c,d)}function p(a,c){h.styleSheet?h.styleSheet.addRule(a,c):h.appendChild(b.createTextNode(a+"{"+c+"}"))}function q(a,c){c="behavior: url("+c+");";try{p(a,c)}catch(d){b.writeln("<style>"+a+"{"+c+"}</style>")}}function r(a,b){return b in a?a[b]:!!a.attributes[b]}function s(a){return a&&/^submit$/i.test(a.type)&&a.form&&!(r(a,"formNoValidate")||r(a.form,"noValidate"))}function t(a){return d.replace(/\.js/,a)}l&&l.extend(l.expr[":"],{invalid:function(a){return a.validity&&!a.validity.valid},valid:function(a){return a.validity&&a.validity.valid}}),d=d[d.length-1];try{j=d.innerHTML.replace(/[\r\n\t\s]+/g," "),j=l?l.parseJSON(j):m?m.parse(j):new Function("return "+j)()||{}}catch(u){}j=j||{},d=d.getAttribute("src",2);try{b.querySelector(":invalid"),k=!0}catch(u){}k?(o("invalid",function(a){a.cancelBubble||(a.preventDefault(),l&&(a.stopPropagation(),a.stopImmediatePropagation(),l(a.target).trigger("invalid")))},!0),c&&f?p(":-ms-input-"+i,"color:transparent !important;"):(setTimeout(function(){o("click",function(a){var b=a.target;a.defaultPrevented||!s(b)||b.form.checkValidity()||(a.preventDefault(),b=b.form.querySelector(":invalid:not(:disabled)"),b&&b.focus())},!1)},200),p(("netscape"in a?"::-moz-":"::-webkit-input-")+i,e))):b.attachEvent("onclick",function(){var a=event,b=a.srcElement,c=b.form,d,e,f,g;if(a.returnValue&&s(b)){for(g=0,e=c.elements;g<e.length;g++)f=e[g],f.checkValidity&&!f.checkValidity()&&(d||(d=!0,f.focus()));d&&(a.returnValue=!d)}}),c&&(p(i,"position:absolute;cursor:text;color:gray;padding:0;border:0;overflow:hidden;-ms-user-select:none;user-select:none;pointer-events:none;"),9>c?q("form,input,select,textarea",j.htc||t(".htc")):f&&(n("script").src=j.js||t(".el.js")))}(this,document);