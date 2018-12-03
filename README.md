# JavaScript 模块化之路

## 一、为什么需要模块化

##### 1. 当一个项目开发的越来越复杂的时候，会遇到一些问题，比如：

命名冲突：当项目由团队进行协作开发的时候，不同开发人员的变量和函数命名可能相同；即使是一个开发，当开发周期比较长的时候，也有可能会忘记之前使用了什么变量，从而导致重复命名，导致命名冲突。

文件依赖：代码重用时，引入js文件的数目可能少了，或者引入的顺序不对，比如使用boostrap的时候，需要引入jQuery，并且jQuery的文件必须要比boostrap的js文件先引入。

##### 2. 当使用模块化开发的时候可以避免以上的问题，并且提高开发效率，方便维护：

提升开发效率：代码方便重用，别人开发的模块直接拿过来就可以使用，不需要重复开发法类似的功能。

方便后期维护 : 清晰的依赖关系便于后期维护

## 二、模块化开发的演变过程
#### 1.全局函数（原始写法）
模块就是实现特定功能的一组方法，只要把不同的函数（以及记录状态的变量）
简单地放在一起，就算是一个模块：
```javascript
function show(element){} //展示一个元素
function close(element){} //隐藏一个元素
```
上面的函数show()和close()，组成一个模块。使用的时候，直接调用就行了。
这种做法的缺点很明显："污染"了全局变量，无法保证不与其他模块发生变量名冲突，而且模块成员之间看不出直接关系。

#### 2.对象封装
为了解决上面问题，对象的写法应运而生，可以把所有的模块成员封装在一个对象中
```javascript
var utils = {
	_str:'Hello',
	sayHello:function(){
		console.log(this._str + ', '+ name + '!');
	}
}
```
上面的函数sayHello封装在utils对象里。使用的时候，就是调用这个对象的属性。
```javascript
utils.sayHello('jack');
```
但是，这样的写法会暴露所有模块成员，内部状态可以被外部改写。比如:
```javascript
utils._str = 'Hi';
```
上面的写法在一定程度上解决了变量命名冲突的问题，只需要保证命名空间的唯一性就可以解决命名冲突的问题了，然后把某一块的业务功能写在一个命名空间内，这样就实现了一个完整的功能模块，并且同一模块的成员有了关系。

但是这样的写法会暴露所有模块成员，内部状态可以被外部改写。

#### 3.闭包封装（立即执行函数）
通过一个立即执行的函数表达式，赋予了模块的独立作用域，这样在模块外部无法	修改我们没有暴露出来的变量、函数，这也是javascript模块化的基础
```javascript
var utils = (function(){
    var  _str = 'Hello';
    function sayHello(name){
        console.log(_str + ', ' + name + '!');
    };
    return {
		sayHello：sayHello
	};
})()
```
使用上面的写法，外部代码无法读取内部的_str变量。
```javascript
　console.log(utils._str); //undefined
```
针对上面的写法，如果一个模块很大，必须分成几个部分，或者一个模块需要继承另一个模块，该如何处理？
```javascript
var utils = (function(utils){
    var  _str = 'Hi';
    utils.sayHi = function(name){
        console.log(_str + ', ' + name + '!');
    };
    return utils;
})(utils)
```
上面的代码为utils模块添加了一个新方法sayHi()，然后返回新的utils模块。

在浏览器环境中，模块的各个部分通常都是从网上获取的，有时无法知道哪个部分会先加载。如果采用上面的写法，第一个执行的部分有可能加载一个不存在空对象
```javascript
var utils = (function(utils){
    var  _str = 'Hi';
    utils.sayHi = function(name){
        console.log(_str + ', ' + name + '!');
    };
    return utils;
})(utils || {})
```
与上面的相比，就是"立即执行函数"的参数可以是空对象。

独立性是模块的重要特点，模块内部最好不与程序的其他部分直接交互。
为了在模块内部调用全局变量，必须显式地将其他变量输入模块
```javascript
var utils = (function(utils,$){
    var  _str = 'Hi';
    utils.sayHi = function(name){
        console.log(_str + ', ' + name + '!');
    };
    return utils;
})(utils || {},jQuery)
```
##### 模块化面临什么问题？
从以上的尝试中，可以归纳出js模块化需要解决那些问题：
1. 如何安全的包装一个模块的代码？（不污染模块外的任何代码）
2. 如何唯一标识一个模块？
3. 如何优雅的把模块的API暴漏出去？（不能增加全局变量）
4. 如何方便的使用所依赖的模块？

#### 4.CommonJs规范
CommonJS 最开始是 Mozilla 的工程师于 2009 年开始的一个项目，它的目的是让浏览器之外的 JavaScript （比如服务器端或者桌面端）能够通过模块化的方式来开发和协作。

CommonJs是一个javascript模块化的规范，NodeJS是CommonJS规范的实现，webpack 也是以CommonJS的形式来书写。
CommonJS定义的模块: 模块引用(require)，模块定义(exports)，模块标识(module)

