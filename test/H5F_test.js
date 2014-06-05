(function() {
	var form = document.getElementById("fixture"),
	formElem = document.getElementById("other"),
	disabledElem = document.getElementById("disabled"),
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

	module("Validity API");

	test("Form element js attributes",
	function() {
		ok(formElem.validity, "validity 属性存在");

		ok(!formElem.validity.customError, "validity.customError 属性存在");
		ok(!formElem.validity.patternMismatch, "validity.patternMismatch 属性存在");
		ok(!formElem.validity.rangeOverflow, "validity.rangeOverflow 属性存在");
		ok(!formElem.validity.rangeUnderflow, "validity.rangeUnderflow 属性存在");
		ok(!formElem.validity.stepMismatch, "validity.stepMismatch 属性存在");
		ok(!formElem.validity.valueMissing, "validity.valueMissing 属性存在");
		ok(formElem.validity.valid, "validity.valid 属性存在");
		equal(formElem.checkValidity(), formElem.validity.valid, "checkValidity()返回结果与validity.valid一致" );
	});

	module("Checkboxes/radios");

	// Trigger form validation
//	form.checkValidity();


	test("have correct properties", function() {
		chkbox.checked = false;
		ok(chkbox.validity, "Checkbox has validity property");
		equal(chkbox.validity.valueMissing, true, "validity.valueMissing is true");
		equal(chkbox.validity.valid, false, "Checkbox is currently invalid");
	});

	test("checked vs unchecked state", function() {
		// Check the checkbox
		chkbox.checked = true;
		ok(chkbox.validity.valid, "Checkbox is valid");
	});

	radioFemale.checked = radioMale.checked = false;
	test("radio buttons	have correct properties", function() {
		ok(radioFemale.validity, "Female Radio button has validity propery");
		equal(radioFemale.validity.valid, false, "Female RadioButton is currently invalid ");
		ok(radioMale.validity, "Male Radio button has validity propery");
		equal(radioMale.validity.valid, false, "Female RadioButton is currently invalid ");
	});

	test("check validity of radio buttons if one option is checked", function() {
		ok(radioFemale.validity, "Female Radio button is valid");
		ok(radioMale.validity, "Male Radio button is valid when Female is checked");
	});

	module("Form validity");

	test("checkValidity method", function() {
		ok(form.checkValidity, "checkValidity method exists on parent form");

		ok(formElem.checkValidity, "checkValidity method exists on element");
	});

	test("disabled element", function() {
		equal(disabledElem.checkValidity(), true, "Disabled element should be exempt from validation");
		ok(disabledElem.disabled, "Disabled element should return true on disabled property");
		ok(disabledElem.validity.valid, "Disabled element should return true on disabled property even though it's invalid");
		ok(!disabledElem.validity.valueMissing, "Disabled element should be false on it's actual error if it weren't disabled");
	});

	module("Custom validation");

	test("setCustomValidity and validationMessage", function() {
		ok(!formElem.validity.customError, "customError attribute is false");
		equal(formElem.validationMessage, "", "validationMessage is empty");
		ok(formElem.setCustomValidity, "setCustomValidity method exists");
		formElem.setCustomValidity("Not valid for some reason");
		equal(formElem.validationMessage, "Not valid for some reason", "validationMessage is 'Not valid for some reason'");
		equal(formElem.validity.customError, true, "formElem.validity.customError equal true");
		equal(formElem.checkValidity(), false, "formElem.checkValidity() equal false");
		
		formElem.setCustomValidity("");
	});

	module("Input type email and URL");

	function testEmail(address) {
		var ret;

		email.value = address;
		ret = email.validity.typeMismatch;
		email.value = "";

		return !! ret;
	}
	test("Email", function() {
		try {
			if(!/^email$/i.test(email.getAttribute("type", 2))){
				//用IE10或以上的IE9模式，会有bug，详见http://www.zhangxinxu.com/wordpress/?p=2844
				email.type = "email";
			}
		} catch(ex) {
			return;
		}
		// A valid email varies between browsers FF4 and Opera: ry@an is valid, where as Chrome requires atleast ry@an.c
		equal(testEmail("notvalidemail"), true, "Setting email value to 'notvalidemail' is invalid");
		equal(testEmail("ryan@awesome.com"), false, "Setting email value to h5f@awesome.com is valid");
	});

	function testURL(address) {
		var ret;

		url.value = address;
		ret = url.checkValidity();
		url.value = "";

		return !! ret;
	}
	test("URL", function() {
		try {
			if(!/^url$/i.test(url.getAttribute("type", 2))){
				//用IE10或以上的IE9模式，会有bug，详见http://www.zhangxinxu.com/wordpress/?p=2844
				url.type = "url";
			}
		} catch(ex) {
			return;
		}
		equal(testURL("example.com"), false, "Setting URL value to example.com is invalid");
		equal(testURL("http://example.com"), true, "Setting URL value to http://example.com is valid");
	});

	module("Field attributes");

	function testPattern(val) {
		var ret;

		nickname.value = val;
		ret = nickname.checkValidity();
		nickname.value = "";

		return !! ret;
	}
	test("pattern", function() {
		equal(testPattern("ry"), false, "Nickname field has pattern that requires atleast 4 alphanumeric characters, only set two");
		equal(testPattern("ryan"), true, "Set four characters on nickname field, will be valid");
	});

	test("min, max and step", function() {
		try {
			if(!/^number$/i.test(postcode.getAttribute("type", 2))){
				//用IE10或以上的IE9模式，会有bug，详见http://www.zhangxinxu.com/wordpress/?p=2844
				postcode.type = "number";
			}
		} catch(ex) {
			return;
		}
		postcode.value = "1000";
		ok(postcode.validity.rangeUnderflow, "Value of 1000 is below min attribute, 1001, and will be invalid");
		postcode.value = "8001";
		ok(postcode.validity.rangeOverflow, "Value of 8001 is above max attribute, 8000, and will be invalid");
		postcode.value = "1002";
		ok(postcode.validity.stepMismatch, "Value is within range but does not increment by specified step attribute of 2");
		postcode.value = "1003";
		ok(!postcode.validity.stepMismatch, "Value is within range and adheres to the step attribute of incements of 2");
		postcode.value = "";
	});

	test("formNoValidate, noValidate", function() {
		equal(form.noValidate, false, "form.noValidate的值初始为false");
		equal(form.checkValidity(), false, "form.checkValidity()的返回值为false");
		equal(input_submit.formNoValidate, false, "<input type=\"submit\">的formNoValidate值为false");
		equal(input_submit_novalidate.formNoValidate, true, "<input type=\"submit\" formnovalidate>的formNoValidate值为true");
	});

	module("Select");

	test("required", function() {
		select.selectedIndex = 0;
		equal(select.validity.valid, false, "Select is currently invalid");
	});


})();