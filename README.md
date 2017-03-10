# AutoLayout-for-Web-Development
A tool for web developers to fast set website UI using Xcode-like-AutoLayout.

## Anchors

1. [相关链接](#related-links)
2. [建议阅读文章列表](#reading-list)
3. [建议观看视频列表](#watching-list)
4. [其它有用链接](#useful-links)
5. [项目思路、设计整理](#project-design)
6. [成员笔记](#notes-for-members)

## Related Links

- [野狗](https://www.wilddog.com/)
- [脑图](http://naotu.baidu.com/file/0df7e13496239b2a408d2c39e34529bb?token=074797cde5554e91)


## Reading List

*About Namespacing*
- [Namespacing in JavaScript](https://javascriptweblog.wordpress.com/2010/12/07/namespacing-in-javascript/)
- [【译】JavaScript 中的命名空间(Namespacing in JavaScript)](http://chengkang.me/2016/06/21/Namespacing%20in%20JavaScript/)
- [JavaScript Namespacing](http://peter.michaux.ca/articles/javascript-namespacing)
- [【译】JavaScript 命名空间](http://chengkang.me/2016/06/28/javascript-namespace-by-michaux/)
- [My Favorite JavaScript Design Pattern](https://www.sitepoint.com/my-favorite-javascript-design-pattern/)
- [【译】我最喜欢的 JavaScript 设计模式](http://chengkang.me/2016/07/02/my-favorite-javascript-pattern/)

## Watching List

*About Gulp*
- [Learning Gulp](https://www.youtube.com/playlist?list=PLLnpHn493BHE2RsdyUNpbiVn-cfuV7Fos)
- [Website Performance Tutorial](https://www.youtube.com/watch?v=aD94FQ-WsIg&list=PLLnpHn493BHGpGXukqYsxwQw3ziW3uti6)


## Useful Links
- [drag: DataTransfer](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer)
- [Browser Window Size in JavaScript](http://www.javascripter.net/faq/browserw.htm)
- [Key Values](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/key/Key_Values)

## Project Design
- [全部文件](https://github.com/LahK/AutoLayout-for-Web-Development/tree/master/design-docs)
- [数据结构设计.md](https://github.com/LahK/AutoLayout-for-Web-Development/blob/master/design-docs/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E8%AE%BE%E8%AE%A1.md)
- [添加边距约束逻辑.md](https://github.com/LahK/AutoLayout-for-Web-Development/blob/master/design-docs/%E6%B7%BB%E5%8A%A0%E8%BE%B9%E8%B7%9D%E7%BA%A6%E6%9D%9F%E9%80%BB%E8%BE%91%E8%AE%BE%E8%AE%A1.md)
- [移动元素逻辑思路.md](https://github.com/LahK/AutoLayout-for-Web-Development/blob/master/design-docs/%E7%A7%BB%E5%8A%A8%E5%85%83%E7%B4%A0%E9%80%BB%E8%BE%91%E6%80%9D%E8%B7%AF.md)
- [如何生成 JSON 文件.md](https://github.com/LahK/AutoLayout-for-Web-Development/blob/master/design-docs/%E5%A6%82%E4%BD%95%E7%94%9F%E6%88%90%20JSON%20%E6%96%87%E4%BB%B6.md)
	
## Notes for members
### 2017.03.09
1. 将组件文字居中实现方法由~~通过 `lineHeight` 设置~~ 改为**通过 `flex` 设置**。
2. 结合 `Vue.js` 重构 Platform。

### 未知时间:
1. 修复了多选时不能取消选择的bug
2. 修复了编辑器生成的bug
3. 对单Object的约束作了输入框的动态更新和与json的数值绑定。但是由于json还没有做，因此只写了逻辑伪代码。
4. 下一步要需要实现json的生成、单约束的计算、多约束的更新、多约束的计算。
