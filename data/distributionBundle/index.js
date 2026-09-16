#!/usr/bin/env node
// -*- coding: utf-8 -*-

import { createConnection as __WEBPACK_EXTERNAL_MODULE_net_createConnection__ } from "net";
import { connect as __WEBPACK_EXTERNAL_MODULE_tls_connect__ } from "tls";
import * as __WEBPACK_EXTERNAL_MODULE_clientnode__ from "clientnode";
import * as __WEBPACK_EXTERNAL_MODULE_http__ from "http";
import * as __WEBPACK_EXTERNAL_MODULE_http2__ from "http2";
import * as __WEBPACK_EXTERNAL_MODULE_path__ from "path";
/******/ var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ko: () => (/* binding */ addParsedContentToRequest),
  BE: () => (/* binding */ applyStateAPIs),
  Ay: () => (/* binding */ helper),
  cP: () => (/* binding */ determineForwarder),
  m9: () => (/* binding */ logging),
  cx: () => (/* binding */ resolveForwarders)
});

// UNUSED EXPORTS: EVALUATION_SCOPE_NAMES, reverseProxyBufferedRequest, transformHeaders

// EXTERNAL MODULE: external "clientnode"
var external_clientnode_ = __webpack_require__(1);
;// external "net"

;// external "tls"

