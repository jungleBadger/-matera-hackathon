(function () {
    "use strict";

    module.exports = function (paramHash, crypto) {
        var secretKey = process.env.SECRET_KEY;
        var apiAcessKey = process.env.API_ACESS_KEY;

        var hash = "";
        paramHash.forEach(function (param) {
            hash = hash + param;
        });

        var hmac = crypto.createHmac('sha256', "hash");
        hmac.update(hash);
        return hmac.digest('hex');
    }
} ());
