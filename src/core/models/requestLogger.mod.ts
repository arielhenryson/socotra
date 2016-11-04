import {DB} from  '../lib/db';

export class RequestLogger extends DB {
    constructor() {
        super();
    }
    
    public log(requestData: Object) {
        const obj = DB.makeDoc(requestData);
        
        this.db.collection("_request").insert(obj);
    }
}