import {Auth} from '../models/auth.mod';

module.exports = (req, res) => {
    const email: string = req.query.email;
    const password: string = req.query.password;

    const AuthOBJ = new Auth();
    const createUser = AuthOBJ.createUser(email, password);
    createUser.then(results => {
        if (results.error) {
            res.json(results);
            return;
        }

        res.json({
            msg: "user created successfully",
            error: 0
        });
    });
};