(function () {
    "use strict";

    var loginRoutes = require('./partials/loginHandler'),
        accountRoutes = require('./partials/accountHandler');

    module.exports = function (app, io, crypto, request, getApiKey) {
        loginRoutes(app);
        accountRoutes(app, getApiKey, crypto, request);
    };

}());
