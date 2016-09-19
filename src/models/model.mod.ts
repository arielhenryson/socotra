/// <reference path="../core/_all.d.ts" />


import {DB} from  '../core/lib/db';
import {DBHelper}  from '../services/dbHelper.service';

const config = require('../config/config.json');

export abstract class Model extends DB {
    public DBHelper;
    
    constructor() {
        super();
        
        this.DBHelper = new DBHelper();
    }
}