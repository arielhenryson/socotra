import {Unsubscribe} from '../models/unsubscribe.mod'


module.exports = (req, res) => {
    const userID = req.params.userID
    
    const UnsubscribeObj = new Unsubscribe
    const blockUser = UnsubscribeObj.blockUser(userID)
    blockUser.then((resutls) => {
        console.log(resutls)
        res.send(resutls)
    })
}
