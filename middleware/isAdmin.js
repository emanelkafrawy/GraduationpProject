const userModel = require('../models/userModel');

module.exports = async(req, res, nxt) => {
    try {
        const user = await userModel.findById(req.userId);
        if (user.role !== 'admin') {
            return res.status(401).json({
                message: "you're not authorized to perform this operation, only admin can perform that"
            });
        } 
        nxt();
    } catch(e) {
        return res.status(500).json({
            message: "an error occured"
        });
    }
}