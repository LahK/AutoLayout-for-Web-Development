// root object of AutoLayout
var AutoLayout = {};

// Objects in AutoLayout
AutoLayout.initview = {};
AutoLayout.updateview = {};
AutoLayout.Screen = {};

AutoLayout.Button = {};
console.log(AutoLayout.Button);

Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};