/**
 * Created by danielabrao on 12/2/16.
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

        app.get("/balance/:accountId", function (req, res) {
            materaMP.getAccountBalance(req.params.accountId).then(function successCB(data) {
                return res.status(200).send(data);
            }, function errorCB(error) {
                return res.status(500).send(error);
            });
        });

        app.get("/statement/:accountId", function (req, res) {
            materaMP.getAccountStatement(req.params.accountId).then(function successCB(data) {
                return res.status(200).send(data);
            }, function errorCB(error) {
                return res.status(500).send(error);
            });
        });
    };

}());