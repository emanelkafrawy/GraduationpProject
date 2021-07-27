const jwt = require('jsonwebtoken');
const data = require('../data');
module.exports = (req, res, nxt) => {
    const authHeader = req.get('Authorization'); //get de btgeb value l auth header
    if(!authHeader) {
        const err = new Error('Not authenticated');
        err.statusCode = 401;
        throw err;
    }
    const token = authHeader.split(' ')[1]; 
    let decodedToken;
    try {
        //verify bt decode w verify l token lkn decoder b decode bs
        decodedToken = jwt.verify(token, data.SECRET); //nfs l secret key l x l login function
    } catch(err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const err = new Error('Not authenticated');
        err.statusCode = 401;
        throw err;
    }
    req.userId = decodedToken.userId;
    nxt();
};