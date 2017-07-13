import { Email }  from '../core/'
import { DBHelper }  from './dbHelper.service'

const config = require('../config/config.json')


// the class is use to send all the email from the app
export class AppEmail extends Email {
    public DBHelper
    
    constructor() {
        super()
        this.DBHelper = new DBHelper()
    }
    
    public async render(templateName, data) {
        let templateData = {
            _appName: config.appName, 
            _domain: config.domain
        }
        
        for (let key in data) {
            templateData[key] = data[key]
        }
        
        let template = await super.render(templateName, templateData)
        let finalTemplate = String(template)
        let userId = await this.DBHelper.getUserIdByEmail(data.to)
        let unsubscribeLink: string = config.domain + '/unsubscribe/' + userId
        finalTemplate = finalTemplate.replace('{{unsubscribeLink}}', unsubscribeLink)

        return finalTemplate
    }
    
    public isInUnsubscribe(email: string) {
        const where = {
            email: email
        }

        return new Promise((resolve, reject) => {
            this.db.collection('unsubscribe').findOne(where, (err, doc) => {
                if (err) {
                    reject(err)
                    return
                }
                
                if (doc !== null) {
                    resolve(true)
                    return
                }
                
                resolve(false)
            })
        })
    }
    
    public async send(options) {
        const isInUnsubscribe = await this.isInUnsubscribe(options.to)
        if (isInUnsubscribe) {
            console.log("Can't send mail to " + options.to + ' email is in unsubscribe list')
            return false
        }
        
        super.send(options)
    }
}
