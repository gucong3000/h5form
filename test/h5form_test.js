/* global describe, it, expect, beforeEach, afterEach */
"use strict";
(function() {
	var $ = window.jQuery;
	var documentMode = document.documentMode;
	var rv = (function() {
		// 微软的JScript语言独有的条件注释语句,！！！勿删！！！返回js引擎的版本号
		/*@cc_on return @_jscript_version;@*/
		return documentMode;
	})();

	if (rv) {
		if (!documentMode) {
			var compatMode = document.compatMode;
			if (!document.compatMode) {
				rv = 5;
			} else if (!("XMLHttpRequest" in window)) {
				rv = 6;
			} else {
				rv = 7;
			}
			documentMode = compatMode === "CSS1Compat" ? rv : 5;
		} else if (rv < 9) {
			rv = 8;
		}
	}
	var form,
		formField,
		disabledElem,
		readonlyElem,
		email,
		url,
		postcode,
		chkbox,
		nickname,
		radioFemale,
		radioMale,
		select,
		input_submit,
		input_submit_novalidate,
		button_submit_novalidate;
	beforeEach(function(done) {
		form = document.getElementById("fixture") || document.getElementById("qunit-fixture");
		formField = document.getElementById("other");
		disabledElem = document.getElementById("disabled");
		readonlyElem = document.getElementById("readonly");
		email = document.getElementById("email");
		url = document.getElementById("url");
		postcode = document.getElementById("postcode");
		chkbox = document.getElementById("chkbox");
		nickname = document.getElementById("nickname");
		radioFemale = document.getElementById("female");
		radioMale = document.getElementById("male");
		select = document.getElementById("select");
		input_submit = document.getElementById("input_submit");
		input_submit_novalidate = document.getElementById("input_submit_novalidate");
		button_submit_novalidate = document.getElementById("button_submit_novalidate");

		function loaded() {
			if (window.ValidityState) {
				done();
			} else {
				setTimeout(loaded, 50);
			}
		}
		loaded();
	}, 3000);


	function forEach(array, callback) {
		if (array.forEach) {
			array.forEach(callback);
		} else {
			for (var i = 0; i < array.length; i++) {
				callback(array[i]);
			}
		}
	}

	if (window.HTMLInputElement && (!document.documentMode || document.documentMode > 8)) {
		describe("check DOM", function() {
			describe("input", function() {
				var input = document.createElement("input");
				["checkValidity", "setCustomValidity", "autofocus", "formNoValidate", "max", "min", "pattern", "placeholder", "required", "step", "validationMessage", "validity", "willValidate"].forEach(function(prop) {
					it(prop, function() {
						expect(input[prop]).toBeDefined();
					});
				});
			});
			describe("textarea", function() {
				var textarea = document.createElement("textarea");
				["checkValidity", "setCustomValidity", "autofocus", "placeholder", "required", "validationMessage", "validity", "willValidate"].forEach(function(prop) {
					it(prop, function() {
						expect(textarea[prop]).toBeDefined();
					});
				});
			});
		});
	}

	describe("formField", function() {
		it(".validity", function() {
			expect(formField.validity).toBeDefined();
		});
		forEach(["customError", "patternMismatch", "rangeOverflow", "rangeUnderflow", "stepMismatch", "valueMissing", "valid"], function(prop) {
			it("validity." + prop, function() {
				expect(formField.validity[prop]).toBeDefined();
			});
		});
	});

	describe("Checkboxes/radios", function() {
		it("validity", function() {
			chkbox.checked = false;

			//Firefox下由于qunit把form清空导致ff测试不通过
			if (!chkbox.form) {
				form.appendChild(chkbox);
			}
			expect(chkbox.validity).toBeDefined();
			expect(chkbox.validity.valueMissing).toBe(true);
			expect(chkbox.validity.valid).toBe(false);
		});
	});

	describe("radio button", function() {
		it("radioFemale.validity", function() {
			radioFemale.checked = false;
			radioMale.checked = false;

			//Firefox下由于qunit把form清空导致ff测试不通过
			if (!radioFemale.form) {
				form.appendChild(radioFemale);
			}
			if (!radioMale.form) {
				form.appendChild(radioMale);
			}
			expect(radioFemale.validity).toBeDefined();
			expect(radioFemale.validity.valid).toBe(false);
			expect(radioMale.validity).toBeDefined();
			expect(radioMale.validity.valid).toBe(false);
		});
	});

	describe("checkValidity method", function() {
		it("form", function() {
			expect(form.checkValidity).toBeDefined();
		});
		it("formField", function() {
			expect(formField.checkValidity).toBeDefined();
		});
	});

	if (!documentMode || documentMode < 10) {
		describe("property disabled", function() {

			it("disabled", function() {
				expect(disabledElem.disabled).toBe(true);
			});
			it("checkValidity()", function() {
				expect(disabledElem.checkValidity()).toBe(true);
			});

			it("validity", function() {
				expect(disabledElem.validity.valid).toBe(true);
				expect(disabledElem.validity.valueMissing).toBe(false);
			});
		});

		describe("property readonly", function() {
			it("readOnly", function() {
				expect(readonlyElem.readOnly).toBe(true);
			});
			it("checkValidity()", function() {
				expect(readonlyElem.checkValidity()).toBe(true);
			});
			it("validity", function() {
				expect(readonlyElem.validity.valid).toBe(true);
				expect(readonlyElem.validity.valueMissing).toBe(false);
			});
		});
	}

	describe("customError", function() {
		it("uninit", function() {
			expect(formField.validationMessage).toBe("");
			expect(formField.validationMessage).toBe("");
		});

		it("setCustomValidity(\"Not valid for some reason\")", function() {
			formField.setCustomValidity("Not valid for some reason");
			expect(formField.validationMessage).toBe("Not valid for some reason");
			expect(formField.validity.customError).toBe(true);
			expect(formField.checkValidity()).toBe(false);
		});

		it("setCustomValidity(\"\")", function() {
			formField.setCustomValidity("");
			expect(formField.validationMessage).toBe("");
			expect(formField.validity.customError).toBe(false);
			expect(formField.checkValidity()).toBe(true);
		});
	});

	describe("Email", function() {
		try {
			if (!/^email$/i.test(email.getAttribute("type", 2))) {
				//用IE10或以上的IE9模式，会有bug，详见http://www.zhangxinxu.com/wordpress/?p=2844
				email.type = "email";
			}
		} catch (ex) {
			return;
		}

		it("validity.typeMismatch", function() {
			email.value = "notvalidemail";
			expect(email.validity.typeMismatch).toBe(true);
			expect(email.validity.valueMissing).toBe(false);
			expect(email.validity.valid).toBe(false);
			email.value = "ryan@awesome.com";
			expect(email.validity.typeMismatch).toBe(false);
			expect(email.validity.valueMissing).toBe(false);
			expect(email.validity.valid).toBe(true);
			email.value = "";
			expect(email.validity.typeMismatch).toBe(false);
			expect(email.validity.valueMissing).toBe(email.required);
		});
	});

	describe("URL", function() {
		try {
			if (!/^url$/i.test(url.getAttribute("type", 2))) {
				//用IE10或以上的IE9模式，会有bug，详见http://www.zhangxinxu.com/wordpress/?p=2844
				url.type = "url";
			}
		} catch (ex) {
			return;
		}

		it("validity.typeMismatch", function() {
			url.value = "example.com";
			expect(url.validity.typeMismatch).toBe(true);
			expect(url.validity.valueMissing).toBe(false);
			expect(url.validity.valid).toBe(false);
			url.value = "http://example.com";
			expect(url.validity.typeMismatch).toBe(false);
			expect(url.validity.valueMissing).toBe(false);
			expect(url.validity.valid).toBe(true);
			url.value = "";
			expect(url.validity.typeMismatch).toBe(false);
			expect(url.validity.valueMissing).toBe(url.required);
		});
	});

	describe("property pattern", function() {
		it("toBeDefined", function() {
			expect(nickname.pattern).toBeDefined();
		});
		it("validity.patternMismatch", function() {
			nickname.value = "ry";
			expect(nickname.validity.patternMismatch).toBe(true);
			expect(nickname.validity.valueMissing).toBe(false);
			nickname.value = "ryan";
			expect(nickname.validity.patternMismatch).toBe(false);
			expect(nickname.validity.valueMissing).toBe(false);
			nickname.value = "";
			expect(nickname.validity.patternMismatch).toBe(false);
			expect(nickname.validity.valueMissing).toBe(nickname.required);
		});
	});

	describe("[type=\"number\"]", function() {
		try {
			if (!/^number$/i.test(postcode.getAttribute("type", 2))) {
				//用IE10或以上的IE9模式，会有bug，详见http://www.zhangxinxu.com/wordpress/?p=2844
				postcode.type = "number";
			}
		} catch (ex) {
			return;
		}
		it("validity.rangeUnderflow", function() {
			postcode.value = "1000";
			expect(postcode.validity.rangeUnderflow).toBe(true);
		});
		it("validity.rangeOverflow", function() {
			postcode.value = "8001";
			expect(postcode.validity.rangeOverflow).toBe(true);
		});
		it("validity.stepMismatch", function() {
			postcode.value = "1002";
			expect(postcode.validity.stepMismatch).toBe(true);
		});
		it("validity.stepMismatch", function() {
			postcode.value = "1003";
			expect(postcode.validity.stepMismatch).toBe(false);
		});
	});

	describe("property noValidate", function() {
		it("form", function() {
			expect(form.noValidate).toBe(false);
			expect(form.checkValidity()).toBe(false);
		});
	});
	describe("property formNoValidate", function() {
		it("input", function() {
			expect(input_submit.formNoValidate).toBe(false);
			expect(input_submit_novalidate.formNoValidate).toBe(true);
		});
		it("button", function() {
			expect(button_submit_novalidate.formNoValidate).toBe(true);
		});
	});

	describe("required", function() {
		it("select", function() {
			select.selectedIndex = 0;
			expect(select.validity.valid).toBe(false);
			expect(select.validity.valueMissing).toBe(true);
		});
	});

	describe("submit事件触发情况", function() {
		var submited;

		it("点击#input_submit_novalidate按钮应该提交表单", function() {
			$("#input_submit_novalidate").click();
			expect(submited).toBe(true);
		});

		it("点击#button_submit_novalidate按钮应该提交表单", function() {
			$("#button_submit_novalidate").click();
			expect(submited).toBe(true);
		});

		it("调用submit()方法按钮应该提交表单", function() {
			$("form").submit();
			expect(submited).toBe(true);
		});

		it("点击普通submit按钮不该提交表单", function() {
			$("#input_submit").click();
			expect(submited).toBe(false);
		});

		beforeEach(function() {
			submited = false;
			$("form").submit(function() {
				submited = true;
				return false;
			});
		});

		afterEach(function() {
			$("form").off("submit");
		});
	});

	describe("invalid事件触发情况", function() {
		it(function() {
			var invalidCont = 0;
			$(":input").on("invalid", function() {
				invalidCont++;
			});
			$("form")[0].checkValidity();
			expect(invalidCont).toBe($("form :input:invalid").length);
		});
	});

	if (window.HTMLInputElement && !document.documentMode && !/\bPhantomJS\b/.test(navigator.userAgent)) {
		describe("check autofocus", function() {
			it("activeElement", function(done) {
				function loaded() {
					var activeElement = window.focusElement || document.activeElement;
					// <input id="autofocus" type="text" onfocus="window.focusElement=this;" autofocus>
					if (activeElement && activeElement.value) {
						expect(activeElement.autofocus).toBe(true);
						done();
					} else {
						setTimeout(loaded, 50);
					}
				}
				loaded();
			}, 3000);
		});
	}

	if (window.console && !window.__karma__ && !/\s+PhantomJS\/\d/.test(navigator.userAgent)) {
		console.log("需要测试oninput事件，请在文本框中输入内容。(支持中文输入)");
		$(document).on("input", function(e) {
			console.log(e.target);
		});
	}
})();