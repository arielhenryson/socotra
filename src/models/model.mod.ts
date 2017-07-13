import { DB } from  '../core'
import { DBHelper }  from '../services/dbHelper.service'


export abstract class Model extends DB {
    public DBHelper
    
    constructor() {
        super()
        
        this.DBHelper = new DBHelper()
    }
}
