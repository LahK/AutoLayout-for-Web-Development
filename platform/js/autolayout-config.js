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
                    "Bd-radius": "border-radius",
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
                    "Bd-radius": "border-radius",
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
                    "Bd-radius": "border-radius",
                    "Image-url": "background-image",
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
                    "Bd-radius": "border-radius",
                    "Bg-Color": "background-color"
                },
                "data": {}
            }
        },
        enableConstraints:{
            "WithCanvas":["Center"],
            "WithObject":[]
        }
    }

    return Config;
})
