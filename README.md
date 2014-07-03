h5form v0.2.1
======

HTML5 form Field polyfill

----------


> 为了解放开发者，HTML5引入了约束验证的概念，一种本地实现的网页表单验证。尽管所有主流浏览器的最新版本都支持了这个特性，但一些浏览器尚未实现。这个项目的主要功能就是让所有浏览器均支持HTML5表单约束验证功能，同时提供placeholder属性和oninput事件等相关功能。

## 使用方法 ##
```HTML
<script src="build/h5form.js"></script>
```

加入js后，为Firefox和Chrome等现代浏览器而写的表单验证，IE下也能工作了

`h5form.js`会自动管理依赖的js，IE9+会自动加载`h5form.el.js`，IE6-8下自动加载`h5form.htc`

## 特性 ##

**支持的浏览器**

- IE6+		(兼容IE11)
- Chrome
- Firefox
- Safari
- Opera (老版本Presto内核也支持)

**支持的HTML5属性**

- noValidate				`form.noValidate`			不验证此表单
- formNoValidate			`button.formNoValidate`		此按钮所属表单不验证
- validationMessage		`field.validationMessage`	错误消息
- willValidate			`field.willValidate`		此元素可进行验证
- placeholder			`field.placeholder`			文本框展位字符
- required				`field.required`			此项为必填项
- pattern				`field.pattern`				正则验证规则
- step					`field.step`				数字增量
- max					`field.max`					数字上限
- min					`field.min`					数字下限
- validity				`field.validity`			约束验证的详细信息
	- validity.customError		自定义错误
	- validity.patternMismatch	正则不匹配
	- validity.rangeOverflow		值max越界
	- validity.rangeUnderflow	值min越界
	- validity.stepMismatch		值不符setp
	- validity.tooLong			文本超长
	- validity.typeMismatch		值不符type约束
	- validity.valid				验证无误
	- validity.valueMissing		值为空

**支持的HTML5方法**

- checkValidity()		`form.checkValidity()`、`field.checkValidity()`	检查表单，返回布尔值，且在错误时触发oninvalid
- setCustomValidity()	`field.setCustomValidity(msg)`					设置自定义错误

**支持的HTML5表单事件**	(IE6-8下需加载jQuery，否则不支持)

- oninvalid		表单验证失败事件
- oninput		表单值改变事件

**特性详解**

- 已经支持HTML5表单约束验证的浏览器下，加载文件后会隐藏掉浏览器原生的气泡提示
- 修正Safari下invalid事件后表单依然被提交的问题
- 当与jQuery共同使用时：
	- invalid事件向DOM树冒泡（原生invalid事件并不冒泡）
	- 让jquery支持“:invalid”和“:valid”伪类选择符
- 对IE低版本添加的功能：
	- 添加IE6-9对placeholder功能的支持
	- 添加IE6-8对input事件的支持
	- 添加IE6-9对约束验证功能的支持
- 对高版本IE的已有的不完善功能的修正
	- 修正IE10+支持HTML5约束验证，但很多细节与其他浏览器有差异的问题
	- 修正IE10+对placeholder的实现与其他浏览器的差异	(文本框获取焦点但未输入文字时，应该显示占位文本。)
	- 修正IE9+高版本对可编辑状态元素(如：`<p contentEditable=“true”>;`)不支持input事件的问题
	- 修正IE9在删除、剪切等方式操作文本框中的字符串时，不触发input事件的问题	(该死的IE9不再支持propertychange事件)

## 参考资料 ##

[HTML5约束验证API详解](http://ju.outofmemory.cn/entry/31397)

[HTML5手册中placeholder属性](http://www.w3school.com.cn/html5/att_input_placeholder.asp)

## 协同开发 ##

本项目使用grunt环境编译，提交代码需经过grunt做JSHint代码风格检查以便保证代码质量
