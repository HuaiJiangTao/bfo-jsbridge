## 背景说明
1. 项目为设计的JSbridge方案中的JS SDK部分；
2. 目的：统一H5页面与Native客户端交互形式；
3. 完整的JSbridge包含本JS代码和客户端SDK代码两部分。


## 目录结构

```
├── dist // 打包压缩后文件目录
│   └── jsbridge.js // 压缩后文件
│
├── src // 原代码目录
│   └──index.js // 原代码入口目录
│
├── index.js // 入口文件
```

## Commands

### npm run build 

本地构建，在根目录`dist`下生成打包压缩文件`jsbridge.js`

## JS SDK接口文档说明
JS SDK会暴露一个名为`_SG_BFO_callNativeMethod_`的方法，供H5页面调用客户端。

#### 方法
`_SG_BFO_callNativeMethod_(methodName, params, callback)`

#### 参数
该方法接受3个参数：`methodName` `params` `callback`

##### methodName
`必要参数` `String`
H5调用客户端的方法名，业务双端`客户端与H5`开发约定。
##### params
`非必要参数` `JSON`
业务双端约定的`methodName`调用时所需的请求参数，格式为`JSON`；无请求参数时，省略不传。
##### callback
`非必要参数` `Function`
业务双端约定的`methodName`需要回调时，需传递一个类型为`Function`的参数；无需回调时，省略不传。

#### 示例
根据以上文档，我们可以明确存在以下调用形式：

##### 1. 有请求参数，需要回调
```
window._SG_BFO_callNativeMethod_('doSomeThing', { 
        paramA: 1, 
        param: 'text' 
    }, function(data){ 
        console.log(data); 
    }
)
```

##### 2. 有请求参数，无需回调
```
window._SG_BFO_callNativeMethod_('doSomeThingWithParams', { 
        paramA: 1, 
        param: 'text' 
    }
)
```

##### 3. 无请求参数，需要回调
```
window._SG_BFO_callNativeMethod_('doSomeThingWithCallback', function(data){ 
        console.log(data);
    }
)
```

##### 4. 无请求参数，无需回调
```
window._SG_BFO_callNativeMethod_('doSomethingWithoutParamsAndCallback')
```
#### 回调返回值


| 字段名  |  数据类型 | 含义  |
| ---------- | :-----------:  | :-----------: |
| code | Number | 接口调用状态 0:成功 | 
| data | Any | 业务接口返回值，取决于业务 | 
| message | String | 接口调用说明 |

