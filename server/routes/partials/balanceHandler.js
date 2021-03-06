/**
 * Created by nickolasleal on 03/12/2016
 */
(function () {
    "use strict";
    module.exports = function (app, materaMP, request) {
        app.get("/balance/:accountId", function (req, res) {
            materaMP.getAccountBalance(req.params.accountId).then(function successCB(data) {
                return res.status(200).send(data);
            }, function errorCB(error) {
                return res.status(500).send(error);
            });
        });
    };
}());