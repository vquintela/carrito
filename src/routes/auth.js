const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    if(!req.body.email.trim() || !req.body.password.trim()) {
        req.flash('message', 'Complete todos los campos')
        res.redirect('signin')
        return
    }
    passport.authenticate('local.signin', {
        successRedirect: 'profile',
        failureRedirect: 'signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('signin');
})


module.exports = router