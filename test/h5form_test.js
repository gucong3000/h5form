(function(window, factory) {
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", factory, false);
	} else if (window.$) {
		$(factory);
	} else {
		window.onload = factory;
	}

})(this, function() {
	var form = document.getElementById("fixture") || document.getElementById("qunit-fixture"),
		formElem = document.getElementById("other"),
		disabledElem = document.getElementById("disabled"),
		readonlyElem = document.getElementById("readonly"),
		email = document.getElementById("email"),
		url = document.getElementById("url"),
		postcode = document.getElementById("postcode"),
		chkbox = document.getElementById("chkbox"),
		nickname = document.getElementById("nickname"),
		radioFemale = document.getElementById("female"),
		radioMale = document.getElementById("male"),
		select = document.getElementById("select"),
		input_submit = document.getElementById("input_submit"),
		input_submit_novalidate = document.getElementById("input_submit_novalidate"),
		button_submit_novalidate = document.getElementById("button_submit_novalidate");

	if (window.HTMLInputElement && (!document.documentMode || document.documentMode > 8)) {

		QUnit.module("检测Dom");
		QUnit.test("input对象", function() {
			var tester = document.createElement("input");
			["checkValidity", "setCustomValidity", "autofocus", "formNoValidate", "max", "min", "pattern", "placeholder", "required", "step", "validationMessage", "validity", "willValidate"].forEach(function(prop) {
				QUnit.ok(prop in tester, "检测input是否拥有" + prop);
			});
		});
		QUnit.test("textarea对象", function() {
			var tester = document.createElement("textarea");
			["checkValidity", "setCustomValidity", "autofocus", "placeholder", "required", "validationMessage", "validity", "willValidate"].forEach(function(prop) {
				QUnit.ok(prop in tester, "检测textarea是否拥有" + prop);
			});
		});
	}

	QUnit.module("Validity API");

	QUnit.test("Form element js attributes", function() {
		QUnit.ok(formElem.validity, "validity 属性存在");

		QUnit.ok(!formElem.validity.customError, "validity.customError 属性存在");
		QUnit.ok(!formElem.validity.patternMismatch, "validity.patternMismatch 属性存在");
		QUnit.ok(!formElem.validity.rangeOverflow, "validity.rangeOverflow 属性存在");
		QUnit.ok(!formElem.validity.rangeUnderflow, "validity.rangeUnderflow 属性存在");
		QUnit.ok(!formElem.validity.stepMismatch, "validity.stepMismatch 属性存在");
		QUnit.ok(!formElem.validity.valueMissing, "validity.valueMissing 属性存在");
		QUnit.ok(formElem.validity.valid, "validity.valid 属性存在");
		QUnit.equal(formElem.checkValidity(), formElem.validity.valid, "checkValidity()返回结果与validity.valid一致");
	});

	QUnit.module("Checkboxes/radios");

	// Trigger form validation
	//	form.checkValidity();


	QUnit.test("have correct properties", function() {
		chkbox.checked = false;

		//Firefox下由于qunit把form清空导致ff测试不通过
		if (!chkbox.form) {
			form.appendChild(chkbox);
		}
		QUnit.ok(chkbox.validity, "Checkbox has validity property");
		QUnit.equal(chkbox.validity.valueMissing, true, "validity.valueMissing is true");
		QUnit.equal(chkbox.validity.valid, false, "Checkbox is currently invalid");
	});

	QUnit.test("checked vs unchecked state", function() {
		// Check the checkbox
		chkbox.checked = true;
		QUnit.ok(chkbox.validity.valid, "Checkbox is valid");
	});

	QUnit.test("radio buttons	have correct properties", function() {
		radioFemale.checked = radioMale.checked = false;

		//Firefox下由于qunit把form清空导致ff测试不通过
		if (!radioFemale.form) {
			form.appendChild(radioFemale);
		}
		if (!radioMale.form) {
			form.appendChild(radioMale);
		}
		QUnit.ok(radioFemale.validity, "Female Radio button has validity propery");
		QUnit.equal(radioFemale.validity.valid, false, "Female RadioButton is currently invalid ");
		QUnit.ok(radioMale.validity, "Male Radio button has validity propery");
		QUnit.equal(radioMale.validity.valid, false, "Female RadioButton is currently invalid ");
	});

	QUnit.test("check validity of radio buttons if one option is checked", function() {
		QUnit.ok(radioFemale.validity, "Female Radio button is valid");
		QUnit.ok(radioMale.validity, "Male Radio button is valid when Female is checked");
	});

	QUnit.module("Form validity");

	QUnit.test("checkValidity method", function() {
		QUnit.ok(form.checkValidity, "checkValidity method exists on parent form");

		QUnit.ok(formElem.checkValidity, "checkValidity method exists on element");
	});

	QUnit.test("disabled element", function() {
		QUnit.equal(disabledElem.checkValidity(), true, "Disabled element should be exempt from validation");
		QUnit.ok(disabledElem.disabled, "Disabled element should return true on disabled property");
		QUnit.ok(disabledElem.validity.valid, "Disabled element should return true on disabled property even though it's invalid");
		QUnit.ok(!disabledElem.validity.valueMissing, "Disabled element should be false on it's actual error if it weren't disabled");
	});

	QUnit.test("readonly element", function() {
		QUnit.equal(readonlyElem.checkValidity(), true, "readOnly element should be exempt from validation");
		QUnit.ok(readonlyElem.readOnly, "readOnly element should return true on readonly property");
		QUnit.ok(readonlyElem.validity.valid, "readOnly element should return true on readonly property even though it's invalid");
		QUnit.ok(!readonlyElem.validity.valueMissing, "readOnly element should be false on it's actual error if it weren't readonly");
	});

	QUnit.module("Custom validation");

	QUnit.test("setCustomValidity and validationMessage", function() {
		QUnit.ok(!formElem.validity.customError, "customError attribute is false");
		QUnit.equal(formElem.validationMessage, "", "validationMessage is empty");
		QUnit.ok(formElem.setCustomValidity, "setCustomValidity method exists");
		formElem.setCustomValidity("Not valid for some reason");
		QUnit.equal(formElem.validationMessage, "Not valid for some reason", "validationMessage is 'Not valid for some reason'");
		QUnit.equal(formElem.validity.customError, true, "formElem.validity.customError equal true");
		QUnit.equal(formElem.checkValidity(), false, "formElem.checkValidity() equal false");

		formElem.setCustomValidity("");
	});

	QUnit.module("Input type email and URL");

	function testEmail(address) {
		var ret;

		email.value = address;
		ret = email.validity.typeMismatch;
		email.value = "";

		return !!ret;
	}
	QUnit.test("Email", function() {
		try {
			if (!/^email$/i.test(email.getAttribute("type", 2))) {
				//用IE10或以上的IE9模式，会有bug，详见http://www.zhangxinxu.com/wordpress/?p=2844
				email.type = "email";
			}
		} catch (ex) {
			return;
		}
		// A valid email varies between browsers FF4 and Opera: ry@an is valid, where as Chrome requires atleast ry@an.c
		QUnit.equal(testEmail("notvalidemail"), true, "Setting email value to 'notvalidemail' is invalid");
		QUnit.equal(testEmail("ryan@awesome.com"), false, "Setting email value to h5f@awesome.com is valid");
	});

	function testURL(address) {
		var ret;

		url.value = address;
		ret = url.checkValidity();
		url.value = "";

		return !!ret;
	}
	QUnit.test("URL", function() {
		try {
			if (!/^url$/i.test(url.getAttribute("type", 2))) {
				//用IE10或以上的IE9模式，会有bug，详见http://www.zhangxinxu.com/wordpress/?p=2844
				url.type = "url";
			}
		} catch (ex) {
			return;
		}
		QUnit.equal(testURL("example.com"), false, "Setting URL value to example.com is invalid");
		QUnit.equal(testURL("http://example.com"), true, "Setting URL value to http://example.com is valid");
	});

	QUnit.module("Field attributes");

	function testPattern(val) {
		var ret;

		nickname.value = val;
		ret = nickname.checkValidity();
		nickname.value = "";

		return !!ret;
	}
	QUnit.test("pattern", function() {
		QUnit.equal(testPattern("ry"), false, "Nickname field has pattern that requires atleast 4 alphanumeric characters, only set two");
		QUnit.equal(testPattern("ryan"), true, "Set four characters on nickname field, will be valid");
	});

	QUnit.test("min, max and step", function() {
		try {
			if (!/^number$/i.test(postcode.getAttribute("type", 2))) {
				//用IE10或以上的IE9模式，会有bug，详见http://www.zhangxinxu.com/wordpress/?p=2844
				postcode.type = "number";
			}
		} catch (ex) {
			return;
		}
		postcode.value = "1000";
		QUnit.ok(postcode.validity.rangeUnderflow, "Value of 1000 is below min attribute, 1001, and will be invalid");
		postcode.value = "8001";
		QUnit.ok(postcode.validity.rangeOverflow, "Value of 8001 is above max attribute, 8000, and will be invalid");
		postcode.value = "1002";
		QUnit.ok(postcode.validity.stepMismatch, "Value is within range but does not increment by specified step attribute of 2");
		postcode.value = "1003";
		QUnit.ok(!postcode.validity.stepMismatch, "Value is within range and adheres to the step attribute of incements of 2");
		postcode.value = "";
	});

	QUnit.test("formNoValidate, noValidate", function() {
		QUnit.equal(form.noValidate, false, "form.noValidate的值初始为false");
		QUnit.equal(form.checkValidity(), false, "form.checkValidity()的返回值为false");
		QUnit.equal(input_submit.formNoValidate, false, "<input type=\"submit\">的formNoValidate值为false");
		QUnit.equal(input_submit_novalidate.formNoValidate, true, "<input type=\"submit\" formnovalidate>的formNoValidate值为true");
	});

	QUnit.module("Select");

	QUnit.test("required", function() {
		select.selectedIndex = 0;
		QUnit.equal(select.validity.valid, false, "Select is currently invalid");
	});


});