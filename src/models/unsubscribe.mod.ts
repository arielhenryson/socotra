import {Model} from  './model.mod';

export class Unsubscribe extends Model {
    constructor() {
        super();
    }
    
    private addToUnsubscribe(email) {
        const obj = Model.makeDoc({
            email: email
        });
        
        return new Promise((resolve) => {
            this.db.collection("unsubscribe").insert(obj, (err, doc) => {
                if (err) {
                    resolve(false);
                    return;
                }
                
                resolve(true);
            });
        });
    }
    
    public async blockUser(userID) {
        const userEmail = await this.DBHelper.getUserEmailById(userID);
        
        if (!userEmail) {
            return {
                error: 1, 
                msg: "userID was not found"
            };
        }

        
        const results = await this.addToUnsubscribe(userEmail);
        console.log(results);
        return {
            error: 0, 
            msg: "user successfully was add to the unsubscribe list"
        };
    }
}