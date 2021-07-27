const router = require('express').Router();
const User = require('../model/User');
const {registerValidation} = require('../Controller/Validation');

router.post('/register', async (req,res) => {

    // Validate data
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    try{
        await user.save();
        res.send(user);
    }catch(err){
        res.status(400).send(err);
    }
});


module.exports = router;    