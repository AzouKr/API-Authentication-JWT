const router = require("express").Router();
const verify = require('../verifyToken');



router.get('/private', verify, (req, res) => {
    res.send('you are allowed to access this private route !!!');
});

module.exports = router;
 