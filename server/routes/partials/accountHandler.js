/**
 * Created by danielabrao on 12/2/16.
 */
(function () {
    "use strict";


    module.exports = function (app, getApiKey, crypto, request) {
        app.get("/account", function (req, res) {
            var url = "public-api-elb-1090807689.us-west-2.elb.amazonaws.com";
            var api = "/v1/accounts/"

            // TODO: Recuperar parametros de geração da hash
            var params = ["9E64CF5A-E978-B67C-9440-CBCDD99A89C5"];

            // TODO: Fazer requisição em public-api-elb-1090807689.us-west-2.elb.amazonaws.com/v1/accounts
            var hashKey = getApiKey(params, crypto).toString();
            request(url + api, function(error, response, body) {

            });

            return res.status(200).send();
        });
    };

}());