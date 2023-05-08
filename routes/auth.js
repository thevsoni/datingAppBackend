const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middlewear/fetchUser');

const JWT_SECRET = "Harryisagoodb$oy";




//Route 1 : create a user using: POST "/api/auth/createuser" , //no login required
router.post('/signup', async (req, res) => {

    try {

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ message: "error in auth in signup email exists" });
        }

        user = await User.findOne({ phoneNumber: req.body.phoneNumber });
        if (user) {
            return res.status(400).json({ message: "error in auth in signup phoneNumber exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        //create a new user
        // console.log(secPass)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: secPass,
            gender: req.body.gender,
            age: req.body.age,
            state: req.body.state,
            district: req.body.district,
            isProvider: req.body.isProvider,
            currentStatus: req.body.currentStatus,
            datingCharge: req.body.datingCharge,
            image: req.body.image,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.status(200).json({ message: "user added successfully", authtoken, name: user.name });

    } catch (err) {
        res.status(500).send("some error occured, so user not added");
    }

});



//Route 2:authenticate a user using :post /api/auth/login  ,//no login required
router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "in auth login ,error email" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(400).json({ error: "in auth login , error pwd" })
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ message: "login success ", authtoken, name: user.name });
    } catch (error) {
        res.status(500).send("error in auth in login");
    }
})


//Route 3: get all providers data using :post /api/auth/getAllProviders  ,//no login required
router.get('/getAllProviders', async (req, res) => {

    try {
        let providers = await User.find({ isProvider: true });
        if (!providers) {
            return res.status(400).json({ message: " no provider found" })
        }
        res.status(200).send(providers);
    } catch (error) {
        res.status(500).send("error in auth in login", error);
    }
})


//Route 4 : get user by token //login required
router.get('/getUser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send("error in get user by token , internal server error");
    }
})


//Route 5 : update user  //login required
router.post('/updateUser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findByIdAndUpdate(userId, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                gender: req.body.gender,
                age: req.body.age,
                phoneNumber: req.body.phoneNumber,
                isProvider: req.body.isProvider,
                currentStatus: req.body.currentStatus,
                datingCharge: req.body.datingCharge,
                image: req.body.image,
            }
        }, { new: true });

        res.status(200).send(user);
    } catch (error) {
        res.status(400).json({ error: " error in update user", error })
    }
})


//Route 6: get user by id //login required
router.get('/getUserById/:providerId', async (req, res) => {
    try {
        const user = await User.findById(req.params.providerId);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send("error in get user by id , internal server error");
    }
})

//send friend request //login required
router.post('/sendFriendRequest', async (req, res) => {
    try {
        const { userid, providerid } = req.body;
        const p = await User.findByIdAndUpdate(providerid, { $push: { friendsPending: userid } }, { new: true });
        const u = await User.findByIdAndUpdate(userid, { $push: { friends: providerid } }, { new: true });

        if (p && u) {
            res.status(200).send("frind request sent successfully", p, u)
        }
        else {
            res.status(400).send("some error occured , frind request not send ")
        }

    } catch (error) {
        res.status(400).send("error in send friend request ", error);
    }
})

//send pending to confirm //login required
router.post('/sendPendingToConfirm', async (req, res) => {
    try {
        const { userid, providerid } = req.body;
        const u = await User.findByIdAndUpdate(userid, { $push: { friends: providerid }, $pull: { friendsPending: providerid } }, { new: true });

        if (u) {
            res.status(200).send("frind request accepted. and added inside friends from friendsPending")
        }
        else {
            res.status(400).send("some error occured , friend are not added inside friends from friendsPending ")
        }

    } catch (error) {
        res.status(400).send("error in sendPendingToConfirm", error);
    }
})

//send pending to confirm //login required
router.post('/sendConfirmToPending', async (req, res) => {
    try {
        const { userid, providerid } = req.body;
        const u = await User.findByIdAndUpdate(userid, { $pull: { friends: providerid }, $push: { friendsPending: providerid } }, { new: true });

        if (u) {
            res.status(200).send("frind request sent to pending. and added inside friendsPending from friends")
        }
        else {
            res.status(400).send("some error occured , friend are not added inside friendpending from friends")
        }

    } catch (error) {
        res.status(400).send("error in sendConfirmToPending", error);
    }
})










//forgot password
module.exports = router;


