(function () {
    "use strict";

<<<<<<< HEAD
    var loginRoutes = require('./partials/loginHandler'),
        accountRoutes = require('./partials/accountHandler'),
        balanceRoutes = require('./partials/balanceHandler'),
        statementRoutes = require('./partials/statementHandler'),
        deviceRoutes = require('./partials/deviceHandler'),
        brokerRoutes = require('./partials/brokerHandler'),
        driverRoutes = require("./partials/driverHandler"),
        paymentRoutes = require("./partials/paymentHandler");
=======
    var loginRoutes = require("./partials/loginHandler"),
        accountRoutes = require("./partials/accountHandler"),
        balanceRoutes = require("./partials/balanceHandler"),
        statementRoutes = require("./partials/statementHandler"),
        deviceRoutes = require("./partials/deviceHandler"),
        brokerRoutes = require("./partials/brokerHandler"),
        truckRoutes = require("./partials/truckHandler"),
        driverRoutes = require("./partials/driverHandler"),
        tripsRoutes = require("./partials/tripsHandler");
>>>>>>> 2ee711c94d4cd4d3050101d491573dd019b2e8f4

    module.exports = function (app, io, request, materaMP, iotf_connections, iotf_configs, passport, Cloudant, UserSchema) {
        loginRoutes(app, passport);
        accountRoutes(app, materaMP, request);
        balanceRoutes(app, materaMP, request);
        paymentRoutes(app, materaMP, request)
        statementRoutes(app, materaMP, request);
        deviceRoutes(app, iotf_configs, iotf_connections, request);
        brokerRoutes(app, iotf_connections, io);
        truckRoutes(app, Cloudant);
        driverRoutes(app, Cloudant, materaMP, UserSchema);
        tripsRoutes(app, Cloudant);
    };

}());
