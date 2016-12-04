/**
 * Created by danielabrao on 6/18/16.
 */
/*jslint node:true*/
(function () {
    "use strict";

    var bcrypt = require("bcrypt-nodejs");

    module.exports = {
        methods: {
            generateHash: function (password) {
                return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            },
            validPassword: function (password, crypt) {
                return bcrypt.compareSync(password, crypt);
            },
            generateToken:  function (userId) {
                return new Buffer(userId).toString("base64");
            },
            generateExpiration: function () {
                return new Date().getTime() + 7200000;
            },
            generateTokenData: function (userId, salt) {
                return {
                    userId: userId,
                    token: this.generateToken(userId),
                    expiration: this.generateExpiration()
                };

            },
            generatePartnerPassword: function (partner) {
                var password = [partner, new Date().getTime()].join("");
                return {
                    raw: password,
                    hash: this.generateHash(password)
                };
            },
            generateRequestToken : function (value) {
                var string = this.generateToken(value + "forgot_request" + new Date().getTime());
                return string.slice(string.length / 2 + 10, -2);
            }
        }

    };

}());