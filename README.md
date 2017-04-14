# LDMap - 基于openlayers3.20 的地图组件SDK


## 示例

  [公交](https://wakegiser.github.io/LDMap/examples/bus.html)

  [自驾](https://wakegiser.github.io/LDMap/examples/car.html)


## 相关文档
  [API 参考](https://github.com/wakeGISer/LDMap/blob/master/src/API.md)
  
## 支持环境
 ldMap 以来ol3 使用canvas开发，支持现在被称为“现代”浏览器, 通常兼容除了IE8及IE以下版本的其他大部分浏览器。
 
## 注意事项

本SDK 依赖openlayer3.20.1，故必须先引用openlayers的js和css
 
## 安装使用

你可以直接加载在线版本最新的js脚本文件 和 css 文件。如:

`<script src="https://wakegiser.github.io/LDMap/dist/ldMap.js"></script>`

`<link rel="stylesheet" href="https://wakegiser.github.io/LDMap/assets/css/ldMap.css">`


## 安装使用

如果你想改动源码，请fork一个分支然后pr

- 初始化环境
先下载package.json需要的的 包

`npm install` 

- 开发

`npm run watch`

- 发布

`npm run pubnish`
