import * as __WEBPACK_EXTERNAL_MODULE_clientnode__ from "clientnode";
import * as __WEBPACK_EXTERNAL_MODULE_core_js_modules_es_array_push_js_baa3ea94__ from "core-js/modules/es.array.push.js";
import * as __WEBPACK_EXTERNAL_MODULE_core_js_modules_es_iterator_constructor_js_833f4df9__ from "core-js/modules/es.iterator.constructor.js";
import * as __WEBPACK_EXTERNAL_MODULE_core_js_modules_es_iterator_filter_js_abae28b4__ from "core-js/modules/es.iterator.filter.js";
import * as __WEBPACK_EXTERNAL_MODULE_core_js_modules_es_iterator_for_each_js_2628f2dd__ from "core-js/modules/es.iterator.for-each.js";
import "core-js/modules/es.json.parse.js";
import { readFile as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readFile__ } from "fs/promises";
import { createServer as __WEBPACK_EXTERNAL_MODULE_http_createServer__ } from "http";
import { createServer as __WEBPACK_EXTERNAL_MODULE_https_createServer__ } from "https";
import { createConnection as __WEBPACK_EXTERNAL_MODULE_net_createConnection__, isIP as __WEBPACK_EXTERNAL_MODULE_net_isIP__ } from "net";
import { resolve as __WEBPACK_EXTERNAL_MODULE_path_resolve__ } from "path";
import { connect as __WEBPACK_EXTERNAL_MODULE_tls_connect__ } from "tls";
/******/ var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({  });

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({  });

/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({  });

/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({  });

/***/ }),
/* 5 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["Logger"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.Logger), ["MAXIMAL_NUMBER_OF_ITERATIONS"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.MAXIMAL_NUMBER_OF_ITERATIONS), ["UTILITY_SCOPE"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.UTILITY_SCOPE), ["UTILITY_SCOPE_NAMES"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.UTILITY_SCOPE_NAMES), ["UTILITY_SCOPE_VALUES"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.UTILITY_SCOPE_VALUES), ["compile"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.compile), ["copy"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.copy), ["evaluateAsyncDynamicData"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.evaluateAsyncDynamicData), ["evaluateDynamicData"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.evaluateDynamicData), ["extend"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.extend), ["isFile"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.isFile), ["modifyObject"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.modifyObject), ["represent"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.represent), ["timeout"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.timeout) });

/***/ })
/******/ ]);
/************************************************************************/
/******/ // The module cache
/******/ const __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	const cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	const module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ // define getter/value functions for harmony exports
/******/ __webpack_require__.d = (exports, definition) => {
/******/ 	for(var key in definition) {
/******/ 		if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 			Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 		}
/******/ 	}
/******/ };
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 
/************************************************************************/

// EXTERNAL MODULE: external "core-js/modules/es.array.push.js"
var es_array_push_js_ = __webpack_require__(1);
// EXTERNAL MODULE: external "core-js/modules/es.iterator.constructor.js"
var es_iterator_constructor_js_ = __webpack_require__(2);
// EXTERNAL MODULE: external "core-js/modules/es.iterator.filter.js"
var es_iterator_filter_js_ = __webpack_require__(3);
// EXTERNAL MODULE: external "core-js/modules/es.iterator.for-each.js"
var es_iterator_for_each_js_ = __webpack_require__(4);
;// external "core-js/modules/es.json.parse.js"

// EXTERNAL MODULE: external "clientnode"
var external_clientnode_ = __webpack_require__(5);
;// external "fs/promises"

;// external "http"

;// external "https"

;// external "net"

;// external "path"

;// external "tls"

