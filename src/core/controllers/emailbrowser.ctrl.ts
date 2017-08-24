import { DB } from '../lib/db'


module.exports = (req, res) => {
    const id: string = req.params.id
    const DBObj = new DB()
    const emailObjectID = DB.createNewId(id)


    DBObj.db.collection('_sentEmails').findOne({ _id: emailObjectID}, (err, doc) => {
        if (doc === null) {
            res.send('This page is not available any more')

            return
        }
        
        let email = doc.html
        const re = new RegExp('{{_hideOnBrowser}}', 'g')
        email = email.replace(re, 'display:none')
        
        res.send(email)
    })
}
