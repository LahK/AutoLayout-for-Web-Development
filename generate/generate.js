// config
// 'use strict'

(function(window) {
    // 如果浏览器原生支持该事件,则退出

    function patchHashListener() {
        // TOFIX : why body is null ?
        console.log(document.body)
        if ('onhashchange' in document.body) {
            return;
        }

        var location = window.location,
            oldURL = location.href,
            oldHash = location.hash;

        // 每隔100ms检测一下location.hash是否发生变化
        setInterval(function() {
            var newURL = location.href,
                newHash = location.hash;

            // 如果hash发生了变化,且绑定了处理函数...
            if (newHash != oldHash && typeof window.onhashchange === "function") {
                // execute the handler
                window.ohashchange();

                oldURL = newURL;
                oldHash = newHash;
            }
        }, 100);
    }

    function loadJson() {
        let pageUrl = document.location.href;
        let filename;

        // 匹配以#开头，以#?&之一结尾，且不包含空格、#?&字符的字符串。
        let anchor = pageUrl.match(/\#([^#?&=\s]+)[\#|\?\&]{0,1}/);
        if (anchor == null) {
            filename = 'index.json';
        } else {
            filename = anchor[1] + '.json';
        }
        var req = createXMLHTTPRequest();
        return new Promise(function(resolve, reject) {
            if (req) {
                req.open('GET', filename, true);
                req.onreadystatechange = function() {
                    if (req.readyState == 4) {
                        if (req.status == 200) {
                            resolve(JSON.parse(req.response))
                        } else {
                            reject(req.status)
                        }
                    }
                }
                req.send(null);
            }
        })
    }

    function createXMLHTTPRequest() {

        //1.创建XMLHttpRequest对象     
        //这是XMLHttpReuquest对象无部使用中最复杂的一步     
        //需要针对IE和其他类型的浏览器建立这个对象的不同方式写不同的代码     
        let xmlHttpRequest;
        if (window.XMLHttpRequest) {
            //针对FireFox，Mozillar，Opera，Safari，IE7，IE8     
            xmlHttpRequest = new XMLHttpRequest();
            //针对某些特定版本的mozillar浏览器的BUG进行修正     
            if (xmlHttpRequest.overrideMimeType) {
                xmlHttpRequest.overrideMimeType("text/xml");
            }
        } else {
            console.log('浏览器版本过旧！');
            alert('浏览器版本过旧！');
        }
        return xmlHttpRequest;
    }

    function getBaseElement(type) {

        div = document.createElement('div');
        div.style.position = 'absolute';
        return div;
    }

    function getBaseLine(element, attribute) {

        style = window.getComputedStyle(element);

        switch (attribute) {
            case 'width':
                return parseFloat(style.width);
            case 'height':
                return parseFloat(style.height);
            case 'leading':
                return parseFloat(style.left);
            case 'trailing':
                return parseFloat(style.left) + parseFloat(style.width);
            case 'top':
                return style.top;
            case 'bottom':
                return parseFloat(style.top) + parseFloat(style.height);
            case 'centerX':
                return parseFloat(style.left) + parseFloat(style.width) / 2;
            case 'centerY':
                return parseFloat(style.top) + parseFloat(style.height) / 2;
            default:
                return 0;
        }
    }

    function getStatus(element) {
        var objStatus = {
            x: parseFloat(window.getComputedStyle(element).left) || 0,
            y: parseFloat(window.getComputedStyle(element).top) || 0,
            w: parseFloat(window.getComputedStyle(element).width) || 50,
            h: parseFloat(window.getComputedStyle(element).height) || 50,
        };
        return objStatus;
    }

    function generatePage(json) {
        let objects = json['objects']
        let constraints = json['constraints']
        if (objects == undefined || constraints == undefined) {
            console.log("Json 文件不符合标准格式！")
            return;
        }

        let body = document.body;
        console.log(body)
        body.innerHTML = '';
        let pageWidth = window.innerWidth,
            pageHeight = window.innerHeight;

        if (typeof pageWidth != 'number') {
            if (document.compatMode == 'CSS1Compat') {
                pageWidth = document.documentElement.clientWidth;
                pageHeight = document.documentElement.clientHeight;
            } else {
                pageWidth = body.clientWidth;
                pageHeight = body.clientHeight;
            }
        }
        body.style.display = 'none';
        body.style.overflow = 'hidden';
        body.style.minHeight = '100vh';
        body.style.width = '100vw';

        // 占位节点，用于优化添加大量节点
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < objects.length; i++) {
            let baseElement = getBaseElement(objects[i].type)
            baseElement.id = objects[i].id;
            baseElement.name = objects[i].name;

            baseElement.style.cssText += JSON.stringify(objects[i].style).replace(/(",){1}/g, ';').replace(/[\"\{\}]{1}/g, '');
            if (JSON.stringify(objects[i].data) != "{}") {

                // 暂定添加文字方法，ToFix
                baseElement.innerText = objects[i].data["al-text"];
            }
            fragment.appendChild(baseElement);
        }

        body.appendChild(fragment);

        for (var i = 0; i < constraints.length; i++) {

            let item = document.getElementById(constraints[i].item);
            let attribute = constraints[i].attribute;
            let constant = constraints[i].constant;
            let toItem = constraints[i].toItem === "0" ? body : document.getElementById(constraints[i].toItem);

            let toAttribute = constraints[i].toAttribute;
            if (toItem == null) {
                item.style[attribute] = constant + 'px';
            } else if (toItem == body) {
                switch (attribute) {
                    case 'width':
                        item.style.width = '100vw';
                        break;
                    case 'height':
                        item.style.height = '100vh';
                        break;
                    case 'leading':
                        item.style.left = constant + 'px';
                        break;
                    case 'trailing':
                        item.style.left = pageWidth - constant - getStatus(item).w + 'px';
                        break;
                    case 'top':
                        item.style.top = constant + 'px';
                        break
                    case 'bottom':
                        item.style.top = pageHeight - constant - getStatus(item).h + 'px';
                        break;
                    case 'centerX':
                        item.style.left = (pageWidth - getStatus(item).w) / 2 + 'px';
                        break;
                    case 'centerY':
                        item.style.top = (pageHeight - getStatus(item).h) / 2 + 'px';
                        break;
                }
            } else {
                baseLine = getBaseLine(toItem, toAttribute)
                    // console.log(baseLine)
                switch (attribute) {
                    case 'width':
                        item.style.width = baseLine + 'px';
                        break;
                    case 'height':
                        item.style.height = baseLine + 'px';
                        break;
                    case 'leading':
                        item.style.left = baseLine + 'px';
                        break;
                    case 'trailing':
                        item.style.left = baseLine - getStatus(item).w + 'px';
                        break;
                    case 'top':
                        item.style.top = baseLine + 'px';
                        break
                    case 'bottom':
                        item.style.top = baseLine - getStatus(item).h + 'px';
                        break;
                    case 'centerX':
                        item.style.left = baseLine - getStatus(item).w / 2 + 'px';
                        break;
                    case 'centerY':
                        item.style.top = baseLine - getStatus(item).h / 2 + 'px';
                        break;
                }
            }
        }
        body.style.display = '';
    }
    patchHashListener();
    window.onhashchange = function() {
        let load = loadJson();
        load.then(generatePage);
    }

    let load = loadJson();
    load.then(generatePage);

})(window);
