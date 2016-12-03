(function () {
    "use strict";

    var loginRoutes = require('./partials/loginHandler'),
        accountRoutes = require('./partials/accountHandler'),
        balanceRoutes = require('./partials/balanceHandler'),
        statementRoutes = require('./partials/statementHandler'),
        deviceRoutes = require('./partials/deviceHandler'),
        brokerRoutes = require('./partials/brokerHandler');

    module.exports = function (app, io, request, materaMP, iotf_connections, iotf_configs) {
        loginRoutes(app);
        accountRoutes(app, materaMP, request);
        balanceRoutes(app, materaMP, request);
        statementRoutes(app, materaMP, request);
        deviceRoutes(app, iotf_configs, iotf_connections, request);
        brokerRoutes(app, iotf_connections, io);
    };

}());
