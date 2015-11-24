(function(window, factory) {
	if (window.$) {
		$(factory);
	} else {
		window.onload = factory;
	}

})(this, function() {
	module("检查表单元素各项是否正确");

	var formValidData = {
		"qunit-filter-pass": true,
		"qunit-urlconfig-noglobals": true,
		"qunit-urlconfig-notrycatch": true,
		"fixture": false,
		"form-budget": true,
		"INPUT": true,
		"form-other": true,
		"form-destination": false,
		"form-rate": false,
		"form-start-date": false,
		"form-days": true,
		"form-adult": true,
		"form-kid": true,
		"btn-sub-do-order": true
	};

	var formInValidData = {
		"qunit-filter-pass": false,
		"qunit-urlconfig-noglobals": false,
		"qunit-urlconfig-notrycatch": false,
		"fixture": true,
		"form-budget": false,
		"INPUT": false,
		"form-other": false,
		"form-destination": true,
		"form-rate": false,
		"form-start-date": true,
		"form-days": false,
		"form-adult": false,
		"form-kid": false,
		"btn-sub-do-order": false
	};

	if (window.Element) {
		Element.prototype.matches = Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector;
	}

	QUnit.test(":valid 伪类检查", function() {
		$("form,:input").each(function() {
			var name = this.id || this.name || this.tagName;
			if (this.matches) {
				formValidData[name] = this.matches(":valid");
			}
			QUnit.deepEqual($(this).is(":valid"), formValidData[name], name + "正确");
		});
		if (document.body.matches) {
			console.log("var formValidData = " + JSON.stringify(formValidData) + ";");
		}
	});
	QUnit.test(":invalid 伪类检查", function() {
		$("form,:input").each(function() {
			var name = this.id || this.name || this.tagName;
			if (this.matches) {
				formInValidData[name] = this.matches(":invalid");
			}
			QUnit.deepEqual($(this).is(":invalid"), formInValidData[name], name + "正确");
		});
		if (document.body.matches) {
			console.log("var formInValidData = " + JSON.stringify(formInValidData) + ";");
		}
	});
});