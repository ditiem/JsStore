describe('keyPath test', function () {
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/ false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    if (!(isIE || isEdge)) {
        it('terminate connection', function (done) {
            con.terminate().then(function () {
                console.log('terminated');
                con = new JsStore.Instance();
                done();
            }).catch(function (error) {
                done(error);
            });
        });

        it('create db', function (done) {
            var dbName = 'pinCodeDetails';
            con.isDbExist(dbName).then(function (isExist) {
                if (isExist) {
                    con.openDb(dbName).then(done)
                } else {
                    var db = getDbSchemaOfPinCodes();
                    con.createDb(db).then(function (result) {
                        done();
                    })
                }
            }).catch(function (err) {
                done(err);
            })
        });

        it('bulk insert pinCodes', function (done) {
            var time1 = performance.now();
            $.getJSON("test/static/pinCodes.json", function (results) {
                con.bulkInsert({
                    into: 'pinCodes',
                    values: results,
                }).then(function (results) {
                    console.log('pinCodes inserted');
                    var time2 = performance.now();
                    console.log((time2 - time1) / 1000);
                    expect(results).to.be.an('undefined');
                    done();
                }).
                catch(function (err) {
                    done(err);
                });
            });
        })

        it('selecting data based on keyPath', function (done) {
            con.select({
                from: 'pinCodes',
                where: {
                    officetypeAndDeliverystatus: ['B.O', 'Delivery']
                }
            }).then(function (results) {
                expect(results).to.be.an('array').length(4204);
                done();
            }).catch(function (err) {
                done(err);
            })
        })

        it('drop db pincodes', function (done) {
            con.dropDb().then(function () {
                done();
            }).catch(function (err) {
                done(err);
            });
        });
    }
})

function getDbSchemaOfPinCodes() {
    var table = {
        name: 'pinCodes',
        columns: [{
                name: 'id',
                primaryKey: true,
                autoIncrement: true
            },
            {
                name: 'officename',
                dataType: 'string'
            }, {
                name: 'pincode',
                dataType: 'string'
            },
            {
                name: 'officetype',
                dataType: 'string'
            }, {
                name: 'Deliverystatus',
                dataType: 'string'
            }, {
                name: 'officetypeAndDeliverystatus',
                keyPath: ['officetype', 'Deliverystatus']
            }, {
                name: 'divisionname',
                dataType: 'string'
            }, {
                name: 'regionname',
                dataType: 'string'
            }, {
                name: 'circlename',
                dataType: 'string'
            }, {
                name: 'taluk',
                dataType: 'string'
            }, {
                name: 'districtname',
                dataType: 'string'
            }, {
                name: 'statename',
                dataType: 'string'
            }
        ]
    }
    var database = {
        name: 'pinCodeDetails',
        tables: [table]
    }
    return database;
}