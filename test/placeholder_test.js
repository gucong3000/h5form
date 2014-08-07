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
        var form = document.getElementById("fixture") || document.getElementById("qunit-fixture"),
            support;
        try {
            document.querySelector(":invalid");
            support = true;
        } catch (ex) {}
        module("检查placeholder位置");

        test("检查placeholder是否字符串", function() {
            for (var i = 0; i < form.elements.length; i++) {
                var node = form.elements[i];
                if (/text(area)?/.test(node.type)) {
                    ok(typeof node.placeholder === "string", "检查第" + i + "个元素:\t" + node.placeholder);
                }
            };
        });

    }
});