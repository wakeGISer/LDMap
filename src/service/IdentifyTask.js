/**
 * Created by Administrator on 2017/5/8/008.
 */
import _  from '../common/index';


function IdentifyTask(url,options) {
    this.serviceUrl = url + "/identify?";
    this.options = options || {};
}

var p = IdentifyTask.prototype;


p.execute = function (identifyParams, callback) {
    var json  = identifyParams.toJson();
    var self = this;
    Object.keys(json).forEach((item, i) => {
        this.serviceUrl += item + "=" + json[item] + "&";
    });
    _.request(this.serviceUrl, function(data){
        if(data.results.error){
            callback.call(null, data);
            console.warn("error ： ", data.results.error)
        }else {
            if(json.searchText != ""){
                // 筛选出包含 key的数据
                //Array.isArray(json.se)
                if(json.searchFields != "") {
                    let a = data.results;
                    a = a.filter(item => {
                        for(let i = 0 ; i < json.searchFields.length; i++){
                            let flag = item.attributes[json.searchFields[i]] && item.attributes[json.searchFields[i]].includes(json.searchText);
                            if(flag === true){
                                return true;
                            }else {
                                continue;
                            }
                        }
                    })
                    callback.call(null, {results: a});
                }else {
                    var a =  data.results;
                    a = a.filter(item => {
                        return item.value.includes(json.searchText);
                    });
                    callback.call(null, {results: a});
                }
            }else {
                callback.call(null, data);
            }
        }
    });
};

export default  IdentifyTask;
