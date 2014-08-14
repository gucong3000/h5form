(function(window, factory) {
	if (window.$) {
		$(factory);
	} else {
		window.onload = factory;
	}

})(this, function() {

	QUnit.module("检查提交按钮");


	QUnit.test("input_submit_novalidate", function() {

		QUnit.expect(2);
		var btnName

		$("form").submit(function(event) {
			QUnit.ok(true, "点击" + btnName + "按钮应该提交表单");
			return false;
		});

		btnName = "#input_submit_novalidate";
		$("#input_submit_novalidate").click();

		btnName = "#button_submit_novalidate";
		$("#button_submit_novalidate").click();

		$("form").off("submit");
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
		invalidCont = 0;
		$("input").on("invalid", function(e){
			invalidCont++;
		});
		$("form")[0].checkValidity();
		QUnit.equal(invalidCont, $("form input:invalid").length, invalidCont + "个元素发生了invalid事件");
	});

});