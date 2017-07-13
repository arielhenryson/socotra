import { Model } from  './model.mod'


export class Activation extends Model {
    constructor() {
        super()
    }
    
    private async getAccountData(activationKey: string) {
        const where = {
            activationKey
        }


        const res: any = await this.dbFindOne('users', where, {})
        if (res.error) return false

        return res.data
    }
    
    private async verifiedUser(activationKey: string) {
        const where = {
            activationKey: activationKey
        }
        
        const what = {
            $set: {
                verified: true
            }
        }

        const res: any = await this.dbUpdate('users', where, what, {})
        return !res.error

    }
    
    public async activateAccount(activationKey: string) {
        const userData = await this.getAccountData(activationKey)
        
        if (!userData) {
            return {
                error: 1, 
                msg: 'code not match any user'
            }
        }
        
        
        const verifiedUser = await this.verifiedUser(activationKey)
        if (!verifiedUser) {
            return {
                error: 1, 
                msg: "Can't write to db"
            }
        }
        
        return {
            error: 0, 
            msg: 'email account verified successfully'
        }
    }
}
