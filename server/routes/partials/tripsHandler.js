/**
 * Created by danielabrao on 12/3/16.
 */
(function () {
    "use strict";

    module.exports = function (app, Cloudant, request) {
        var tripsDB = Cloudant.use("trips");


        app.get("/getAllTrips", function (req, res) {
            tripsDB.find({
                "selector": {
                    "status": {
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

        app.get("/getTripByDriver/:accountId", function (req, res) {
            tripsDB.find({
                "selector": {
                    "accountId": req.params.accountId
                }
            }, function (err, data) {
                console.log(err, data);
                if (!err) {
                    if (data.docs) {
                        return res.status(200).send(data.docs);
                    } else {
                        return res.status(404).send("not found");
                    }
                }
            });
        });

        app.get("/finishTrip/:accountId", function (req, res) {
            tripsDB.find({
                "selector": {
                    "accountId": req.params.accountId
                }
            }, function (err, data) {
                console.log(err, data);
                if (!err) {
                    if (data.docs[0]) {
                        data.docs[0].status = "finished";
                        tripsDB.insert(data.docs, function (err) {
                            if (err) {
                                return res.status(500).send('Ocorreu um erro inesperado');
                            }

                            return res.status(200).send('Viagem encerrada');

                        });
                    } else {
                        return res.status(404).send("not found");
                    }
                }
            });
        });


        app.post('/insertTrip', function (req, res) {

            console.log(req.body);
            request.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + req.body.origem + "&key=AIzaSyCsSHnld6kt-fxDgzwnlGXp8pY7I_EE0JI", function (err, body, response) {
                console.log("aqui");
                console.log(JSON.parse(response).results);
                req.body.origemLocation = JSON.parse(response).results[0].geometry.location;
                request.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + req.body.destino + "&key=AIzaSyCsSHnld6kt-fxDgzwnlGXp8pY7I_EE0JI", function (err, body, resp) {
                    console.log("aqui");
                    console.log(JSON.parse(resp).results);
                    req.body.destinoLocation = JSON.parse(resp).results[0].geometry.location;
                    req.body.status = "active";
                    process.nextTick(function () {
                        tripsDB.insert(req.body, function (err) {
                            if (err) {
                                return res.status(500).send('Ocorreu um erro inesperado');
                            }

                            return res.status(201).send('Caminhão inserido');

                        });
                    });
                });

            });

        });

        app.get("/getGeocoding/:area", function (req, res) {
            request.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + req.params.area + "&key=AIzaSyCsSHnld6kt-fxDgzwnlGXp8pY7I_EE0JI", function (err, body, response) {
                return res.status(200).send(JSON.parse(response).results[0].geometry.location);
            });
        });
    };

}());