exports对象用于导出当前模块的方法或变量，唯一的导出口
module对象就代表模块本身。
require()用来引入外部模块

模块导出：
```javascript
//tool.js
var tool = {
    add: function(a,b){
        return a + b;
    }
}
module.exports = tool;
```
```javascript
var tool = {
    add: function(a,b){
        return a + b;
    }
}
exports.add = tool.add;
```
为了方便，Node为每个模块提供一个exports变量，指向module.exports。在模块内部大概是这样的：
var exports = module.exports = {};
在对外输出模块接口时，可以向exports对象添加方法。但是不能知道给exports赋值，因为exports 是指向的 module.exports 的引用。如果直接是给exports赋值而不是添加属性的话，exports 就不再指向module.exports 了。当exports 被改变的时候，module.exports将不会被改变，而模块导出的时候，真正导出的执行是module.exports

模块引用：
```javascript
var tool = require('./tool');
```
Node保存了所有的module对象后，当我们用require()获取module时，Node会根据module.id找到对应的module，并返回module. exports，这样就实现了模块的输出。

#### 5.AMD规范（Asynchronous Module Definition 异步模块定义）
AMD是“异步模块定义”的缩写，也就是说，其中内容是异步加载的，从而让页面不被js的加载阻塞，最大程度上的避免了页面假死等情况的产生。
AMD的一个好处在于依赖前置，所有被使用到的模块都会被提前加载好，从而加快运行速度。

用define来定义模块，用require来加载模块
define(id, [depends], factory); //定义模块
require([module], callback);//加载模块

```javascript
define(['module1','module2'], function(module1,module2){
	...
	return { ... };
})
```
```javascript
require(['module1','module2'],function(module1,module1){
	...
})
```

#### 6.CMD规范（Common Module Definition 通用模块定义）
```javascript
define(function(require,exports,module){...});
```
require 是一个方法,用来获取其他模块提供的接口
exports 是一个对象,用来向外提供模块接口
module 是一个对象,上面存储了与当前模块相关联的一些属性和方法

##### AMD与CMD区别：
1. 对于依赖的模块，AMD 是提前执行，CMD 是延迟执行。
2. CMD 推崇依赖就近，AMD 推崇依赖前置

```javascript
//CMD
define(function(require,exports,module){
	var a = require('./a');
	a.doSomething();
	//此处略去100行
	var = require('./b');
	b.doSomething();
	//...
})

//AMD
define(['./a','./b'],function(a,b){
	a.doSomething();
	//此处略去100行
	b.doSomething();
	//...
})
```

#### 7.ES6模块化
##### 导出（export）
 选择性地给其他模块暴露（提供）自己的属性和方法，供其他模块使用。

```javascript
export var firstName = 'firstName';
export var lastName = 'lastName';
export var year = 1992;
//等价于
var firstName = 'firstName';
var lastName = 'lastName';
var year = 1992;
export {firstName, lastName, year}
```
通常情况下，export输出的变量就是本来的名字，但是可以使用as关键字重命名。

```javascript
function v1() { console.log('v1') }
function v2() { console.log('v2') }

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamV3
}
```
export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。
```javascript
//报错
export 1;
//报错
var m = 1;
export m;
```
上面两种写法都会报错，因为没有提供对外的接口。第一种写法直接输出1，第二种写法通过变量m，还是直接输出1。1只是一个值，不是接口。

```javascript
//写法一
export var m = 1;
//写法二
var m = 1;
export {m};
//写法三
var m = 1;
export{n as m}
```
上面三种写法都是正确的，规定了对外的接口m。其他脚本可以通过这个接口，取	到值1。它们的实质是，在接口名与模块内部变量之间，建立了一一对应的关系。

注：export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值,这一点与 CommonJS 规范完全不同。CommonJS 模块输出的是值的缓存，不存在动态更新

##### 导入（import）
import命令接受一对大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名，必须与被导入模块（profile.js）对外接口的名称相同。如果想为输入的变量重新取一个名字，import命令可以使用as关键字，将输入的变量重命名
```javascript
import {firstName as fName} from './profile';
```
由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。

```javascript
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
```
##### 默认导出(export default)
每个模块支持我们导出一个没有名字的变量，使用关键语句export default来实现.
```javascript
export default function diff(){
	//...
}
import diff from 'diff'; //输入
```
如果想在一条import语句中，同时输入默认方法和其他变量，可以写成下面这样。
```javascript
//het.js
export default function(){
	//...
}
export function each(obj,iterator,context){}
import het,{ each } from './het';
```
##### export 与 import 的复合写法
如果在一个模块之中，先输入后输出同一个模块，import语句可以与export语句写在一起。

```javascript
export { foo, bar } from 'my_module';

//等同于
import { foo, bar } from 'my_module';
export { foo, bar};

//接口改名
export { foo as myFoo } from 'my_module';

//整体输出
export * from 'my_module';
```
**注：**
1、声明的变量，对外都是只读的。但是导出的是对象类型的值，就可修改。
2、导入不存在的变量，值为undefined。

### END





