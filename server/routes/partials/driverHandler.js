/**
 * Created by danielabrao on 12/3/16.
 */
(function () {
    "use strict";


    module.exports = function (app, Cloudant, materaMP, UserSchema) {

        var userDB = Cloudant.use("users");


        app.get("/getAllDrivers", function (req, res) {
            userDB.find({
                "selector": {
                    "username": {
                        "$gt": null
                    }
                }
            }, function (err, data) {
                console.log(err, data);
                if (!err) {
                    if (data.docs) {
                        return res.status(200).send(data.docs);
                    }
                }
            });
        });

        app.get("/getUserDetails/:accountId", function (req, res) {
            materaMP.getAccountDetails(req.params.accountId).then(function (user) {
                return res.status(200).send(user);
            }, function (error) {
                return res.status(500).send(error);
            });
        });

        app.post('/insertDriver', function (req, res) {
            if (!req.body.CPF) {
                return res.status(400).send('Não é possível prosseguir sem um CPF');
            }

            materaMP.postCreateAccount(req.body.driver).then(function (newDriver) {
                process.nextTick(function () {
                    userDB.find({
                        selector: {
                            "accountId": newDriver.accountId
                        }
                    }, function (err, user) {
                        if (err) {
                            console.error(new Error(err));
                            return res.status(500).send(err);
                        }
                        if (user.docs.length) {
                            if (user.docs[0].password) {
                                return res.status(403).send('Usuário existente');
                            }
                        }
                        try {
                            newDriver.password = UserSchema.methods.generateHash(req.body.password);
                        } catch (e) {
                            return res.status(500).send('Um erro inesperado ocorreu');
                        }
                        userDB.insert(newDriver, function (err) {
                            if (err) {
                                return res.status(500).send('Ocorreu um erro inesperado');
                            }

                            return res.status(201).send('Usuário criado');

                        });
                    });
                });
            }, function (err) {
                return res.status(502).send('Bad request');

            });



        });

    };

}());