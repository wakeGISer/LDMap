/**
 * Created by wake on 2017/4/7/007.
 */

import Busline from './src/trace/Busline';
import Carline from './src/trace/Carline';
import Walkline from './src/trace/Walkline';
// import ol from './src/ol3api/js/ol';

var L = {
    version: '1.0.0'
};

L.Busline = Busline;
L.Carline = Carline;
L.Walkline = Walkline;

//console.log(Busline);
//module.exports = L;

window.L = L;