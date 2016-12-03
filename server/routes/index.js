(function () {
    "use strict";

    var loginRoutes = require('./partials/loginHandler'),
        accountRoutes = require('./partials/accountHandler'),
        deviceRoutes = require('./partials/deviceHandler'),
        brokerRoutes = require('./partials/brokerHandler');

    module.exports = function (app, io, request, materaMP, iotf_connections, iotf_configs, passport) {
        loginRoutes(app, passport);
        accountRoutes(app, materaMP, request);
        deviceRoutes(app, iotf_configs, iotf_connections, request);
        brokerRoutes(app, iotf_connections, io);
    };

}());
