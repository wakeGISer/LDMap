/**
 * Created by Administrator on 2017/4/10/010.
 */


export default {
    parse: function (data) {
        let self = this;
        var routes = [] ;
        for (let i = 0; i < data.result.routes.length; i++) {
            var scheme = data.result.routes[i].scheme[0];
            routes[i] = {
                start: scheme.originLocation.split(','),
                end: scheme.destinationLocation.split(','),
                distance: scheme.distance,
                duration: scheme.duration,
                price: scheme.price,
                steps: []
            };
            for (let j = 0; j < scheme.steps.length; j++) {
                var step = scheme.steps[j];
                if (step.path == "") continue;
                routes[i].steps[j] = {
                    path: step.path.split(';').map((item) => {
                        return item.split(',');
                    }),
                    start: step.stepOriginLocation,
                    end: step.stepDestinationLocation,
                    distance: step.distance,
                    type: step.type,
                    vehicle: step.vehicle
                };
            }
        }
        return routes;
    }
}