/**
 * Created by wake on 2017/4/7/007.
 */

import Trace from './trace/index'
import  Task from './service/index';
import  _ from './common/index';
// import ol from './src/ol3api/js/ol';

let L = {
    version: '1.0.1',
    ..._,
    ...Trace,
    ...Task
};

//console.log(Busline);
//module.exports = L;

module.exports = window.L = L;