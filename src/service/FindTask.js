/**
 * Created by wake on 2017/5/9/009.
 */
import _ from '../common/index'

function FindTask(url, options) {
    this.serviceUrl = url + "/find?";
    this.options = options || {};
}

var p = FindTask.prototype;


p.execute = function (findParameters, callback) {
    var json = findParameters.toJson();
    var self = this;
    var url = this.serviceUrl;
    Object.keys(json).forEach((item, i) => {
        url += item + "=" + json[item] + "&";
    });
    _.request(url, callback);

};

export default FindTask;