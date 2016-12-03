(function () {
    "use strict";

    var loginRoutes = require('./partials/loginHandler'),
        accountRoutes = require('./partials/accountHandler');

    module.exports = function (app, io, request, getApiKey) {
        loginRoutes(app);
        accountRoutes(app, getApiKey, request);
    };

}());
