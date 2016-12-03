/**
 * Created by nickolasleal on 03/12/2016
 */
(function () {
    "use strict";
    module.exports = function (app, materaMP, request) {
        app.get("/account/:accountId", function (req, res) {
            materaMP.getAccountDetails(req.params.accountId).then(function successCB(data) {
                return res.status(200).send(data);
            }, function errorCB(error) {
                return res.status(500).send(error);
            });
        });

        app.post("/account", function (req, res) {
            materaMP.postCreateAccount(req.body).then(function successCB(data) {
                return res.status(200).send(data);
            }, function errorCB(error) {
                return res.status(500).send(error);
            });
        });
    };
}());