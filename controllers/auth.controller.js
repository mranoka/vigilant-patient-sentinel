require('dotenv').config();
const jwt = require('jsonwebtoken');

// authenticates token generated by username-password combination
exports.userAuth = function (req, res) {
    const token = req.params.key;
    
    try {
        const decoded = jwt.verify(token, `${process.env.KEY_JWT}`);
        res.send({
            'username': `${decoded.username}`,
            'id': `${decoded.id_number}`,
            'admin': decoded.admin
        })
    } catch (err) {
        res.status(401).send({ 'err': 'Username and Password Combination Incorrect! Please TRY AGAIN' })
    }
}