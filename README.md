# AutoLayout-for-Web-Development
A tool for web developers to fast set website UI using Xcode-like-AutoLayout.


## Related Links

- [野狗](https://www.wilddog.com/)
- [脑图](http://naotu.baidu.com/file/0df7e13496239b2a408d2c39e34529bb?token=074797cde5554e91)


## Reading List

### About Namespacing
- [Namespacing in JavaScript](https://javascriptweblog.wordpress.com/2010/12/07/namespacing-in-javascript/)
- [【译】JavaScript 中的命名空间(Namespacing in JavaScript)](http://chengkang.me/2016/06/21/Namespacing%20in%20JavaScript/)
- [JavaScript Namespacing](http://peter.michaux.ca/articles/javascript-namespacing)
- [My Favorite JavaScript Design Pattern](https://www.sitepoint.com/my-favorite-javascript-design-pattern/)


## Data Structure
1. 
```
{
	"objects": [
		{
			"id": "$id",
			"type": "Label/Image/Button/View",
			"width": "70",
			"...": "...",
			"relation": {
				"father": "$id",
				"children": ["$id", "$id","..."]
			}
		},
		{
			"id": "$id",
			"type": "Label/Image/Button/View",
			"width": "70",
			"...": "...",
			"relation": {
				"father": "$id",
				"children": ["$id", "$id","..."]
			}
		}
	],
	"constraints": [
		{
			"id": "$id",
			"type": "leadingEdge/trailingEdge/topEdge/bottomEdge/verticalCenter/horizentalCenter",
			"objectId": ["$id"],
			"...": "..."
		},
		{
			"id": "$id",
			"type": "leadingEdge/trailingEdge/topEdge/bottomEdge/verticalCenter/horizentalCenter",
			"objectId": ["$id","$id"],
			"...": "..."
		}
	]
}
```

2. 
```
-users
	-$user
		-documents
			-$documents
				-title
				-content
				-isReadable
				-createdAt
				-updatedAt
	-$user
		-documents
			-$documents
				-title
				-content
				-isReadable
				-createdAt
				-updatedAt
```
