import { DB } from  '../lib/db'

export class RequestLogger extends DB {
    constructor() {
        super()
    }
    
    public log(requestData: Object) {
        this.dbInsert('_request', requestData)
    }
}
