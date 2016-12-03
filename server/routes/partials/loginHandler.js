/**
 * Created by danielabrao on 12/2/16.
 */
(function () {
    "use strict";


    module.exports = function (app, passport) {
        app.get("/login", function (req, res) {
            return res.status(200).render("./login.view.html");
        });

        app.post('/login',
            passport.authenticate('login', {
                successRedirect: '/loginSuccess',
                failureRedirect: '/loginFailure'
            })
        );

        app.get("/loginSuccess", function (req, res) {
            console.log(req.user);
            return res.status(200).render("./console.view.html");
        })
    };



}());
