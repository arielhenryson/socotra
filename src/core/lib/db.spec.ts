import { DB } from './db'


describe('database class', () => {
    DB.prototype.connect = () => {}


    it('should isValidId to say 5746b63b8f20bdd60741418a is valid _id', () => {
        const validID = DB.isValidId('5746b63b8f20bdd60741418a')
        expect(validID).toEqual(true)
    })


    it('should isValidId to say ABC is not valid _id', () => {
        const validID = DB.isValidId('ABC')
        expect(validID).toEqual(false)
    })


    it('should createNewId to create valid id', () => {
        const newID = DB.createNewId()
        const isNewKeyValid = DB.isValidId(newID)
        expect(isNewKeyValid).toEqual(true)
    })


    it('should  create valid id from 5746b63b8f20bdd60741418a', () => {
        const newID = DB.createNewId('5746b63b8f20bdd60741418a')
        const isNewKeyValid = DB.isValidId(newID)
        expect(isNewKeyValid).toEqual(true)
    })


    it('expect makeNewSolt to create random string', () => {
        const randomSolt = DB.makeNewSolt()
        expect(typeof randomSolt).toBe('string')
    })


    it('expect hash to return the same value for "foo bar" ', () => {
        const hash1 = DB.hash('foo bar', '')
        const hash2 = DB.hash('foo bar', '')
        expect(hash1).toEqual(hash2)
    })
})