;// ./helper.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module web-node *//* !
    region header
    [Project page](https://torben.website/webNode)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
// NOTE: http2 compatibility mode does work for unencrypted connections yet.
function _typeof(o){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach(function(r){_defineProperty(e,r,t[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})}return e}function _defineProperty(e,r,t){return(r=_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function _toPropertyKey(t){var i=_toPrimitive(t,"string");return"symbol"==_typeof(i)?i:i+""}function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}function _slicedToArray(r,e){return _arrayWithHoles(r)||_iterableToArrayLimit(r,e)||_unsupportedIterableToArray(r,e)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArrayLimit(r,l){var t=null==r?null:"undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(null!=t){var e,n,i,u,a=[],f=!0,o=!1;try{if(i=(t=t.call(r)).next,0===l){if(Object(t)!==t)return;f=!1}else for(;!(f=(e=i.call(t)).done)&&(a.push(e.value),a.length!==l);f=!0);}catch(r){o=!0,n=r}finally{try{if(!f&&null!=t.return&&(u=t.return(),Object(u)!==u))return}finally{if(o)throw n}}return a}}function _arrayWithHoles(r){if(Array.isArray(r))return r}function _createForOfIteratorHelper(r,e){var t="undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(!t){if(Array.isArray(r)||(t=_unsupportedIterableToArray(r))||e&&r&&"number"==typeof r.length){t&&(r=t);var _n=0,F=function F(){};return{s:F,n:function n(){return _n>=r.length?{done:!0}:{done:!1,value:r[_n++]}},e:function e(r){throw r},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,a=!0,u=!1;return{s:function s(){t=t.call(r)},n:function n(){var r=t.next();return a=r.done,r},e:function e(r){u=!0,o=r},f:function f(){try{a||null==t.return||t.return()}finally{if(u)throw o}}}}function _regenerator(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */var e,t,r="function"==typeof Symbol?Symbol:{},n=r.iterator||"@@iterator",o=r.toStringTag||"@@toStringTag";function i(r,n,o,i){var c=n&&n.prototype instanceof Generator?n:Generator,u=Object.create(c.prototype);return _regeneratorDefine2(u,"_invoke",function(r,n,o){var i,c,u,f=0,p=o||[],y=!1,G={p:0,n:0,v:e,a:d,f:d.bind(e,4),d:function d(t,r){return i=t,c=0,u=e,G.n=r,a}};function d(r,n){for(c=r,u=n,t=0;!y&&f&&!o&&t<p.length;t++){var o,i=p[t],d=G.p,l=i[2];r>3?(o=l===n)&&(u=i[(c=i[4])?5:(c=3,3)],i[4]=i[5]=e):i[0]<=d&&((o=r<2&&d<i[1])?(c=0,G.v=n,G.n=i[1]):d<l&&(o=r<3||i[0]>n||n>l)&&(i[4]=r,i[5]=n,G.n=l,c=0))}if(o||r>1)return a;throw y=!0,n}return function(o,p,l){if(f>1)throw TypeError("Generator is already running");for(y&&1===p&&d(p,l),c=p,u=l;(t=c<2?e:u)||!y;){i||(c?c<3?(c>1&&(G.n=-1),d(c,u)):G.n=u:G.v=u);try{if(f=2,i){if(c||(o="next"),t=i[o]){if(!(t=t.call(i,u)))throw TypeError("iterator result is not an object");if(!t.done)return t;u=t.value,c<2&&(c=0)}else 1===c&&(t=i.return)&&t.call(i),c<2&&(u=TypeError("The iterator does not provide a '"+o+"' method"),c=1);i=e}else if((t=(y=G.n<0)?u:r.call(n,G))!==a)break}catch(t){i=e,c=1,u=t}finally{f=1}}return{value:t,done:y}}}(r,o,i),!0),u}var a={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}t=Object.getPrototypeOf;var c=[][n]?t(t([][n]())):(_regeneratorDefine2(t={},n,function(){return this}),t),u=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(c);function f(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,GeneratorFunctionPrototype):(e.__proto__=GeneratorFunctionPrototype,_regeneratorDefine2(e,o,"GeneratorFunction")),e.prototype=Object.create(u),e}return GeneratorFunction.prototype=GeneratorFunctionPrototype,_regeneratorDefine2(u,"constructor",GeneratorFunctionPrototype),_regeneratorDefine2(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName="GeneratorFunction",_regeneratorDefine2(GeneratorFunctionPrototype,o,"GeneratorFunction"),_regeneratorDefine2(u),_regeneratorDefine2(u,o,"Generator"),_regeneratorDefine2(u,n,function(){return this}),_regeneratorDefine2(u,"toString",function(){return"[object Generator]"}),(_regenerator=function _regenerator(){return{w:i,m:f}})()}function _regeneratorDefine2(e,r,n,t){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}_regeneratorDefine2=function _regeneratorDefine(e,r,n,t){function o(r,n){_regeneratorDefine2(e,r,function(e){return this._invoke(r,n,e)})}r?i?i(e,r,{value:n,enumerable:!t,configurable:!t,writable:!t}):e[r]=n:(o("next",0),o("throw",1),o("return",2))},_regeneratorDefine2(e,r,n,t)}function asyncGeneratorStep(n,t,e,r,o,a,c){try{var i=n[a](c),u=i.value}catch(n){return void e(n)}i.done?t(u):Promise.resolve(u).then(r,o)}function _asyncToGenerator(n){return function(){var t=this,e=arguments;return new Promise(function(r,o){var a=n.apply(t,e);function _next(n){asyncGeneratorStep(a,r,o,_next,_throw,"next",n)}function _throw(n){asyncGeneratorStep(a,r,o,_next,_throw,"throw",n)}_next(void 0)})}}function _toConsumableArray(r){return _arrayWithoutHoles(r)||_iterableToArray(r)||_unsupportedIterableToArray(r)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(r,a){if(r){if("string"==typeof r)return _arrayLikeToArray(r,a);var t={}.toString.call(r).slice(8,-1);return"Object"===t&&r.constructor&&(t=r.constructor.name),"Map"===t||"Set"===t?Array.from(r):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?_arrayLikeToArray(r,a):void 0}}function _iterableToArray(r){if("undefined"!=typeof Symbol&&null!=r[Symbol.iterator]||null!=r["@@iterator"])return Array.from(r)}function _arrayWithoutHoles(r){if(Array.isArray(r))return _arrayLikeToArray(r)}function _arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n};// endregion
var EVALUATION_SCOPE_NAMES=[].concat(_toConsumableArray(external_clientnode_.UTILITY_SCOPE_NAMES),["data","error","request","response","stateAPI","stateAPIs"]);var log=/*#__PURE__*/function(){var _log=_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(){var _len,parameters,_key,_args=arguments;return _regenerator().w(function(_context){while(1)switch(_context.n){case 0:for(_len=_args.length,parameters=new Array(_len),_key=0;_key<_len;_key++){parameters[_key]=_args[_key]}return _context.a(2,new Promise(function(resolve,reject){process.stdout.write("".concat(parameters.join(" "),"\n"),function(error){if(error)// eslint-disable-next-line prefer-promise-reject-errors
reject(error);else resolve()})}))}},_callee)}));function log(){return _log.apply(this,arguments)}return log}();var logging={log:log,debug:log,info:log,error:log,warn:log};// region forwarder
var applyStateAPIs=/*#__PURE__*/function(){var _applyStateAPIs=_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(request,response,forwarder){var stateAPIScope,state,_iterator,_step,stateAPI,useStateAPI,index,_iterator2,_step2,_expression,_result,error,_iterator3,_step3,expression,result,_t,_t2,_t3,_t4,_t5;return _regenerator().w(function(_context2){while(1)switch(_context2.p=_context2.n){case 0:stateAPIScope={};_iterator=_createForOfIteratorHelper(forwarder.stateAPIs);_context2.p=1;_iterator.s();case 2:if((_step=_iterator.n()).done){_context2.n=30;break}stateAPI=_step.value;state=stateAPIScope[stateAPI.name]={configuration:stateAPI,error:null,response:null};useStateAPI=false;index=1;_iterator2=_createForOfIteratorHelper(stateAPI.expressions.pre);_context2.p=3;_iterator2.s();case 4:if((_step2=_iterator2.n()).done){_context2.n=9;break}_expression=_step2.value;_result=void 0;try{_result=_expression.apply(void 0,_toConsumableArray(external_clientnode_.UTILITY_SCOPE_VALUES).concat([stateAPI.data,null,request,response,state,stateAPIScope]))}catch(error){void logging.warn("Failed running pre ".concat(String(index),". expression of ")+"state api:",error)}if(!(typeof _result==="number")){_context2.n=5;break}void logging.info("Break request caused by state api","\"".concat(stateAPI.name,"\" with status code ").concat(String(_result),"."));response.statusCode=_result;response.end();return _context2.a(2,{result:false,scope:stateAPIScope});case 5:if(!(_result==="break")){_context2.n=6;break}return _context2.a(3,9);case 6:index+=1;if(!(typeof _result==="boolean")){_context2.n=8;break}if(!_result){_context2.n=7;break}useStateAPI=true;_context2.n=8;break;case 7:return _context2.a(3,9);case 8:_context2.n=4;break;case 9:_context2.n=11;break;case 10:_context2.p=10;_t=_context2.v;_iterator2.e(_t);case 11:_context2.p=11;_iterator2.f();return _context2.f(11);case 12:if(!useStateAPI){_context2.n=29;break}void logging.info("Use state api: \"".concat(stateAPI.name,"\""));error=null;if(stateAPI.urlExpression)try{stateAPI.url=stateAPI.urlExpression.apply(stateAPI,_toConsumableArray(external_clientnode_.UTILITY_SCOPE_VALUES).concat([stateAPI.data,null,request,response,state,stateAPIScope]))}catch(error){void logging.warn("Failed running url expression:",error)}void logging.debug("\nState api configuration is: ".concat((0,external_clientnode_.represent)(stateAPI)));_context2.p=13;_context2.n=14;return fetch(stateAPI.url,stateAPI.options);case 14:state.response=_context2.v;_context2.n=16;break;case 15:_context2.p=15;_t2=_context2.v;error=_t2;void logging.warn("Running state api request for \"".concat(stateAPI.name,"\" throws"),"error:",error);case 16:if(!(state.response&&state.response.headers.has("content-type")&&/application\/json(;.*)?$/.test(state.response.headers.get("content-type")))){_context2.n=20;break}_context2.p=17;_context2.n=18;return state.response.json();case 18:state.response.data=_context2.v;_context2.n=20;break;case 19:_context2.p=19;_t3=_context2.v;error=_t3;void logging.warn("Parsing state api json response for","\"".concat(stateAPI.name,"\" throws error:"),error);case 20:void logging.debug("\nState api response is:",(0,external_clientnode_.represent)(state.response));index=1;_iterator3=_createForOfIteratorHelper(stateAPI.expressions.post);_context2.p=21;_iterator3.s();case 22:if((_step3=_iterator3.n()).done){_context2.n=26;break}expression=_step3.value;result=null;try{result=expression.apply(void 0,_toConsumableArray(external_clientnode_.UTILITY_SCOPE_VALUES).concat([stateAPI.data,error,request,response,state,stateAPIScope]))}catch(error){void logging.warn("Failed running ".concat(String(index),". post ")+"expression of state api:",error)}if(!(typeof result==="number")){_context2.n=23;break}void logging.info("Break request caused by state api","\"".concat(stateAPI.name,"\" with status code ")+"".concat(String(result),"."));response.statusCode=result;response.end();return _context2.a(2,{result:false,scope:stateAPIScope});case 23:if(!(result==="break")){_context2.n=24;break}return _context2.a(3,26);case 24:index+=1;case 25:_context2.n=22;break;case 26:_context2.n=28;break;case 27:_context2.p=27;_t4=_context2.v;_iterator3.e(_t4);case 28:_context2.p=28;_iterator3.f();return _context2.f(28);case 29:_context2.n=2;break;case 30:_context2.n=32;break;case 31:_context2.p=31;_t5=_context2.v;_iterator.e(_t5);case 32:_context2.p=32;_iterator.f();return _context2.f(32);case 33:return _context2.a(2,{result:true,scope:stateAPIScope})}},_callee2,null,[[21,27,28,29],[17,19],[13,15],[3,10,11,12],[1,31,32,33]])}));function applyStateAPIs(_x,_x2,_x3){return _applyStateAPIs.apply(this,arguments)}return applyStateAPIs}();var determineForwarder=function determineForwarder(request,response,forwarders){var _iterator4=_createForOfIteratorHelper(Object.entries(forwarders).sort(function(_ref,_ref2){var _ref3=_slicedToArray(_ref,1),firstName=_ref3[0];var _ref4=_slicedToArray(_ref2,1),secondName=_ref4[0];return firstName.localeCompare(secondName)})),_step4;try{for(_iterator4.s();!(_step4=_iterator4.n()).done;){var _step4$value=_slicedToArray(_step4.value,2),name=_step4$value[0],forwarder=_step4$value[1];var state={configuration:forwarder,error:null,response:null};if(forwarder.useExpression.apply(forwarder,_toConsumableArray(external_clientnode_.UTILITY_SCOPE_VALUES).concat([forwarder,null,request,response,state,_defineProperty({},name,state)]))){void logging.info("Determined forwarder is: \"".concat(name,"\"."));return forwarder}}}catch(err){_iterator4.e(err)}finally{_iterator4.f()}return null};var resolveForwarders=function resolveForwarders(forwarders){var resolvedForwarders={};for(var _i=0,_Object$entries=Object.entries(forwarders);_i<_Object$entries.length;_i++){var _Object$entries$_i=_slicedToArray(_Object$entries[_i],2),name=_Object$entries$_i[0],givenForwarder=_Object$entries$_i[1];if(name!=="base"){var forwarder=(0,external_clientnode_.extend)(true,{name:name},(0,external_clientnode_.modifyObject)((0,external_clientnode_.copy)(forwarders.base),givenForwarder),givenForwarder);// region normalize header transformations
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
var addParsedContentToRequest=function addParsedContentToRequest(bufferedRequest){if(bufferedRequest.headers["content-type"]&&/application\/json(;.*)?$/.test(bufferedRequest.headers["content-type"]))try{var data=Buffer.concat(bufferedRequest.socket.buffer.data).toString();bufferedRequest.socket.buffer.body=data.replace(/^[\s\S]+\s*\n\s*\n\s*([\s\S]+)$/m,"$1");bufferedRequest.socket.buffer.content=JSON.parse(bufferedRequest.socket.buffer.body)}catch(_unused){void logging.warn("Error parsing given request.",bufferedRequest)}};var transformHeaders=function transformHeaders(content,headerTransformations,parameters){var newLinePrinted=false;var _iterator0=_createForOfIteratorHelper(headerTransformations),_step0;try{var _loop2=function _loop2(){var transformation=_step0.value;try{var source=transformation.sourceRun.apply(transformation,_toConsumableArray(parameters));var target=transformation.targetRun.apply(transformation,_toConsumableArray(parameters));if([null,undefined].includes(source)||typeof source==="string"&&source.trim()===""){if([null,undefined].includes(target)||typeof target==="string"&&target.trim()==="")return 1;// continue
// Add new header.
content=content.replace(/(\s*\n)\s*\n\s*/,function(substring,delimiter){for(var _len2=arguments.length,parameters=new Array(_len2>2?_len2-2:0),_key2=2;_key2<_len2;_key2++){parameters[_key2-2]=arguments[_key2]}var result=typeof target==="string"?target:target?target.apply(void 0,[substring,delimiter].concat(parameters)):"";return"".concat(delimiter).concat(result).concat(substring)})}else{if(!newLinePrinted){void logging.debug();newLinePrinted=true}// Search and replace (or remove) header.
void logging.debug("Search for \"".concat(source,"\" and replace with"),"".concat((0,external_clientnode_.represent)(target),"."));if(source)content=content.replace(source,target)}}catch(error){void logging.warn("\nCould not apply header transformation with source "+(transformation.source?(0,external_clientnode_.represent)(transformation.source):"\"add\"")+" and replacement "+(transformation.target?(0,external_clientnode_.represent)(transformation.target):"\"remove\"")+":",error)}};for(_iterator0.s();!(_step0=_iterator0.n()).done;){if(_loop2())continue}}catch(err){_iterator0.e(err)}finally{_iterator0.f()}return content};var reverseProxyBufferedRequest=/*#__PURE__*/function(){var _reverseProxyBufferedRequest=_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(request,response,forwarder,stateAPIScope){return _regenerator().w(function(_context3){while(1)switch(_context3.n){case 0:return _context3.a(2,new Promise(function(resolve,reject){var clientSocket=response.socket;var createConnection=forwarder.tls?__WEBPACK_EXTERNAL_MODULE_tls_connect__:__WEBPACK_EXTERNAL_MODULE_net_createConnection__;var portSuffix=forwarder.tls&&forwarder.port!==443||!forwarder.tls&&forwarder.port!==80?":".concat(String(forwarder.port)):"";var serverSocket=createConnection(_objectSpread({host:forwarder.host,port:forwarder.port},forwarder.tls?{servername:forwarder.host,rejectUnauthorized:false}:{}),function(){void logging.info("\nConnection to: http".concat(forwarder.tls?"s":"","://")+"".concat(forwarder.host).concat(portSuffix," established."))});serverSocket.on("error",function(error){void logging.error("Proxy to server error",error);reject(error)});var parameters=[].concat(_toConsumableArray(external_clientnode_.UTILITY_SCOPE_VALUES),[{clientSocket:clientSocket,serverSocket:serverSocket},null,request,response,null,stateAPIScope]);// Send data from server back to client.
if(forwarder.headerTransformations.retrieve.length){var headerProcessed=false;serverSocket.on("data",function(buffer){if(headerProcessed){clientSocket.write(buffer);return}var content=buffer.toString();void logging.info("\n <=== Got response header from backend:\n\n".concat(content));content=transformHeaders(content,forwarder.headerTransformations.retrieve,parameters);void logging.info("\n <<<< Send response header to client:\n\n".concat(content));clientSocket.write(content);headerProcessed=true;resolve()})}else serverSocket.pipe(clientSocket);serverSocket.on("connect",function(){var headerProcessed=false;var _iterator1=_createForOfIteratorHelper(request.socket.buffer.data),_step1;try{for(_iterator1.s();!(_step1=_iterator1.n()).done;){var buffer=_step1.value;if(!headerProcessed){var content=buffer.toString();void logging.debug("\n ===> Got request header from client:\n\n".concat(content));if(forwarder.tls)// NOTE: TLS support was introduced in version 1.1.
content=content.replace(/HTTP\/1\.0/i,"HTTP/1.1");// Overwrite proxy host with destination one.
content=content.replace(/(($|\n)host: )[^\n]+/i,"$1".concat(forwarder.host).concat(portSuffix));content=transformHeaders(content,forwarder.headerTransformations.send,parameters);void logging.debug("\n >>>> Send request header to backend:\n\n".concat(content));serverSocket.write(content);headerProcessed=true;continue}serverSocket.write(buffer)}}catch(err){_iterator1.e(err)}finally{_iterator1.f()}})}))}},_callee3)}));function reverseProxyBufferedRequest(_x4,_x5,_x6,_x7){return _reverseProxyBufferedRequest.apply(this,arguments)}return reverseProxyBufferedRequest}();/* harmony default export */ const helper = (reverseProxyBufferedRequest);

/***/ }),
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["CLOSE_EVENT_NAMES"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.CLOSE_EVENT_NAMES), ["MAXIMAL_NUMBER_OF_ITERATIONS"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.MAXIMAL_NUMBER_OF_ITERATIONS), ["UTILITY_SCOPE"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.UTILITY_SCOPE), ["UTILITY_SCOPE_NAMES"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.UTILITY_SCOPE_NAMES), ["UTILITY_SCOPE_VALUES"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.UTILITY_SCOPE_VALUES), ["compile"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.compile), ["copy"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.copy), ["evaluateAsyncDynamicData"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.evaluateAsyncDynamicData), ["evaluateDynamicData"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.evaluateDynamicData), ["extend"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.extend), ["importFilesystemAPI"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.importFilesystemAPI), ["isFile"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.isFile), ["modifyObject"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.modifyObject), ["represent"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.represent), ["timeout"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.timeout) });

