import {DB} from "../lib/db";
import {setConfig} from "../global";


describe('database class', () => {
    it('expect isValidId to say 5746b63b8f20bdd60741418a is valid _id', () => {
        const validID = DB.isValidId("5746b63b8f20bdd60741418a");
        expect(validID).toEqual(true);
    });

    it('expect isValidId to say ABC is not valid _id', () => {
        const validID = DB.isValidId("ABC");
        expect(validID).toEqual(false);
    });

    it('expect createNewId to create valid id', () => {
        const newID = DB.createNewId();
        const isNewKeyValid = DB.isValidId(newID);
        expect(isNewKeyValid).toEqual(true);
    });

    it('expect createNewId to create valid id from 5746b63b8f20bdd60741418a', () => {
        const newID = DB.createNewId("5746b63b8f20bdd60741418a");
        const isNewKeyValid = DB.isValidId(newID);
        expect(isNewKeyValid).toEqual(true);
    });

    it('expect makeNewSolt to create random string', () => {
        const randomSolt = DB.makeNewSolt();
        expect(typeof randomSolt).toBe("string");
    });

    it('expect hash to return the same value for "foo bar" ', () => {
        const hash1 = DB.hash("foo bar", "");
        const hash2 = DB.hash("foo bar", "");
        expect(hash1).toEqual(hash2);
    });

    it("test insert findOne find update", done => {
        const config = require('../../config/config.json');
        setConfig(config);
        let db = new DB();
        db.promiseConnection().then(async () => {
            const collection = "unitTest";
            const doc = { foo: "bar" };
            const insertQuery: any = await db.dbInsert(collection, doc, {});

            expect(insertQuery.error).toBe(null);


            const findQuery: any = await db.dbFindOne(collection, doc, {});
            expect(findQuery.data.foo).toBe("bar");

            const findQuery2: any = await db.dbFind(collection, doc, {});
            expect(findQuery2.data[0].foo).toBe("bar");

            const where = {
                foo: "bar"
            };
            const what = {
              $set:  {
                  foo2: "bar2"
              }
            };

            const updateQuery: any = await db.dbUpdate(collection, where, what, {});
            expect(updateQuery.error).toBe(null);
            done();
        });


    }, 1000 * 30);
});