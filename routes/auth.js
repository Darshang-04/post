const express = require('express')
const route = express.Router()
const mongoose = require('mongoose')
const USER = mongoose.model("USER")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwt_secret, emailsender, senderpassword } = require('../keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
route.use(express.json())

route.post('/signup', (req, res) => {
    const { name, username, email, password } = req.body;

    // Validate if all required fields are present
    if (!name || !username || !email || !password) {
        return res.status(422).json({ error: "Please fill all the fields" });
    }

    // Check if the email or username already exists in the database
    USER.findOne({ $or: [{ email: email }, { username: username }] }).then((saved) => {
        if (saved) {
            return res.status(422).json({ error: "Email or username already exists! Please try others." });
        }

        // Hash the password
        bcrypt.hash(password, 12).then((hashedpassword) => {
            const user = new USER({
                name,
                username,
                email,
                password: hashedpassword
            });

            // Save the user in the database
            user.save()
                .then(newUser => {
                    // Email sending logic after successful registration
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: emailsender,
                            pass: senderpassword
                        }
                    });

                    const maildetail = {
                        from: emailsender,
                        to: email,
                        subject: 'Verification Email',
                        text: `Hi, ${name} \n\nThis is Website builder team. This email is sent to confirm that you have successfully signed up on our website.\n\nEnjoy using it!\n\nThanks,\nClone Team`
                    };

                    // Send email
                    transporter.sendMail(maildetail)
                        .then(() => {
                            res.status(201).json({
                                message: "Successfully signed up and email has been sent!",
                                user: {
                                    _id: newUser._id,
                                    name: newUser.name,
                                    email: newUser.email,
                                    username: newUser.username
                                }
                            });
                        })
                        .catch((err) => {
                            console.error("Error sending email: ", err.stack); // Log the full error stack for debugging
                            res.status(500).json({ error: "Registration successful, but failed to send email." });
                        });
                })
                .catch(err => {
                    console.log("Error saving user: ", err);
                    res.status(500).json({ error: "Internal server error during signup" });
                });
        }).catch(err => {
            console.log("Error hashing password: ", err);
            res.status(500).json({ error: "Failed to hash password" });
        });
    }).catch(err => {
        console.error("Error finding user: ", err);
        res.status(500).json({ error: "Internal server error during user lookup" });
    });
});
route.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "please enter email and password!" })
    }

    USER.findOne({ email: email }).then((savedUser) => {
        if (!savedUser) {
            res.status(422).json({ error: "Invalid Email!" })
        }
        bcrypt.compare(password, savedUser.password).then((match) => {
            if (match) {
                // res.status(200).json({message:"Successfully Login!"})
                const token = jwt.sign({ _id: savedUser.id }, jwt_secret)
                const { _id, name, email, username } = savedUser
                res.json({ token, user: { _id, name, email, username } })
                // console.log({token, user:{_id,name,email,username}})
            }
            else {
                res.status(422).json({ error: "Invalid Cradential!" })
            }
        })

    }
    )
})

module.exports = route;