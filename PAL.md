# Programmatical AutoLayout (PAL)

  另一个思路是，一下描述的编程式作为我们 js 读取 json 文件的逻辑。
  而编写页面通过 json 描述文件来完成。按照标准格式，写好 objects 对象和 constraints 对象，然后由 js 部分来读取生成页面。

## 编程式，无图形界面

- 画板对象： board
- 组件类：ALView, ALLabel, ALImage, ALButton
- 方法：
  - function addSubview(subview) // 添加子视图, 将一个组件添加到画板
  - function addConstraint(view, attribute, relatedBy, toView, toViewAttribute, multiplier, constant) // 添加约束
  - function generate() // 生成 HTML 文件
- 其他说明：
  暂时不考虑给视图添加子视图，只能给画板添加子视图

## 示例
```
// 创建视图
var messageView = ALView();
var avatarImage = ALImage();
var nameLbl = ALLabel();
var contentLbl = ALLabel();

messageView.bgColor = "#cccccc"
nameLbl.text = "MY NAME";
contentLbl.text = "Hi, I want to add you as Facebook Friend."

// 将视图加入画板
addSubview(messageView);
addSubview(avatarImage);
addSubview(nameLbl);
addSubview(contentLbl);

// 设置约束
addConstraint(messageView, "top", "equal", board, "top", 1, 0); // msgView 和画板上边对齐
addConstraint(messageView, "leading", "equal", board, "leading", 1, 0); // msgView 和画板左边对齐
addConstraint(messageView, "trailing", "equal", board, "trailing", 1, 0); // msgView 和画板右边对齐
addConstraint(messageView, "height", "equal", null, null, null, 80); // 设置 msgView 的高为 200

addConstraint(avatarImage, "height", "equal", null, null, null, 50); // 设置 avatarImage 的高为 30
addConstraint(avatarImage, "width", "equal", null, null, null, 50); // 设置宽为 30
addConstraint(avatarImage, "centerY", "equal", messageView, "centerY", 1, 0); // avatarImage 竖直中线与 msgView 竖直中线对齐（即 avatarView 在 msgView 中竖直居中）
addConstraint(avatarImage, "leading", "equal", messageView, "leading", 1, 8); // avatarImage 和 msgView 左边对齐

addConstraint(nameLbl, "top", "equal", board, "top", 1, 8); 
addConstraint(nameLbl, "leading", "equal", avatarImage, "trailing", 1, 8); 
addConstraint(nameLbl, "trailing", "equal", board, "trailing", 1, -8); 
addConstraint(nameLbl, "height", "equal", null, null, null, 20);

addConstraint(contentLbl, "top", "equal", nameLbl, "bottom", 1, 8); 
addConstraint(contentLbl, "leading", "equal", avatarImage, "trailing", 1, 8); 
addConstraint(contentLbl, "trailing", "equal", board, "trailing", 1, -8); 
addConstraint(contentLbl, "bottom", "equal", board, "bottom", 1, 0); 
addConstraint(nameLbl, "top", "equal", board, "top", 1, 10); 
addConstraint(nameLbl, "top", "equal", board, "top", 1, 10); 
addConstraint(nameLbl, "top", "equal", board, "top", 1, 10); 

generate()
```
![](https://raw.githubusercontent.com/LahK/AutoLayout-for-Web-Development/master/GeneratedView.JPG)
