/**
 * Created by danielabrao on 12/3/16.
 */
(function () {
    "use strict";


    module.exports = function (app, Cloudant, materaMP) {

        app.post("/insertDriver", function (req, res) {
            console.log(req.body);
            return res.status(200).send("will insert");
        });

    };

}());