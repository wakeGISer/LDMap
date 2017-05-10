/**
 * Created by Administrator on 2017/5/10/010.
 */

import FindParameters from './FindParameters';
import FindTask from './FindTask';

export class FindServiceAGS {
    constructor(map, opts) {
        this.opts = {
            returnGeometry: !0,
            outSpatialReference: 4326
        };
        Object.assign(this.opts, opts);
        // this.cb = cb;
        this.map = map;
        this.initialize();
    }

    initialize() {
        var params = new FindParameters();
        Object.assign(params, this.opts);
        this._params = params;
        this.task = new FindTask(this.opts.url);
    }

    search(cb) {
        this.task.execute(this._params, cb)
    }
}