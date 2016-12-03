/**
 * Created by danielabrao on 12/3/16.
 */
(function () {
    "use strict";

    module.exports = function ($) {
        return {
            "insertDriver": function (driverObj) {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: '/insertDriver',
                        method: 'post',
                        data: driverObj,
                        processData: false,
                        contentType: false
                    }).done(function(param){
                        resolve(param);
                    }).fail(function (err) {
                        reject(err);
                    });
                });

            }
        }
    };

}());