;// ./package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"HF":{"forwarders":{"base":{"headerTransformations":{"retrieve":[],"send":[]},"host":"localhost","port":443,"rejectUnauthorized":false,"stateAPIs":[{"data":{},"expressions":{"post":"true","pre":"false"},"name":"base","options":{},"url":""}],"tls":true,"useExpression":"true"}},"host":"","logLevel":"info","nodeServerOptions":{},"parseBody":false,"port":{"__evaluate__":"parseInt(environment.PORT ?? \'8080\')"},"privateKeyPath":"","publicKeyPath":""}}');
;// ./src/helper.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module reverse-proxy-middleware *//* !
    region header
    [Project page](https://tsickert.com/reverse-proxy-middleware)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 4.0 international license.
    See https://creativecommons.org/licenses/by/4.0/deed.de
    endregion
*/// region imports
function _typeof(o){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function _objectSpread(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(o),!0).forEach(function(t){_defineProperty(r,t,o[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):ownKeys(Object(o)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(o,e))})}return r};function _defineProperty(r,t,o){return(t=_toPropertyKey(t))in r?Object.defineProperty(r,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[t]=o,r}function _toPropertyKey(r){var o=_toPrimitive(r,"string");return"symbol"==_typeof(o)?o:o+""}function _toPrimitive(t,e){if("object"!=_typeof(t)||!t)return t;var r;if("undefined"!=typeof Symbol&&void 0!==(r=t[Symbol.toPrimitive])){var i=r.call(t,e||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}function _slicedToArray(e,i){return _iterableToArrayLimit(e,i)||_unsupportedIterableToArray(e,i)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArrayLimit(r,t){var e=null==r?null:"undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(Array.isArray(r)&&(null==e||e===("undefined"!=typeof Symbol&&[][Symbol.iterator])||e===[]["@@iterator"]))return r;if(null!=e){var l,n,i,a,u=[],o=!0,f=!1;try{if(i=(e=e.call(r)).next,0===t){if(Object(e)!==e)return;o=!1}else for(;!(o=(l=i.call(e)).done)&&(u.push(l.value),u.length!==t);o=!0);}catch(r){f=!0,n=r}finally{try{if(!o&&null!=e.return&&(a=e.return(),Object(a)!==a))return}finally{if(f)throw n}}return u}}function _regenerator(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */var r,e,o="function"==typeof Symbol?Symbol:{},n=o.iterator||"@@iterator",a=o.toStringTag||"@@toStringTag";function i(o,n,a,i){var u=n&&n.prototype instanceof Generator?n:Generator,f=Object.create(u.prototype);return _regeneratorDefine2(f,"_invoke",function(t,o,n){var a,i,u,f=0,p=n||[],y=!1,G={p:0,n:0,v:r,a:l,f:l.bind(r,4),d:function d(t,e){return a=t,i=0,u=r,G.n=e,c}};function l(t,o){for(i=t,u=o,e=0;!y&&f&&!n&&e<p.length;e++){var n,a=p[e],l=G.p,F=a[2];t>3?(n=F===o)&&(u=a[(i=a[4])?5:(i=3,3)],a[4]=a[5]=r):a[0]<=l&&((n=t<2&&l<a[1])?(i=0,G.v=o,G.n=a[1]):l<F&&(n=t<3||a[0]>o||o>F)&&(a[4]=t,a[5]=o,G.n=F,i=0))}if(n||t>1)return c;throw y=!0,o}return function(n,p,F){if(f>1)throw TypeError("Generator is already running");for(y&&1===p&&l(p,F),i=p,u=F;(e=i<2?r:u)||!y;){a||(i?(i>1&&(G.n=i<3?-1:u),l(i,u)):G.v=u);try{if(f=2,a){if(i||(n="next"),e=a[n]){if(!(e=e.call(a,u)))throw TypeError("iterator result is not an object");if(!e.done)return e;u=e.value,i<2&&(i=0)}else 1===i&&(e=a.return)&&e.call(a),i<2&&(u=TypeError("The iterator does not provide a '"+n+"' method"),i=1);a=r}else if((e=(y=G.n<0)?u:t.call(o,G))!==c)break}catch(t){a=r,i=1,u=t}finally{f=1}}return{value:e,done:y}}}(o,a,i),!0),f}var c={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}e=Object.getPrototypeOf;var u=[][n]?e(e([][n]())):(_regeneratorDefine2(e={},n,function(){return this}),e),f=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(u);function p(r){return Object.setPrototypeOf?Object.setPrototypeOf(r,GeneratorFunctionPrototype):(r.__proto__=GeneratorFunctionPrototype,_regeneratorDefine2(r,a,"GeneratorFunction")),r.prototype=Object.create(f),r}return GeneratorFunction.prototype=GeneratorFunctionPrototype,_regeneratorDefine2(f,"constructor",GeneratorFunctionPrototype),_regeneratorDefine2(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName="GeneratorFunction",_regeneratorDefine2(GeneratorFunctionPrototype,a,"GeneratorFunction"),_regeneratorDefine2(f),_regeneratorDefine2(f,a,"Generator"),_regeneratorDefine2(f,n,function(){return this}),_regeneratorDefine2(f,"toString",function(){return"[object Generator]"}),(_regenerator=function _regenerator(){return{w:i,m:p}})()}function _regeneratorDefine2(e,r,n,t){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}_regeneratorDefine2=function _regeneratorDefine(e,r,n,t){function o(r,n){_regeneratorDefine2(e,r,function(e){return this._invoke(r,n,e)})}r?i?i(e,r,{value:n,enumerable:!t,configurable:!t,writable:!t}):e[r]=n:(o("next",0),o("throw",1),o("return",2))},_regeneratorDefine2(e,r,n,t)}function _createForOfIteratorHelper(e,t){var _n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!_n){if(Array.isArray(e)||(_n=_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){_n&&(e=_n);var o=0,F=function F(){};return{s:F,n:function n(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function e(r){throw r},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u,i=!0;return{s:function s(){_n=_n.call(e)},n:function n(){i=!0;var r=_n.next();return r.done?{done:!0}:{value:r.value,done:i=!1}},e:function e(r){a=!0,u=r},f:function f(){try{i||null==_n.return||_n.return()}finally{if(a)throw u}}}}function asyncGeneratorStep(n,t,e,r,o,a,c){try{var i=n[a](c),u=i.value}catch(n){return void e(n)}i.done?t(u):Promise.resolve(u).then(r,o)}function _asyncToGenerator(n){return function(){var t=this,e=arguments;return new Promise(function(r,o){var a=n.apply(t,e);function _next(n){asyncGeneratorStep(a,r,o,_next,_throw,"next",n)}function _throw(n){asyncGeneratorStep(a,r,o,_next,_throw,"throw",n)}_next(void 0)})}}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var o={}.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?_arrayLikeToArray(t,e):void 0}}function _iterableToArray(r){var e="undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(Array.isArray(r)&&(null==e||e===("undefined"!=typeof Symbol&&[][Symbol.iterator])||e===[]["@@iterator"]))return r;if(null!=e){for(var t,o=[],a=e.call(r);!(t=a.next()).done;)o.push(t.value);return o}}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n};// endregion
var EVALUATION_SCOPE_NAMES=[].concat(_toConsumableArray(external_clientnode_.UTILITY_SCOPE_NAMES),["data","error","request","response","stateAPI","stateAPIs"]);var log=new external_clientnode_.Logger({name:"reverse-proxy-middleware"});// region forwarder
var applyStateAPIs=/*#__PURE__*/function(){var _applyStateAPIs=_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(request,response,forwarder){var stateAPIScope,state,_iterator,_step,stateAPI,useStateAPI,index,_iterator2,_step2,_expression,_result,error,_iterator3,_step3,expression,result,_t,_t2,_t3,_t4,_t5;return _regenerator().w(function(_context){while(1)switch(_context.p=_context.n){case 0:stateAPIScope={};_iterator=_createForOfIteratorHelper(forwarder.stateAPIs);_context.p=1;_iterator.s();case 2:if((_step=_iterator.n()).done){_context.n=30;break}stateAPI=_step.value;state=stateAPIScope[stateAPI.name]={configuration:stateAPI,error:null,response:null};useStateAPI=false;index=1;_iterator2=_createForOfIteratorHelper(stateAPI.expressions.pre);_context.p=3;_iterator2.s();case 4:if((_step2=_iterator2.n()).done){_context.n=9;break}_expression=_step2.value;_result=void 0;try{_result=_expression.apply(void 0,_toConsumableArray(external_clientnode_.UTILITY_SCOPE_VALUES).concat([stateAPI.data,null,request,response,state,stateAPIScope]))}catch(error){void log.warn("Failed running pre ".concat(String(index),". expression of ")+"state api:",error)}if(!(typeof _result==="number")){_context.n=5;break}void log.info("Break request caused by state api","\"".concat(stateAPI.name,"\" with status code ").concat(String(_result),"."));response.statusCode=_result;response.end();return _context.a(2,{result:false,scope:stateAPIScope});case 5:if(!(_result==="break")){_context.n=6;break}return _context.a(3,9);case 6:index+=1;if(!(typeof _result==="boolean")){_context.n=8;break}if(!_result){_context.n=7;break}useStateAPI=true;_context.n=8;break;case 7:return _context.a(3,9);case 8:_context.n=4;break;case 9:_context.n=11;break;case 10:_context.p=10;_t=_context.v;_iterator2.e(_t);case 11:_context.p=11;_iterator2.f();return _context.f(11);case 12:if(!useStateAPI){_context.n=29;break}void log.info("Use state api: \"".concat(stateAPI.name,"\""));error=null;if(stateAPI.urlExpression)try{stateAPI.url=stateAPI.urlExpression.apply(stateAPI,_toConsumableArray(external_clientnode_.UTILITY_SCOPE_VALUES).concat([stateAPI.data,null,request,response,state,stateAPIScope]))}catch(error){void log.warn("Failed running url expression:",error)}void log.debug("\nState api configuration is: ".concat((0,external_clientnode_.represent)(stateAPI)));_context.p=13;_context.n=14;return fetch(stateAPI.url,stateAPI.options);case 14:state.response=_context.v;_context.n=16;break;case 15:_context.p=15;_t2=_context.v;error=_t2;void log.warn("Running state api request for \"".concat(stateAPI.name,"\" throws"),"error:",error);case 16:if(!(state.response&&state.response.headers.has("content-type")&&/application\/json(;.*)?$/.test(state.response.headers.get("content-type")))){_context.n=20;break}_context.p=17;_context.n=18;return state.response.json();case 18:state.response.data=_context.v;_context.n=20;break;case 19:_context.p=19;_t3=_context.v;error=_t3;void log.warn("Parsing state api json response for","\"".concat(stateAPI.name,"\" throws error:"),error);case 20:void log.debug("\nState api response is:",(0,external_clientnode_.represent)(state.response));index=1;_iterator3=_createForOfIteratorHelper(stateAPI.expressions.post);_context.p=21;_iterator3.s();case 22:if((_step3=_iterator3.n()).done){_context.n=26;break}expression=_step3.value;result=null;try{result=expression.apply(void 0,_toConsumableArray(external_clientnode_.UTILITY_SCOPE_VALUES).concat([stateAPI.data,error,request,response,state,stateAPIScope]))}catch(error){void log.warn("Failed running ".concat(String(index),". post ")+"expression of state api:",error)}if(!(typeof result==="number")){_context.n=23;break}void log.info("Break request caused by state api","\"".concat(stateAPI.name,"\" with status code ")+"".concat(String(result),"."));response.statusCode=result;response.end();return _context.a(2,{result:false,scope:stateAPIScope});case 23:if(!(result==="break")){_context.n=24;break}return _context.a(3,26);case 24:index+=1;case 25:_context.n=22;break;case 26:_context.n=28;break;case 27:_context.p=27;_t4=_context.v;_iterator3.e(_t4);case 28:_context.p=28;_iterator3.f();return _context.f(28);case 29:_context.n=2;break;case 30:_context.n=32;break;case 31:_context.p=31;_t5=_context.v;_iterator.e(_t5);case 32:_context.p=32;_iterator.f();return _context.f(32);case 33:return _context.a(2,{result:true,scope:stateAPIScope})}},_callee,null,[[21,27,28,29],[17,19],[13,15],[3,10,11,12],[1,31,32,33]])}));function applyStateAPIs(_x,_x2,_x3){return _applyStateAPIs.apply(this,arguments)}return applyStateAPIs}();var determineForwarder=function determineForwarder(request,response,forwarders){var _iterator4=_createForOfIteratorHelper(Object.entries(forwarders).sort(function(_ref,_ref2){var _ref3=_slicedToArray(_ref,1),firstName=_ref3[0];var _ref4=_slicedToArray(_ref2,1),secondName=_ref4[0];return firstName.localeCompare(secondName)})),_step4;try{for(_iterator4.s();!(_step4=_iterator4.n()).done;){var _step4$value=_slicedToArray(_step4.value,2),name=_step4$value[0],forwarder=_step4$value[1];var state={configuration:forwarder,error:null,response:null};if(forwarder.useExpression.apply(forwarder,_toConsumableArray(external_clientnode_.UTILITY_SCOPE_VALUES).concat([forwarder,null,request,response,state,_defineProperty({},name,state)]))){void log.info("Determined forwarder is: \"".concat(name,"\"."));return forwarder}}}catch(err){_iterator4.e(err)}finally{_iterator4.f()}return null};var resolveForwarders=function resolveForwarders(forwarders){var resolvedForwarders={};for(var _i=0,_Object$entries=Object.entries(forwarders);_i<_Object$entries.length;_i++){var _Object$entries$_i=_slicedToArray(_Object$entries[_i],2),name=_Object$entries$_i[0],givenForwarder=_Object$entries$_i[1];if(name!=="base"){var forwarder=(0,external_clientnode_.extend)(true,{name:name},(0,external_clientnode_.modifyObject)((0,external_clientnode_.copy)(forwarders.base),givenForwarder),givenForwarder);// region normalize header transformations
var headerTransformations={retrieve:[],send:[]};var _iterator5=_createForOfIteratorHelper(["retrieve","send"]),_step5;try{for(_iterator5.s();!(_step5=_iterator5.n()).done;){var type=_step5.value;var _iterator9=_createForOfIteratorHelper([].concat(forwarder.headerTransformations[type])),_step9;try{var _loop=function _loop(){var givenTransformation=_step9.value;var transformation=_objectSpread(_objectSpread({},givenTransformation),{},{sourceRun:function sourceRun(){return""},targetRun:function targetRun(){return""}});if(Object.prototype.hasOwnProperty.call(transformation,"source"))if(transformation.source instanceof RegExp)transformation.sourceRun=function(){return transformation.source};else if(typeof transformation.source==="string"){var _result5=(0,external_clientnode_.compile)(transformation.source,{scope:EVALUATION_SCOPE_NAMES});if(_result5.error)throw new Error(_result5.error);transformation.sourceRun=_result5.templateFunction}else if(transformation.source)transformation.sourceRun=transformation.source;if(Object.prototype.hasOwnProperty.call(transformation,"target"))if(typeof transformation.target==="string"){var _result6=(0,external_clientnode_.compile)(transformation.target,{scope:EVALUATION_SCOPE_NAMES});if(_result6.error)throw new Error(_result6.error);transformation.targetRun=_result6.templateFunction}else if(transformation.target)transformation.targetRun=transformation.target;headerTransformations[type].push(transformation)};for(_iterator9.s();!(_step9=_iterator9.n()).done;){_loop()}}catch(err){_iterator9.e(err)}finally{_iterator9.f()}}}catch(err){_iterator5.e(err)}finally{_iterator5.f()}forwarder.headerTransformations=headerTransformations;// endregion
// region state apis
var stateAPIs=[];var givenStateAPIs=[].concat(forwarder.stateAPIs||[]);var baseAPI=givenStateAPIs.filter(function(api){return api.name==="base"})[0];var extendedGivenStateAPIs=[];var _iterator6=_createForOfIteratorHelper(givenStateAPIs),_step6;try{for(_iterator6.s();!(_step6=_iterator6.n()).done;){var _api=_step6.value;if(_api.name!=="base")extendedGivenStateAPIs.push((0,external_clientnode_.extend)(true,{},(0,external_clientnode_.modifyObject)((0,external_clientnode_.copy)(baseAPI),_api),_api))}}catch(err){_iterator6.e(err)}finally{_iterator6.f()}for(var _i2=0,_extendedGivenStateAP=extendedGivenStateAPIs;_i2<_extendedGivenStateAP.length;_i2++){var _api$expressions,_api$expressions2;var api=_extendedGivenStateAP[_i2];// region normalize url expression
if(typeof api.urlExpression==="string"){var result=(0,external_clientnode_.compile)(api.urlExpression,{scope:EVALUATION_SCOPE_NAMES});if(result.error)throw new Error(result.error);api.urlExpression=result.templateFunction}// endregion
// region normalize pre / post expressions
var expressions={pre:[],post:[]};var _iterator7=_createForOfIteratorHelper([].concat(((_api$expressions=api.expressions)===null||_api$expressions===void 0?void 0:_api$expressions.pre)||[])),_step7;try{for(_iterator7.s();!(_step7=_iterator7.n()).done;){var expression=_step7.value;if(typeof expression==="string"){var _result2=(0,external_clientnode_.compile)(expression,{scope:EVALUATION_SCOPE_NAMES});if(_result2.error)throw new Error(_result2.error);expressions.pre.push(_result2.templateFunction)}else expressions.pre.push(expression)}}catch(err){_iterator7.e(err)}finally{_iterator7.f()}var _iterator8=_createForOfIteratorHelper([].concat(((_api$expressions2=api.expressions)===null||_api$expressions2===void 0?void 0:_api$expressions2.post)||[])),_step8;try{for(_iterator8.s();!(_step8=_iterator8.n()).done;){var _expression2=_step8.value;if(typeof _expression2==="string"){var _result3=(0,external_clientnode_.compile)(_expression2,{scope:EVALUATION_SCOPE_NAMES});if(_result3.error)throw new Error(_result3.error);expressions.post.push(_result3.templateFunction)}else expressions.post.push(_expression2)}}catch(err){_iterator8.e(err)}finally{_iterator8.f()}api.expressions=expressions;// endregion
stateAPIs.push(api)}forwarder.stateAPIs=stateAPIs;// endregion
// region normalize use expression
if(typeof forwarder.useExpression==="string"){var _result4=(0,external_clientnode_.compile)(forwarder.useExpression,{scope:EVALUATION_SCOPE_NAMES});if(_result4.error)throw new Error(_result4.error);forwarder.useExpression=_result4.templateFunction}// endregion
resolvedForwarders[name]=forwarder}}return resolvedForwarders};// endregion
var addParsedContentToRequest=function addParsedContentToRequest(bufferedRequest){if(bufferedRequest.headers["content-type"]&&/application\/json(;.*)?$/.test(bufferedRequest.headers["content-type"]))try{var data=Buffer.concat(bufferedRequest.socket.buffer.data).toString();bufferedRequest.socket.buffer.body=data.replace(/^[\s\S]+\s*\n\s*\n\s*([\s\S]+)$/m,"$1");bufferedRequest.socket.buffer.content=JSON.parse(bufferedRequest.socket.buffer.body)}catch(_unused){void log.warn("Error parsing given request.",bufferedRequest)}};var transformHeaders=function transformHeaders(content,headerTransformations,parameters){var newLinePrinted=false;var _iterator0=_createForOfIteratorHelper(headerTransformations),_step0;try{var _loop2=function _loop2(){var transformation=_step0.value;try{var source=transformation.sourceRun.apply(transformation,_toConsumableArray(parameters));var target=transformation.targetRun.apply(transformation,_toConsumableArray(parameters));if([null,undefined].includes(source)||typeof source==="string"&&source.trim()===""){if([null,undefined].includes(target)||typeof target==="string"&&target.trim()==="")return 1;// continue
// Add new header.
content=content.replace(/(\s*\n)\s*\n\s*/,function(substring,delimiter){for(var _len=arguments.length,parameters=new Array(_len>2?_len-2:0),_key=2;_key<_len;_key++){parameters[_key-2]=arguments[_key]}var result=typeof target==="string"?target:target?target.apply(void 0,[substring,delimiter].concat(parameters)):"";return"".concat(delimiter).concat(result).concat(substring)})}else{if(!newLinePrinted){void log.debug();newLinePrinted=true}// Search and replace (or remove) header.
void log.debug("Search for \"".concat(source,"\" and replace with"),"".concat((0,external_clientnode_.represent)(target),"."));if(source)content=content.replace(source,target)}}catch(error){void log.warn("\nCould not apply header transformation with source "+(transformation.source?(0,external_clientnode_.represent)(transformation.source):"\"add\"")+" and replacement "+(transformation.target?(0,external_clientnode_.represent)(transformation.target):"\"remove\"")+":",error)}};for(_iterator0.s();!(_step0=_iterator0.n()).done;){if(_loop2())continue}}catch(err){_iterator0.e(err)}finally{_iterator0.f()}return content};var reverseProxyBufferedRequest=/*#__PURE__*/function(){var _reverseProxyBufferedRequest=_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(request,response,forwarder,stateAPIScope){return _regenerator().w(function(_context2){while(1)switch(_context2.n){case 0:return _context2.a(2,new Promise(function(resolve,reject){var clientSocket=response.socket;var createConnection=forwarder.tls?__WEBPACK_EXTERNAL_MODULE_tls_connect__:__WEBPACK_EXTERNAL_MODULE_net_createConnection__;var portSuffix=forwarder.tls&&forwarder.port!==443||!forwarder.tls&&forwarder.port!==80?":".concat(String(forwarder.port)):"";var serverSocket=createConnection(_objectSpread({host:forwarder.host,port:forwarder.port},forwarder.tls?_objectSpread(_objectSpread({},__WEBPACK_EXTERNAL_MODULE_net_isIP__(forwarder.host)?{}:{servername:forwarder.host}),{},{rejectUnauthorized:forwarder.rejectUnauthorized}):{}),function(){void log.info("\nConnection to: http".concat(forwarder.tls?"s":"","://")+"".concat(forwarder.host).concat(portSuffix," established."))});serverSocket.on("error",function(error){void log.error("Proxy to server error",error);reject(error)});var parameters=[].concat(_toConsumableArray(external_clientnode_.UTILITY_SCOPE_VALUES),[{clientSocket:clientSocket,serverSocket:serverSocket},null,request,response,null,stateAPIScope]);// Send data from server back to client.
if(forwarder.headerTransformations.retrieve.length){var headerProcessed=false;serverSocket.on("data",function(buffer){if(headerProcessed){clientSocket.write(buffer);return}var content=buffer.toString();void log.info("\n <=== Got response header from backend:\n\n".concat(content));content=transformHeaders(content,forwarder.headerTransformations.retrieve,parameters);void log.info("\n <<<< Send response header to client:\n\n".concat(content));clientSocket.write(content);headerProcessed=true;resolve()})}else serverSocket.pipe(clientSocket);/*
            NOTE: A closed client connection makes the backend connection
            obsolete. Without header transformations the request is finished
            when the backend connection has been closed.
        */var onClientClose=function onClientClose(){serverSocket.destroy()};clientSocket.once("close",onClientClose);serverSocket.on("close",function(){clientSocket.off("close",onClientClose);resolve()});serverSocket.on("connect",function(){var headerProcessed=false;var _iterator1=_createForOfIteratorHelper(request.socket.buffer.data),_step1;try{for(_iterator1.s();!(_step1=_iterator1.n()).done;){var buffer=_step1.value;if(!headerProcessed){var content=buffer.toString();void log.debug("\n ===> Got request header from client:\n\n".concat(content));if(forwarder.tls)// NOTE: TLS support was introduced in version 1.1.
content=content.replace(/HTTP\/1\.0/i,"HTTP/1.1");// Overwrite proxy host with destination one.
content=content.replace(/(($|\n)host: )[^\r\n]+/i,"$1".concat(forwarder.host).concat(portSuffix));content=transformHeaders(content,forwarder.headerTransformations.send,parameters);void log.debug("\n >>>> Send request header to backend:\n\n".concat(content));serverSocket.write(content);headerProcessed=true;continue}serverSocket.write(buffer)}}catch(err){_iterator1.e(err)}finally{_iterator1.f()}})}))}},_callee2)}));function reverseProxyBufferedRequest(_x4,_x5,_x6,_x7){return _reverseProxyBufferedRequest.apply(this,arguments)}return reverseProxyBufferedRequest}();// region server
/**
 * Loads the package configuration extended by "configuration.json" and
 * "secure-configuration.json" files found in given directory, evaluates all
 * dynamic values and loads configured key and certificate files into the node
 * server options.
 * @param directoryPath - Directory to search configuration files in.
 * @param baseConfiguration - Configuration to extend.
 * @returns A promise resolving to the evaluated configuration.
 */var loadConfiguration=/*#__PURE__*/function(){var _loadConfiguration=_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(directoryPath,baseConfiguration){var configuration,_iterator10,_step10,path,configurationPath,givenConfiguration,evaluationOptions,result,_t6,_t7,_t8,_t9,_t0;return _regenerator().w(function(_context3){while(1)switch(_context3.p=_context3.n){case 0:if(directoryPath===void 0){directoryPath=process.cwd()}if(baseConfiguration===void 0){baseConfiguration=package_namespaceObject.HF}configuration=(0,external_clientnode_.copy)(baseConfiguration);_iterator10=_createForOfIteratorHelper(["configuration.json","secure-configuration.json"]);_context3.p=1;_iterator10.s();case 2:if((_step10=_iterator10.n()).done){_context3.n=6;break}path=_step10.value;configurationPath=__WEBPACK_EXTERNAL_MODULE_path_resolve__(directoryPath,path);_context3.n=3;return (0,external_clientnode_.isFile)(configurationPath);case 3:if(!_context3.v){_context3.n=5;break}_t6=JSON;_context3.n=4;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readFile__(configurationPath,{encoding:"utf-8"});case 4:givenConfiguration=_t6.parse.call(_t6,_context3.v);(0,external_clientnode_.extend)(true,(0,external_clientnode_.modifyObject)(configuration,givenConfiguration),givenConfiguration);case 5:_context3.n=2;break;case 6:_context3.n=8;break;case 7:_context3.p=7;_t7=_context3.v;_iterator10.e(_t7);case 8:_context3.p=8;_iterator10.f();return _context3.f(8);case 9:evaluationOptions={scope:_objectSpread(_objectSpread({},external_clientnode_.UTILITY_SCOPE),{},{configuration:configuration,environment:process.env})};_context3.n=10;return (0,external_clientnode_.evaluateAsyncDynamicData)((0,external_clientnode_.evaluateDynamicData)(configuration,evaluationOptions),evaluationOptions);case 10:result=_context3.v;if(!(result.privateKeyPath&&result.publicKeyPath)){_context3.n=13;break}_t8=_objectSpread;_context3.n=11;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readFile__(__WEBPACK_EXTERNAL_MODULE_path_resolve__(directoryPath,result.publicKeyPath));case 11:_t9=_context3.v;_context3.n=12;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readFile__(__WEBPACK_EXTERNAL_MODULE_path_resolve__(directoryPath,result.privateKeyPath));case 12:_t0=_context3.v;result.nodeServerOptions=_t8({cert:_t9,key:_t0},result.nodeServerOptions);case 13:return _context3.a(2,result)}},_callee3,null,[[1,7,8,9]])}));function loadConfiguration(_x8,_x9){return _loadConfiguration.apply(this,arguments)}return loadConfiguration}();/**
 * Waits until given request is fully buffered, determines its forwarder,
 * applies the forwarder's state apis and forwards the request.
 * @param request - Buffered client request.
 * @param response - Response to the client.
 * @param forwarders - Forwarders to choose from.
 * @param parseBody - Indicates whether to parse a json request body.
 * @returns A promise resolving when the request has been processed.
 */var handleRequest=/*#__PURE__*/function(){var _handleRequest=_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(request,response,forwarders,parseBody){var iteration,forwarder,_yield$applyStateAPIs,result,scope,_t1;return _regenerator().w(function(_context4){while(1)switch(_context4.p=_context4.n){case 0:if(parseBody===void 0){parseBody=false}void log.info("|".concat("-".repeat(80-2),"|\nStart processing"),"".concat(request.method," request: ").concat(request.url,"\n")+request);// NOTE: We have to wait until client request is fully buffered.
iteration=0;case 1:if(!(iteration<external_clientnode_.MAXIMAL_NUMBER_OF_ITERATIONS.value*1000)){_context4.n=4;break}_context4.n=2;return (0,external_clientnode_.timeout)();case 2:if(!request.socket.buffer.finished){_context4.n=3;break}return _context4.a(3,4);case 3:iteration++;_context4.n=1;break;case 4:if(parseBody)addParsedContentToRequest(request);forwarder=determineForwarder(request,response,forwarders);if(!(forwarder===null)){_context4.n=5;break}void log.error("No forwarder found for given request:",request);response.statusCode=502;response.end();return _context4.a(2);case 5:_context4.p=5;_context4.n=6;return applyStateAPIs(request,response,forwarder);case 6:_yield$applyStateAPIs=_context4.v;result=_yield$applyStateAPIs.result;scope=_yield$applyStateAPIs.scope;if(!result){_context4.n=7;break}_context4.n=7;return reverseProxyBufferedRequest(request,response,forwarder,scope);case 7:_context4.n=9;break;case 8:_context4.p=8;_t1=_context4.v;void log.error(_t1);case 9:void log.info("\nEnd processing","".concat(request.method," request: ").concat(request.url,"\n")+"".concat(request,"|").concat("-".repeat(80-2),"|"));case 10:return _context4.a(2)}},_callee4,null,[[5,8]])}));function handleRequest(_x0,_x1,_x10,_x11){return _handleRequest.apply(this,arguments)}return handleRequest}();/**
 * Creates a (not yet listening) server forwarding incoming requests.
 * @param configuration - Server configuration.
 * @param forwarders - Forwarders to use for incoming requests.
 * @returns The created server.
 */var createServer=function createServer(configuration,forwarders){if(forwarders===void 0){forwarders=resolveForwarders(configuration.forwarders)}var onIncomingMessage=function onIncomingMessage(request,response){void handleRequest(request,response,forwarders,configuration.parseBody)};var secure=Boolean(configuration.publicKeyPath&&configuration.privateKeyPath);var server={/*
            NOTE: Requests are forwarded as raw HTTP/1 data so encrypted
            connections can not use HTTP/2.
        */instance:secure?__WEBPACK_EXTERNAL_MODULE_https_createServer__(configuration.nodeServerOptions,onIncomingMessage):__WEBPACK_EXTERNAL_MODULE_http_createServer__(onIncomingMessage),streams:[],sockets:[],start:function start(){return new Promise(function(resolve,reject){server.instance.once("error",reject);server.instance.listen(configuration.port,// NOTE: An empty host listens on all network interfaces.
configuration.host||undefined,function(){server.instance.off("error",reject);void log.info("Listen on ".concat(configuration.host||"all interfaces")+" with port ".concat(String(configuration.port)," for ")+"incoming requests.");resolve()})})},stop:function stop(){return new Promise(function(resolve){server.instance.close(function(){void log.info("Shut server down.");resolve()});for(var _i3=0,_arr=[server.sockets,server.streams];_i3<_arr.length;_i3++){var connections=_arr[_i3];for(var _i4=0,_arr2=_toConsumableArray(connections);_i4<_arr2.length;_i4++){var connection=_arr2[_i4];connection.destroy()}}})}};// NOTE: Encrypted connections provide their decrypted data separately.
server.instance.on(secure?"secureConnection":"connection",function(socket){server.sockets.push(socket);socket.buffer={data:[],finished:false};socket.on("data",function(data){socket.buffer.data.push(data)});for(var _i5=0,_arr3=["done","finish","writableEnded","writableFinished"];_i5<_arr3.length;_i5++){var name=_arr3[_i5];socket.on(name,function(){socket.buffer.finished=true})}/*
                NOTE: Workaround since none of the events above trigger before
                responding to client occurred.
            */void (0,external_clientnode_.timeout)(function(){socket.buffer.finished=true});socket.on("close",function(){socket.buffer.finished=true;server.sockets.splice(server.sockets.indexOf(socket),1)})});server.instance.on("stream",function(stream,headers){server.streams.push(stream);void log.info("Got stream",stream,headers);stream.on("close",function(){server.streams.splice(server.streams.indexOf(stream),1)})});return server};// endregion
/* harmony default export */ const helper = (reverseProxyBufferedRequest);
export { EVALUATION_SCOPE_NAMES, addParsedContentToRequest, applyStateAPIs, createServer, helper as default, determineForwarder, handleRequest, loadConfiguration, log, resolveForwarders, reverseProxyBufferedRequest, transformHeaders };
