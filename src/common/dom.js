/**
 * Created by Administrator on 2017/5/8/008.
 */

import lang from './lang';

export default {
    setAttr: function(ele, key, attr) {
        ele = this.$(ele);
        ele.setAttribute(key, attr);
        return ele;
    },

    setAttrs: function(ele, attrs) {
        ele = this.$(ele);
        for (var key in attrs) {
            this.setAttr(ele, key, attrs(key))
        }
        return ele;
    },

    $: function(id) {
        if (lang.isString(id)) {
            return document.getElementById(id)
        } else if (id && id.nodeName) {
            return id;
        }
        return null;
    }
}