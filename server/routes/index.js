(function () {
    "use strict";

    var loginRoutes = require('./partials/loginHandler'),
        accountRoutes = require('./partials/accountHandler'),
        deviceRoutes = require('./partials/deviceHandler'),
        brokerRoutes = require('./partials/brokerHandler');

<<<<<<< HEAD
    module.exports = function (app, io, request, getApiKey, iotf_connections, iotf_configs, passport) {
        loginRoutes(app, passport);
        accountRoutes(app, getApiKey, request);
=======
    module.exports = function (app, io, request, materaMP, iotf_connections, iotf_configs) {
        loginRoutes(app);
        accountRoutes(app, materaMP, request);
>>>>>>> b6b825e80e986286934527d6b959208f8ad8fb0c
        deviceRoutes(app, iotf_configs, iotf_connections, request);
        brokerRoutes(app, iotf_connections, io);
    };

}());
