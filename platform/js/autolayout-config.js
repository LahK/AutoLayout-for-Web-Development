'use strict';
define(["require"], function(require) {
	var Config = {
		enableStyles: {
			"Screen": {
				"style": {
					"Height": "height",
					"Bg-Color": "background-color"
				}
			},
			"Label": {
				"style": {
					"Z-Index": "z-index",
					"Font": "font-family",
					"FontSize": "font-size",
					"Width": "width",
					"Height": "height",
					"Left": "left",
					"Top": "top",
					"Padding": "padding",
					"Border": "border",
					"Bd-Radius": "border-radius",
					"Bg-Color": "background-color"
				},
				"data": {
					"Text": "al-text"
				}


			},
			"Button": {
				"style": {
					"Z-Index": "z-index",
					"FontSize": "font-size",
					"Font": "font-family",
					"Width": "width",
					"Height": "height",
					"Left": "left",
					"Top": "top",
					"Padding": "padding",
					"Border": "border",
					"Bd-Radius": "border-radius",
					"Bg-Color": "background-color"
				},
				"data": {
					"Text": "al-text"
				}


			},
			"Image": {
				"style": {
					"Z-Index": "z-index",
					"Width": "width",
					"Height": "height",
					"Left": "left",
					"Top": "top",
					"Border": "border",
					"Bd-Radius": "border-radius",
					"Image-Url": "background-image",
					"Image-Pos": "background-position",
					"Image-Size": "background-size"
				},
				"data": {}
			},
			"View": {
				"style": {
					"Z-Index": "z-index",
					"Width": "width",
					"Height": "height",
					"Left": "left",
					"Top": "top",
					"Padding": "padding",
					"Border": "border",
					"Bd-Radius": "border-radius",
					"Bg-Color": "background-color"
				},
				"data": {}
			}
		},
		enableConstraints:{
			"Single":{

				"Shape":{
					"Width":"width",
					"Height":"height"
				},

				"Margins":{
					"Margin Left":"margin-left",
					"Margin Right":"margin-right",
					"Margin Top":"margin-top",
					"Margin Botton":"margin-bottom"
				},

				"Aligments":{
					"Herizontal in Box":"herizontal-in-box",
					"Vertically in Box":"vertically-in-box"
				}
			},
			"Multiple":{
				"Shape":{
					"Width":"width",
					"Height":"height",
				},

				"Relative Position":{
					"Leading Edges":"leading-edges",
					"Trailing Edges":"traling-edges",
					"Top Edges":"top-edges",
					"Botton Edges":"bottom-edges"
				},
				
				"Aligments":{
					"Horizontal":"horizontal",
					"Vertically":"Vertically",
					"Herizontal in Box":"herizontal-in-box",
					"Vertically in Box":"vertically-in-box"
				}
			}
		}
	}

	return Config;
})
