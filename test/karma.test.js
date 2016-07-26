/* global requirejs, __karma__*/
"use strict";
document.body.innerHTML = window.__html__["test/h5form.html"];

requirejs.config({
	paths: {
		"h5form.el": "/base/src/h5form.el",
		"h5form": "/base/src/h5form"
	}
});

requirejs(["h5form", "/base/test/h5form_test.js"], function(){
	__karma__.start();
});