/***/ }),
/* 2 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var clientnode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var http2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);
/* harmony import */ var _helper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(0);
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7);
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module web-node *//* !
    region header
    [Project page](https://torben.website/webNode)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
function _typeof(o){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach(function(r){_defineProperty(e,r,t[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})}return e}function _defineProperty(e,r,t){return(r=_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function _toPropertyKey(t){var i=_toPrimitive(t,"string");return"symbol"==_typeof(i)?i:i+""}function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}function _createForOfIteratorHelper(r,e){var t="undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(!t){if(Array.isArray(r)||(t=_unsupportedIterableToArray(r))||e&&r&&"number"==typeof r.length){t&&(r=t);var _n=0,F=function F(){};return{s:F,n:function n(){return _n>=r.length?{done:!0}:{done:!1,value:r[_n++]}},e:function e(r){throw r},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,a=!0,u=!1;return{s:function s(){t=t.call(r)},n:function n(){var r=t.next();return a=r.done,r},e:function e(r){u=!0,o=r},f:function f(){try{a||null==t.return||t.return()}finally{if(u)throw o}}}}function _unsupportedIterableToArray(r,a){if(r){if("string"==typeof r)return _arrayLikeToArray(r,a);var t={}.toString.call(r).slice(8,-1);return"Object"===t&&r.constructor&&(t=r.constructor.name),"Map"===t||"Set"===t?Array.from(r):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?_arrayLikeToArray(r,a):void 0}}function _arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n}function _regenerator(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */var e,t,r="function"==typeof Symbol?Symbol:{},n=r.iterator||"@@iterator",o=r.toStringTag||"@@toStringTag";function i(r,n,o,i){var c=n&&n.prototype instanceof Generator?n:Generator,u=Object.create(c.prototype);return _regeneratorDefine2(u,"_invoke",function(r,n,o){var i,c,u,f=0,p=o||[],y=!1,G={p:0,n:0,v:e,a:d,f:d.bind(e,4),d:function d(t,r){return i=t,c=0,u=e,G.n=r,a}};function d(r,n){for(c=r,u=n,t=0;!y&&f&&!o&&t<p.length;t++){var o,i=p[t],d=G.p,l=i[2];r>3?(o=l===n)&&(u=i[(c=i[4])?5:(c=3,3)],i[4]=i[5]=e):i[0]<=d&&((o=r<2&&d<i[1])?(c=0,G.v=n,G.n=i[1]):d<l&&(o=r<3||i[0]>n||n>l)&&(i[4]=r,i[5]=n,G.n=l,c=0))}if(o||r>1)return a;throw y=!0,n}return function(o,p,l){if(f>1)throw TypeError("Generator is already running");for(y&&1===p&&d(p,l),c=p,u=l;(t=c<2?e:u)||!y;){i||(c?c<3?(c>1&&(G.n=-1),d(c,u)):G.n=u:G.v=u);try{if(f=2,i){if(c||(o="next"),t=i[o]){if(!(t=t.call(i,u)))throw TypeError("iterator result is not an object");if(!t.done)return t;u=t.value,c<2&&(c=0)}else 1===c&&(t=i.return)&&t.call(i),c<2&&(u=TypeError("The iterator does not provide a '"+o+"' method"),c=1);i=e}else if((t=(y=G.n<0)?u:r.call(n,G))!==a)break}catch(t){i=e,c=1,u=t}finally{f=1}}return{value:t,done:y}}}(r,o,i),!0),u}var a={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}t=Object.getPrototypeOf;var c=[][n]?t(t([][n]())):(_regeneratorDefine2(t={},n,function(){return this}),t),u=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(c);function f(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,GeneratorFunctionPrototype):(e.__proto__=GeneratorFunctionPrototype,_regeneratorDefine2(e,o,"GeneratorFunction")),e.prototype=Object.create(u),e}return GeneratorFunction.prototype=GeneratorFunctionPrototype,_regeneratorDefine2(u,"constructor",GeneratorFunctionPrototype),_regeneratorDefine2(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName="GeneratorFunction",_regeneratorDefine2(GeneratorFunctionPrototype,o,"GeneratorFunction"),_regeneratorDefine2(u),_regeneratorDefine2(u,o,"Generator"),_regeneratorDefine2(u,n,function(){return this}),_regeneratorDefine2(u,"toString",function(){return"[object Generator]"}),(_regenerator=function _regenerator(){return{w:i,m:f}})()}function _regeneratorDefine2(e,r,n,t){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}_regeneratorDefine2=function _regeneratorDefine(e,r,n,t){function o(r,n){_regeneratorDefine2(e,r,function(e){return this._invoke(r,n,e)})}r?i?i(e,r,{value:n,enumerable:!t,configurable:!t,writable:!t}):e[r]=n:(o("next",0),o("throw",1),o("return",2))},_regeneratorDefine2(e,r,n,t)}function asyncGeneratorStep(n,t,e,r,o,a,c){try{var i=n[a](c),u=i.value}catch(n){return void e(n)}i.done?t(u):Promise.resolve(u).then(r,o)}function _asyncToGenerator(n){return function(){var t=this,e=arguments;return new Promise(function(r,o){var a=n.apply(t,e);function _next(n){asyncGeneratorStep(a,r,o,_next,_throw,"next",n)}function _throw(n){asyncGeneratorStep(a,r,o,_next,_throw,"throw",n)}_next(void 0)})}}// NOTE: http2 compatibility mode does work for unencrypted connections yet.
;// endregion
await (0,clientnode__WEBPACK_IMPORTED_MODULE_0__.importFilesystemAPI)();// region live cycle methods
var onIncomingMessage=function onIncomingMessage(request,response){var bufferedRequest=request;void _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(){var iteration,forwarder,_yield$applyStateAPIs,result,scope,_t;return _regenerator().w(function(_context){while(1)switch(_context.p=_context.n){case 0:// TODO integrate into clientnode's logging lib
void _helper_js__WEBPACK_IMPORTED_MODULE_4__/* .logging */ .m9.info("|".concat("-".repeat(80-2),"|\nStart processing"),"".concat(bufferedRequest.method," request: ").concat(bufferedRequest.url,"\n")+bufferedRequest);// NOTE: We have to wait until client request is fully buffered.
iteration=0;case 1:if(!(iteration<clientnode__WEBPACK_IMPORTED_MODULE_0__.MAXIMAL_NUMBER_OF_ITERATIONS.value*1000)){_context.n=4;break}_context.n=2;return (0,clientnode__WEBPACK_IMPORTED_MODULE_0__.timeout)();case 2:if(!bufferedRequest.socket.buffer.finished){_context.n=3;break}return _context.a(3,4);case 3:iteration++;_context.n=1;break;case 4:if(CONFIGURATION.parseBody)(0,_helper_js__WEBPACK_IMPORTED_MODULE_4__/* .addParsedContentToRequest */ .Ko)(bufferedRequest);forwarder=(0,_helper_js__WEBPACK_IMPORTED_MODULE_4__/* .determineForwarder */ .cP)(bufferedRequest,response,FORWARDERS);if(!(forwarder===null)){_context.n=5;break}void _helper_js__WEBPACK_IMPORTED_MODULE_4__/* .logging */ .m9.error("No forwarder found for given request:",bufferedRequest);response.statusCode=502;response.end();return _context.a(2);case 5:_context.p=5;_context.n=6;return (0,_helper_js__WEBPACK_IMPORTED_MODULE_4__/* .applyStateAPIs */ .BE)(bufferedRequest,response,forwarder);case 6:_yield$applyStateAPIs=_context.v;result=_yield$applyStateAPIs.result;scope=_yield$applyStateAPIs.scope;if(!result){_context.n=7;break}_context.n=7;return (0,_helper_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Ay)(bufferedRequest,response,forwarder,scope);case 7:_context.n=9;break;case 8:_context.p=8;_t=_context.v;void _helper_js__WEBPACK_IMPORTED_MODULE_4__/* .logging */ .m9.error(_t);case 9:void _helper_js__WEBPACK_IMPORTED_MODULE_4__/* .logging */ .m9.info("\nEnd processing","".concat(bufferedRequest.method," request: ").concat(bufferedRequest.url,"\n")+"".concat(bufferedRequest,"|").concat("-".repeat(80-2),"|"));case 10:return _context.a(2)}},_callee,null,[[5,8]])}))()};var onIncomingStream=function onIncomingStream(stream,headers){void _helper_js__WEBPACK_IMPORTED_MODULE_4__/* .logging */ .m9.info("Got stream",stream,headers)};// endregion
// region configuration
var BASE_CONFIGURATION=_package_json__WEBPACK_IMPORTED_MODULE_5__/* .configuration */ .HF;var _iterator=_createForOfIteratorHelper(["configuration.json","secure-configuration.json"]),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){var path=_step.value;var configurationPath=(0,path__WEBPACK_IMPORTED_MODULE_3__.resolve)(process.cwd(),path);if(await (0,clientnode__WEBPACK_IMPORTED_MODULE_0__.isFile)(configurationPath)){var configuration=await __webpack_require__(6)(configurationPath);(0,clientnode__WEBPACK_IMPORTED_MODULE_0__.extend)(true,(0,clientnode__WEBPACK_IMPORTED_MODULE_0__.modifyObject)(BASE_CONFIGURATION,configuration),configuration)}}}catch(err){_iterator.e(err)}finally{_iterator.f()}var evaluationOptions={scope:_objectSpread(_objectSpread({},clientnode__WEBPACK_IMPORTED_MODULE_0__.UTILITY_SCOPE),{},{configuration:BASE_CONFIGURATION,environment:process.env})};var CONFIGURATION=await (0,clientnode__WEBPACK_IMPORTED_MODULE_0__.evaluateAsyncDynamicData)((0,clientnode__WEBPACK_IMPORTED_MODULE_0__.evaluateDynamicData)(BASE_CONFIGURATION,evaluationOptions),evaluationOptions);var FORWARDERS=(0,_helper_js__WEBPACK_IMPORTED_MODULE_4__/* .resolveForwarders */ .cx)(CONFIGURATION.forwarders);// endregion
// region initialize server
var server={instance:CONFIGURATION.publicKeyPath&&CONFIGURATION.privateKeyPath?(0,http2__WEBPACK_IMPORTED_MODULE_2__.createSecureServer)(CONFIGURATION.nodeServerOptions,onIncomingMessage):// NOTE: See import notice.
(0,http__WEBPACK_IMPORTED_MODULE_1__.createServer)(onIncomingMessage),streams:[],sockets:[],start:function start(){server.instance.listen(CONFIGURATION.port,function(){void _helper_js__WEBPACK_IMPORTED_MODULE_4__/* .logging */ .m9.info("Listen on port ".concat(String(CONFIGURATION.port)," for ")+"incoming requests.")})},stop:function stop(){server.instance.close(function(){void _helper_js__WEBPACK_IMPORTED_MODULE_4__/* .logging */ .m9.info("Shut server down.")});for(var _i=0,_arr=[server.sockets,server.streams];_i<_arr.length;_i++){var connections=_arr[_i];if(Array.isArray(connections)){var _iterator2=_createForOfIteratorHelper(connections),_step2;try{for(_iterator2.s();!(_step2=_iterator2.n()).done;){var connection=_step2.value;connection.destroy()}}catch(err){_iterator2.e(err)}finally{_iterator2.f()}}}}};server.instance.on("connection",function(socket){server.sockets.push(socket);socket.buffer={data:[],finished:false};socket.on("data",function(data){socket.buffer.data.push(data)});for(var _i2=0,_arr2=["done","finish","writableEnded","writableFinished"];_i2<_arr2.length;_i2++){var name=_arr2[_i2];socket.on(name,function(){socket.buffer.finished=true})}/*
            NOTE: Workaround since none of the events above trigger before
            responding to client occurred.
        */void (0,clientnode__WEBPACK_IMPORTED_MODULE_0__.timeout)(function(){socket.buffer.finished=true});socket.on("close",function(){socket.buffer.finished=true;server.sockets.splice(server.sockets.indexOf(socket),1)})});server.instance.on("stream",function(stream,headers){server.streams.push(stream);onIncomingStream(stream,headers);stream.on("close",function(){server.streams.splice(server.streams.indexOf(stream),1)})});// endregion
