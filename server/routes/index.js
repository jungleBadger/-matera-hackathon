(function () {
    "use strict";

    var loginRoutes = require('./partials/loginHandler');

    module.exports = function (app, io) {
        loginRoutes(app);
    };

}());
