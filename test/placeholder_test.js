(function(window, factory) {
	if (window.$) {
		$(factory);
	} else {
		window.onload = factory;
	}

})(this, function() {

	if (window.netscape || window.chrome || window.opera) {

		module("检查是否免检浏览器");

		test("浏览器品种", function() {
			expect(1);
			var broInf = {
				netscape: "Firefox浏览器",
				chrome: "基于Chrome的浏览器",
				opera: "老版本Opera"
			};

			for (var i in broInf) {
				if (window[i]) {
					ok(i, broInf[i] + "原生支持placeholder");
				}
			}
		});
	} else {
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

			test("检查placeholder是否字符串", function() {
				each(function(node, i) {
					ok(typeof node.placeholder === "string", "检查第" + i + "个元素:\t" + node.placeholder);
				});
			});

			test("检查placeholder的数量是否正确", function() {
				each(function(node, i) {
					var phNum = $(node).closest("li").find("placeholder").length
					equal(phNum, node.placeholder ? 1 : 0, "检查第" + i + "个元素placeholder数量:\t" + phNum);
				});
			});

			test("检查placeholder位置是否正确", function() {
				each(function(node, i) {
					if (node.placeholder) {

						var holder = $(node).parent().find("placeholder")[0];
						var pix = node.offsetLeft - holder.offsetLeft;

						ok(Math.abs(pix) < 2, "检查第" + i + "个元素水平位移:\t" + pix);
						var pix = node.offsetTop - holder.offsetTop;
						ok(Math.abs(pix) < 2, "检查第" + i + "个元素垂直位移:\t" + node.offsetTop + "|" + $(holder).css("top") );
					}
				});
			});

		}, 10);


	}
});