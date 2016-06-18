var a = {};
var b = {};

// AutoLayout.initview.call({},"Button", "123");
// AutoLayout.initview.call({},"View", "123");
AutoLayout.initview.clone()("Image", "13");
AutoLayout.initview.clone()("Label", "133");

var img = document.getElementById("M-13");
// console.log(img);
// AutoLayout.updateview(img)
AutoLayout.updateview(img);

var lbl = document.getElementById("M-133");
AutoLayout.updateview(lbl);