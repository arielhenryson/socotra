import {DB} from "../lib/db";
import {setConfig} from "../global";


describe('database class', () => {
    it('test should connect to database', (done) => {
        const config = require('../../config/config.json');
        setConfig(config);


        let db = new DB();
        db.promiseConnection().then(() => {
            done();
        });
    }, 1000 * 10);


    it('expect 5746b63b8f20bdd60741418a to be valid _id', () => {
        const validID = DB.isValidId("5746b63b8f20bdd60741418a");
        expect(validID).toEqual(true);
    });

    it('expect ABC not to be valid _id', () => {
        const validID = DB.isValidId("ABC");
        expect(validID).toEqual(false);
    });

    it('expect makeDoc to add _createTime as type Date', () => {
        const doc: any = DB.makeDoc({});
        expect(doc._createTime instanceof Date).toBe(true);
    });
});