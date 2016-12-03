/**
 * Created by danielabrao on 12/2/16.
 */
(function () {
    "use strict";


    module.exports = function (app, getApiKey, request) {

        app.get("/account/:accountId", function (req, res) {
            getApiKey.getUserDetails(req.params.accountId).then(function successCB(data) {
                return res.status(200).send(data);
            }, function errorCB(error) {
                return res.status(500).send(error);
            });
        });
    };

}());