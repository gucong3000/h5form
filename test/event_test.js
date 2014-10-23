(function(window, factory) {
	if (window.$) {
		$(factory);
	} else {
		window.onload = factory;
	}

})(this, function() {

	QUnit.module("检查提交按钮");


	QUnit.test("应该提交表单的情形", function() {

		QUnit.expect(3);
		var msg;

		$("form").submit(function(event) {
			QUnit.ok(true, msg + "按钮应该提交表单");
			return false;
		});

		msg = "点击#input_submit_novalidate";
		$("#input_submit_novalidate").click();

		msg = "点击#button_submit_novalidate";
		$("#button_submit_novalidate").click();

		msg = "调用submit()方法";

		$("form").submit().off("submit");
	});


	QUnit.test("普通submit按钮", function() {

		var submited;

		$("form").submit(function(event) {
			submited = true;
			return false;
		});

		$("#input_submit").click();

		QUnit.ok(!submited, "点击普通submit按钮不该提交表单");

		$("form").off("submit");
	});

	QUnit.module("检查事件支持");

	QUnit.test("invalid事件", function() {
		var invalidCont = 0;
		$("input").on("invalid", function(e) {
			invalidCont++;
		});
		$("form")[0].checkValidity();
		QUnit.equal(invalidCont, $("form input:invalid").length, invalidCont + "个元素发生了invalid事件");
	});

	QUnit.test("input", function() {
		invalidCont = 0;
		$("input").on("invalid", function(e) {
			invalidCont++;
		});
		$("form")[0].checkValidity();
		QUnit.equal(invalidCont, $("form input:invalid").length, invalidCont + "个元素发生了invalid事件");
	});

	if(window.console && !/\s+PhantomJS\/\d/.test(navigator.userAgent)){
		console.log("需要测试oninput事件，请在文本框中输入内容。(支持中文输入)");
		$(document).on("input", function(e) {
			console.log(e.target);
		});
	}
});