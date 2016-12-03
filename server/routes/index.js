(function () {
    "use strict";

    var loginRoutes = require('./partials/loginHandler'),
        accountRoutes = require('./partials/accountHandler');

    module.exports = function (app, io) {
        loginRoutes(app);
        accountRoutes(app);
    };

}());
