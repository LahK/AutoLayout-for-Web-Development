# 生成 JSON 文件

- 遍历画板中对象数组
- 读取 al-type，读取对应配置参数（包含父元素属性、mask 元素属性和 resize-btn 元素属性）
- 遍历父元素属性数组（包含自定义属性 al-xxxx，原生属性），读取并添加到 json 数组
- 遍历 mask 元素属性数组，读取并添加到 json 数组
- 遍历 resize-btn 元素属性，读取并添加到 json 数组
- 

```
[
	{
		"al-id": "XXX",
		"al-type": "XXXX",
		"father": {
			"al": {
				"al-height": xxx,
				...
			},
			"or": {
				"background-color": #eee,
				...
			}
		},
		"mask": {
			"al": {
				"al-height": xxx,
				...
			},
			"or": {
				"background-color": #eee,
				...
			}
		},
		"resize-btn": {
			"al": {
				"al-height": xxx,
				...
			},
			"or": {
				"background-color": #eee,
				...
			}
		}
	}
]
```
