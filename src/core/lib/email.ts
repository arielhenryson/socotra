const nodemailer = require('nodemailer')
const fs = require('fs')
import { DB } from './db'
import { config } from '../global'

export class Email extends DB {
    private sender
    private id

    constructor() {
        super()
        // create reusable transporter object using the default SMTP transport
        this.sender = nodemailer.createTransport(`smtps://${config.smtp.user}:${config.smtp.password}@${config.smtp.host}`)
        this.id = DB.createNewId('')
    }


    send(options): void {
        // setup e-mail data with unicode symbols
        const mailOptions = {
            from: config.systemEmail,
            to: options.to,
            subject: options.subject,
            html: options.html
        }

        this.saveToDB(mailOptions)

        // send mail with defined transport object
        this.sender.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error)
            }
            console.log('Message sent: ' + info.response)
        })
    }


    // async function that load template by name
    // insert the parameters to the template
    // and then resolve the template
    render(templateName, params): Promise<any> {
        return new Promise(resolve => {
            fs.readFile(config.buildDir + '/views/email/build/' + templateName + '.html', (err, data) => {
                if (err) {
                    throw err
                }

                const browserLink = config.domain + '/_email/' + this.id
                let template = data.toString()

                // Insert the  param to the template
                for (const key in params) {
                    // For replace all string not only the first
                    // string we use regex with g
                    const re = new RegExp('{{' + key + '}}', 'g')
                    template = template.replace(re, params[key])
                }

                const re = new RegExp('{{_browserLink}}', 'g')
                template = template.replace(re, browserLink)

                resolve(template)
            })
        })
    }


    // async function that save every email sent from
    // the system
    private saveToDB(data): Promise<any> {
        const sentMail = data
        const newID = DB.createNewId('')

        data._id = this.id

        return new Promise((resolve, reject) => {
            this.db.collection('_sentEmails').insert(sentMail, (err, doc) => {
                if (err) {
                    resolve(false)

                    return
                }

                resolve({
                    error: 0,
                    _id: doc._id
                })

                return
            })
        })
    }
}
