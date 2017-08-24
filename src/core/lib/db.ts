import * as crypto from 'crypto'
import { config } from '../global'
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID


let mongo = null

export class DB {
    public db = null


    constructor() {
        this.connect()
    }


    connect() {
        if (mongo !== null) {
            this.db = mongo

            return
        }


        const url = config[process.env.BUILD].mongoUrl

        MongoClient.connect('mongodb://' + url, (error, db) => {
            console.log('database connection established')
            mongo = db
            this.db = mongo
        })
    }


    async promiseConnection() {
        const self = this

        return new Promise(async(resolve) => {
            async function isConnected() {
                if (self.db !== null) {
                    const res = await self.dbInsert('_startLog', {})
                    if (!res.error) {
                        resolve(true)

                        return
                    }
                }


                setTimeout(() => {
                    isConnected()
                }, 1000)
            }

            isConnected()
        })
    }


    static isValidId(str: string) {
        str = str + ''
        const len = str.length
        let valid = false

        if (len === 12 || len === 24) {
            valid = /^[0-9a-fA-F]+$/.test(str)
        }

        return valid
    }


    static createNewId(value?: string) {
        if (DB.isValidId(value)) {
            return new ObjectID(value)
        }

        return new ObjectID()
    }


    private static makeDoc(data: MongoDoc): Object {
        const object = {
            _createdTime: new Date()
        }


        for (const key in data) {
            object[key] = data[key]
        }

        return object
    }


    static makeNewSolt(): string {
        return crypto.randomBytes(16).toString('hex')
    }


    static hash(value: string, solt: string): string {
        return crypto.createHmac('sha256', solt).update(value).digest('hex')
    }


    dbFindOne(collection: string, where: any, options?: any): Promise<SocotraAPIResponse> {
        options = options || {}

        return new Promise(resolve => {
            this.db.collection(collection).findOne(where, options, (error, data) => {
                resolve({
                    error: error,
                    data: data
                })
            })
        })
    }


    dbInsert(collection: string, docs, options?: any): Promise<SocotraAPIResponse> {
        options = options || {}

        return new Promise(resolve => {
            if (docs instanceof Array) {
                for (const i in docs) {
                    docs[i] = DB.makeDoc(docs[i])
                }
            } else {
                docs = DB.makeDoc(docs)
            }

            this.db.collection(collection).insert(docs, (error) => {
                resolve({
                    error: error
                })
            })
        })
    }


    dbUpdate(collection: string, where: any, what: any, options?: any): Promise<SocotraAPIResponse> {
        options = options || {}


        return new Promise(resolve => {
            this.db.collection(collection).update(where, what, options, (error, results) => {
                resolve({
                    error: error,
                    results: results
                })
            })
        })
    }


    dbFind(collection: string, where: any, options?: any): Promise<SocotraAPIResponse> {
        options = options || {}

        return new Promise(resolve => {
            this.db.collection(collection).find(where, options).toArray( (error, data) => {
                resolve({
                    error: error,
                    data: data
                })
            })
        })
    }
}
