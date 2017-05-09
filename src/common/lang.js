/**
 * Created by Administrator on 2017/4/14/014.
 */
import dom from './dom';

export default {
    request: function(url, cbk) {
        if (cbk) {
            var timeStamp = (Math.random() * 100000).toFixed(0);
            // 全局回调函数
            window["_cbk" + timeStamp] = function(json) {
                cbk && cbk(json);
                try {
                    delete window["_cbk" + timeStamp];
                } catch (e) {
                    window["_cbk" + timeStamp] = null;
                }
            };
            url += "&callback=window._cbk" + timeStamp;
        }

        var script = this.create('script');
        script.setAttribute('type', 'text/javascript');
        script.charset = "utf-8";
        script.src = url;
        // 脚本加载完成后进行移除
        if (script.addEventListener) {
            script.addEventListener('load', function(e) {
                var t = e.target;
                t.parentNode.removeChild(t);
            }, false);
        } else if (script.attachEvent) {
            script.attachEvent('onreadystatechange', function(e) {
                var t = window.event.srcElement;
                if (t && (t.readyState == 'loaded' || t.readyState == 'complete')) {
                    t.parentNode.removeChild(t);
                }
            });
        }
        document.getElementsByTagName('head')[0].appendChild(script);
        script = null;
    },

    create: function(tag, ns, attrs) {
        var ele;
        if (ns) {
            ele = document.createElementNS(tag, ns);
        } else {
            ele = document.createElement(tag);
        }
        return dom.setAttrs(ele, attrs);
    },

    isString: function (s) {
        return "string" == typeof s ||  s instanceof String;
    },

    extend: function (to, from) {
        for(let item in from){
            to[item] = from[item];
        }
    }
}