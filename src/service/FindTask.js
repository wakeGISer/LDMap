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
    Object.keys(json).forEach((item, i) => {
        this.serviceUrl += item + "=" + json[item] + "&";
    });
    _.request(this.serviceUrl, function(data){
         callback.call(null, data);
    });

};

export default FindTask;