// region start / stop
if(import.meta.main){void _helper_js__WEBPACK_IMPORTED_MODULE_4__/* .logging */ .m9.info("Start server with configuration:",(0,clientnode__WEBPACK_IMPORTED_MODULE_0__.represent)(CONFIGURATION));void _helper_js__WEBPACK_IMPORTED_MODULE_4__/* .logging */ .m9.debug("Apply resolved forwarder:",(0,clientnode__WEBPACK_IMPORTED_MODULE_0__.represent)(FORWARDERS));server.start();var _iterator3=_createForOfIteratorHelper(clientnode__WEBPACK_IMPORTED_MODULE_0__.CLOSE_EVENT_NAMES),_step3;try{var _loop=function _loop(){var name=_step3.value;process.on(name,function(){void _helper_js__WEBPACK_IMPORTED_MODULE_4__/* .logging */ .m9.info("\nGot \"".concat(name,"\" signal: stopping server."));server.stop()})};for(_iterator3.s();!(_step3=_iterator3.n()).done;){_loop()}}catch(err){_iterator3.e(err)}finally{_iterator3.f()}}// endregion
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (server);
/* harmony export */ __webpack_require__.d(__webpack_exports__, [
/* harmony export */   "A", 0, __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ ]);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["createServer"]: () => (__WEBPACK_EXTERNAL_MODULE_http__.createServer) });

