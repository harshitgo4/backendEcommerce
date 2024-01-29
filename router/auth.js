const express = require('express');
const { createUser, loginUser, checkUser, logout } = require('../controller/auth');
const passport = require('passport');

const router = express.Router();
//  /auth is already added in base path
router.post('/signup', createUser).post('/login', passport.authenticate('local'), loginUser).get('/check',passport.authenticate('jwt'),checkUser).get('/logout',logout);

exports.router = router; 