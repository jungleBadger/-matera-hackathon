/**
 * Created by danielabrao on 12/3/16.
 */
(function () {
    "use strict";

    module.exports = function (app, Cloudant) {
        var tripsDB = Cloudant.use("trips");


        app.get("/getAllTrips", function (req, res) {
            tripsDB.find({
                "selector": {
                    "_id": {
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

                            return res.status(201).send('Caminhão inserido');

                        });
                    } else {
                        return res.status(404).send("not found");
                    }
                }
            });
        });


        app.post('/insertTrip', function (req, res) {
            req.body.status = "active";
            //chamar a api com os parametros req.body.destino e inicio, atualizar o objeto req.body.partida = {lat: long:}
            process.nextTick(function () {
                tripsDB.insert(req.body, function (err) {
                    if (err) {
                        return res.status(500).send('Ocorreu um erro inesperado');
                    }

                    return res.status(201).send('Caminhão inserido');

                });
            });
        });
    };

}());