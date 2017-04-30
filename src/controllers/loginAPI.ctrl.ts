module.exports = (req, res) => {
    res.send("login api will be here soon");

    for (let i in req.body) {
        console.log(i, req.body[i], typeof req.body[i]);
    }
};