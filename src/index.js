/**
* 2019-08-08 17:25
* author: huaijiangtao@sogou-inc.com
* 大前端JSbridge-H5&native 交互桥梁
*
*/
(function(name, initFunction) {
    // 检测上下文环境是否为AMD或CMD
    var hasDefine = typeof define === 'function',
        // 检查上下文环境是否为Node
        hasExports = typeof module !== 'undefined' && module.exports;

    if (hasDefine) {
        // AMD环境或CMD环境
        define(initFunction);
    } else if (hasExports) {
        // 定义为普通Node模块
        module.exports = initFunction();
    } else {
        // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
        this[name] = initFunction();
    }
})('_SG_BFO_callNativeMethod_', function() {
    // 缓存客户端方法调用类
    var semobJSBridge = window.semobJSBridge;

    if (!semobJSBridge) {
        // 客户端方法调用类不存在，报错
        console.warn('[Error]:检测不到客户端类semobJSBridge。');
        return;
    }
    // 初始化callbackId
    var nextCallbackId = new Date().getTime() % (1000 * 60 * 60 * 24) * 10000;
    function getCallbackId() {
        return (nextCallbackId++).toString();
    }

    // 初始化callbackMap，缓存H5请求方法的callback
    var callbackMap = {};

    /**
     * 暴露给业务端，用来调用客户端的方法
     * @param {String} methodName 客户端接口名称
     * @param {Object} params 接口请求参数
     * @param {Function} callback 回调函数
     */
    var _SG_BFO_callNativeMethod_ = function(methodName, params, callback) {
        var callbackID = '';
        params = params || '';
        if (typeof params === 'function') {
            // 调用的接口，无需请求参数时，传递给客户端params需设为默认值-空字符串
            callback = params;
            params = '';// !!important
        } else if (Object.prototype.toString.call(params) === '[object Object]') {
            // 调用的接口需要请求参数时，必须为Object，然后包装为JSON String
            params = JSON.stringify(params);
        } else if (params) {
            // 除以上两种情况外，params是其他类型都是错误的
            console.error('[Error]_SG_BFO_callNativeMethod_:参数格式应为(methodName, params, callback)，params应为Object或可省略不传。');
        }

        if (callback && typeof callback !== 'function') {
            //callback 存在，但不是一个Function
            console.error('[Error]_SG_BFO_callNativeMethod_:参数格式应为(methodName, params, callback)，params和callback为可选参数。');
        } else {
            // 无callback时赋默认值 
            callback = callback || function() { }
        }

        if (!semobJSBridge) {
            // 客户端方法调用类不存在，报错
            console.error('[Error]_SG_BFO_callNativeMethod_:检测不到客户端类semobJSBridge。');
        } else if (typeof semobJSBridge.callNativeMethod === 'function') {
            // 当存在JS调用客户端的方法时，正常调用客户端
            callbackID = getCallbackId();
            callbackMap[callbackID] = callback;
            semobJSBridge.callNativeMethod(methodName, params, callbackID);
        } else if (semobJSBridge.callNativeMethod) {
            // 当不存在JS调用客户端的方法时，报错
            console.error('[Error]_SG_BFO_callNativeMethod_:semobJSBridge.callNativeMethod不是一个Function。');
        } else {
            // 当不存在JS调用客户端的方法或不是一个方法时，报错
            console.error('[Error]_SG_BFO_callNativeMethod_:semobJSBridge.callNativeMethod不存在。');
        }
    }

    /**
     * 在客户端的方法调用类上注册供客户端回调JS的通用方法
     * @param {String} callbackID 回调方法ID
     * @param {int} code JsBridge API 调用状态CODE
     * @param {String} message 错误信息
     * @param {String} data 接口返回数据，JSON String
     */
    function callJSCallback(callbackID, code, message, data) {
        if (callbackID) {
            var callback = callbackMap[callbackID];
            if (callback) {
                // 回调方法存在，正常执行；回调方法不存在，忽略即可
                callback({
                    code: code,
                    message: message || '',
                    data: decodeURIComponent(data || '')
                });
                callback = null;
                // 回调方法执行完成后，删除回调方法缓存
                delete callbackMap[callbackID];
            }
        }
    }
    // 将方法注册在客户端类上，供客户端回调JS传递返回值
    semobJSBridge && (semobJSBridge.callJSCallback = callJSCallback);
    return _SG_BFO_callNativeMethod_;
})