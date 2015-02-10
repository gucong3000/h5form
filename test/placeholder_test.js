(function(window, factory) {
	if (window.$) {
		$(factory);
	} else {
		window.onload = factory;
	}

})(this, function() {
	if (!("placeholder" in document.createElement("input")) || document.documentMode || +navigator.userAgent.replace(/.*(?:\bA\w+WebKit)\/?(\d+).*/i, "$1") < 536) {
		setTimeout(function() {
			var form = document.getElementById("fixture") || document.getElementById("qunit-fixture"),
				support;

			function each(callback) {
				for (var i = 0; i < form.elements.length; i++) {
					var node = form.elements[i];
					if (/^text(area)?|password|email|search|tel|url$/i.test(node.type)) {
						callback(node, i);
					}
				};
			}


			try {
				document.querySelector(":invalid");
				support = true;
			} catch (ex) {}
			module("检查placeholder");

			QUnit.test("检查placeholder是否字符串", function() {
				each(function(node, i) {
					QUnit.ok(typeof node.placeholder === "string", "检查第" + i + "个元素:\t" + node.placeholder);
				});
			});

			QUnit.test("检查placeholder的数量是否正确", function() {
				each(function(node, i) {
					var phNum = $(node).closest("li").find("placeholder").length
					QUnit.equal(phNum, node.placeholder ? 1 : 0, "检查第" + i + "个元素placeholder数量:\t" + phNum);
				});
			});

			QUnit.test("检查placeholder位置是否正确", function() {
				each(function(node, i) {
					if (node.placeholder) {
						var textbox = $(node);
						var pholder = textbox.siblings("placeholder");
						var offsetTextbox = textbox.offset();
						var offsetPholder = pholder.offset();
						var pixX, pixY;

						// var pix = node.offsetLeft - holder.offsetLeft;

						// QUnit.ok(Math.abs(pix) < 2, "检查第" + i + "个元素水平位移:\t" + pix);
						if (/^input$/i.test(node.tagName)) {
							pixY = offsetPholder.top + (pholder.outerHeight() / 2) - offsetTextbox.top - (textbox.outerHeight() / 2);
							QUnit.ok(Math.abs(pixY) < 1, "检查第" + i + "个元素垂直位移:\t" + pixY);
						} else {
							QUnit.ok(offsetPholder.top >= offsetTextbox.top, "检查第" + i + "个元素上边界");
							QUnit.ok(textbox.height() >= pholder.height(), "检查第" + i + "个元素下边界");
							QUnit.ok(offsetPholder.left >= offsetTextbox.left, "检查第" + i + "个元素左边界");
							QUnit.ok(textbox.width() >= pholder.width(), "检查第" + i + "个元素右边界");
						}

					}
				});
			});

		}, 10);
	} else {
		module("检查是否免检浏览器");

		QUnit.test("浏览器品种", function() {
			QUnit.expect(1);
			var broInf = {
				netscape: "Firefox浏览器",
				chrome: "基于Chrome的浏览器",
				opera: "老版本Opera",
			};

			for (var i in broInf) {
				if (window[i]) {
					QUnit.ok(i, broInf[i] + "原生支持placeholder");
					return;
				}
			}
			QUnit.ok(true, "基于webkit内核的浏览器");
		});
	}
});