/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["createSecureServer"]: () => (__WEBPACK_EXTERNAL_MODULE_http2__.createSecureServer) });

/***/ }),
/* 5 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["resolve"]: () => (__WEBPACK_EXTERNAL_MODULE_path__.resolve) });

/***/ }),
/* 6 */
/***/ ((module) => {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(() => {
	const e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
});
}
webpackEmptyAsyncContext.keys = () => ([]);
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 6;
module.exports = webpackEmptyAsyncContext;

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"HF":{"forwarders":{"base":{"headerTransformations":{"retrieve":[],"send":[]},"host":"localhost","port":443,"stateAPIs":[{"data":{},"expressions":{"post":"true","pre":"false"},"name":"base","options":{},"url":""}],"tls":true,"useExpression":"true"}},"host":"localhost","nodeServerOptions":{"allowHTTP1":true},"parseBody":false,"port":8080,"privateKeyPath":"","publicKeyPath":""}}');

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
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	const webpackQueues = Symbol("webpack queues");
/******/ 	const webpackExports = Symbol("webpack exports");
/******/ 	const webpackError = Symbol("webpack error");
/******/ 	
/******/ 	const resolveQueue = (queue) => {
/******/ 		if(queue?.d < 1) {
/******/ 			queue.d = 1;
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	const wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 	
/******/ 			if(dep[webpackQueues]) return dep;
/******/ 			if(dep.then) {
/******/ 				const queue = [];
/******/ 				queue.d = 0;
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					resolveQueue(queue);
/******/ 				}, (e) => {
/******/ 					obj[webpackError] = e;
/******/ 					resolveQueue(queue);
/******/ 				});
/******/ 				const obj = {};
/******/ 	
/******/ 				obj[webpackQueues] = (fn) => (fn(queue));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		const ret = {};
/******/ 		ret[webpackQueues] = x => {};
/******/ 		ret[webpackExports] = dep;
/******/ 		return ret;
/******/ 	}));
/******/ 	__webpack_require__.a = (module, body, hasAwait) => {
/******/ 		let queue;
/******/ 		hasAwait && ((queue = []).d = -1);
/******/ 		const depQueues = new Set();
/******/ 		const exports = module.exports;
/******/ 		let currentDeps;
/******/ 		let outerResolve;
/******/ 		let reject;
/******/ 		const promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = resolve;
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 		module.exports = promise;
/******/ 		const handle = (deps) => {
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			let fn;
/******/ 			const getResult = () => (currentDeps.map((d) => {
/******/ 	
/******/ 				if(d[webpackError]) throw d[webpackError];
/******/ 				return d[webpackExports];
/******/ 			}))
/******/ 			const promise = new Promise((resolve) => {
/******/ 				fn = () => (resolve(getResult));
/******/ 				fn.r = 0;
/******/ 				const fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 				currentDeps.forEach((dep) => (dep[webpackQueues](fnQueue)));
/******/ 			});
/******/ 			return fn.r ? promise : getResult();
/******/ 		}
/******/ 		const done = (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue))
/******/ 	
/******/ 		body(handle, done);
/******/ 		queue?.d < 0 && (queue.d = 0);
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ // define getter/value functions for harmony exports
/******/ __webpack_require__.d = (exports, definition) => {
/******/ 	if(Array.isArray(definition)) {
/******/ 		var i = 0;
/******/ 		while(i < definition.length) {
/******/ 			var key = definition[i++];
/******/ 			var binding = definition[i++];
/******/ 			var descriptor = binding === 0 ? { enumerable: true, value: definition[i++] } : { enumerable: true, get: binding };
/******/ 			if(!__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, descriptor);
/******/ 		}
/******/ 	} else {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	}
/******/ };
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ let __webpack_exports__ = __webpack_require__(2);
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ const __webpack_exports__default = __webpack_exports__.A;
/******/ export { __webpack_exports__default as default };
/******/ 
