import {Model} from  './model.mod';


export class Activation extends Model {
    constructor() {
        super();
    }
    
    private getAccountData(activationKey: string) {
        const where = {
            activationKey: activationKey
        };
        
        return new Promise((resolve, reject) => {
            this.db.collection("users").findOne(where, (err, doc) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (doc === null) {
                    resolve(false);
                    return;
                }
                
                resolve(true);
            });
        });
    }
    
    private verfidUser(activationKey: string) {
        const where = {
            activationKey: activationKey
        };
        
        const what = {
            $set: {
                verified: true
            }
        };
        
        return new Promise((resolve, reject) => {
            this.db.collection("users").update(where, what, (err, doc) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (doc === null) {
                    resolve(false);
                }
                
                resolve(true);
            });
        });
    }
    
    public async activateAccount(activationKey: string) {
        const userData = await this.getAccountData(activationKey);
        
        if (!userData) {
            return {
                error: 1, 
                msg: "code not match any user"
            };
        }
        
        
        const verifiedUser = await this.verfidUser(activationKey);
        if (!verifiedUser) {
            return {
                error: 1, 
                msg: "Can't write to db"
            };
        }
        
        return {
            error: 0, 
            msg: "email account verified successfully"
        };
    }
}