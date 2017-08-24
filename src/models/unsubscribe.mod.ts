import { Model } from  './model.mod'

export class Unsubscribe extends Model {
    constructor() {
        super()
    }
    
    private async addToUnsubscribe(email) {
        const obj = {
            email: email
        }

        const res: SocotraAPIResponse = await this.dbInsert('unsubscribe', obj, {})

        return !res.error
    }
    
    public async blockUser(userID) {
        const userEmail = await this.DBHelper.getUserEmailById(userID)
        
        if (!userEmail) {
            return {
                error: 1, 
                msg: 'userID was not found'
            }
        }

        
        const results = await this.addToUnsubscribe(userEmail)

        return {
            error: 0, 
            msg: 'user successfully was add to the unsubscribe list'
        }
    }
}
