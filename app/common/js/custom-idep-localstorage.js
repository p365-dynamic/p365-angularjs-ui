var localStorageApp = angular.module('LocalStorageModule', []);
var coll = null;
var db = null;
var encryptedRecord = null;
localStorageApp.service('localStorageService', function() {

    this.get = function(recordKey) {
        if (coll) {
            var result = coll.findObject({ "key": recordKey });

            if (result != null) {
               // return decryptData(result.value);
                return result.value;
            }
            return result;
        }
    }
    this.set = function(recordKey, record) {
        if (coll) {
            var isRecordPresent = coll.findObject({ "key": recordKey });
            if (isRecordPresent === null) {
                // coll.insert({ "key": recordKey, "value": String(encryptData(record)) });
                coll.insert({"key" : recordKey,"value" : record});
            } else {
                // isRecordPresent.value = String(encryptData(record));
                isRecordPresent.value = record;
                coll.update(isRecordPresent);
            }
        }
    }
    this.removeRecord = function(record) {
        coll = db.getCollection('apprecords', { indices: ['key'] });
        console.log(coll);
        var list = coll.data;
        for (var i = 0; i < list.length; i++) {
            if (list[i].key == record.key) {
                coll.remove(list[i]);
            }
        }
    }
    this.clearAll = function() {
        localStorage.removeItem("policies365.db");
    }

    this.clearCollection = function() {
        db = new loki("policies365.db", {
            autoload: true,
            autosave: true,
            autosaveInterval: 100
        });
        coll = db.getCollection('apprecords', { indices: ['key'] });
        //console.log(coll);
        if (coll != null) {
            var list = coll.find();
            for (var i = 0; i < list.length; i++) {
                //console.log(i);
                coll.remove(list[i]);
            }
        }
        coll = db.addCollection('apprecords');
        //console.log(coll);
    }
});

function loadDatbase(cb) {

    db = new loki("policies365.db", {
        //adapter : idbAdapter,
        autoload: true,
        autoloadCallback: loadHandler,
        autosave: true,
        autosaveInterval: 100
    });

    function loadHandler() {

        coll = db.getCollection('apprecords', { indices: ['key'] });

        if (coll == null) {
            coll = db.addCollection('apprecords');
            cb();
        } else {
            cb();
        }
    }
}