/**
 * Created by Administrator on 2017/5/8/008.
 */
import _  from '../common/lang';


function IdentifyTask(url,options) {
    this.serviceUrl = url + "/identify?";
    this.options = options || {};
}

var p = IdentifyTask.prototype;




p.execute = function (identifyParams, callback) {
    var json  = identifyParams.toJson();
    var self = this;
    var url = this.serviceUrl;
    Object.keys(json).forEach((item, i) => {
        url += item + "=" + json[item] + "&";
    });
    _.request(url, function(data){
        if(data.error){
            callback(data);
            console.warn("error ： ", data.error)
        }else {
            if(json.searchText != ""){
                // 筛选出包含 key的数据
                //Array.isArray(json.se)
                if(json.searchFields != "") {
                    let a = data.results;
                    a = a.filter(item => {
                        for(let i = 0 ; i < json.searchFields.length; i++){
                            let flag = item.attributes[json.searchFields[i]].includes(json.searchText);
                            if(flag === true){
                                return true;
                            }else {
                                continue;
                            }
                        }
                    })
                    callback({results: a});
                }else {
                    var a =  data.results;
                    a = a.filter(item => {
                        return item.value.includes(json.searchText);
                    });
                    callback({results: a});
                }
            }else {
                callback(data);
            }
        }
    });
};

export default  IdentifyTask;
