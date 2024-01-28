require('dotenv').config()
const mongoose =require('mongoose')
const express=require('express');
const session = require('express-session');
const passport = require('passport');
const cors=require('cors')
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const crypto = require('crypto');
const cookieParser = require('cookie-parser'); 
const jwt = require('jsonwebtoken');
const { env } = require('process');
const { createProduct } = require('./controller/productcontroller'); 
const productRouter =require('./router/product')
const brandsRouter=require('./router/brands')
const categoriesRouter=require('./router/categories')
const AuthRouter=require('./router/auth')
const UsersRouter=require('./router/user')
const cartsRouter=require('./router/cart')
const orderRouter=require('./router/order');
const { isAuth, sanitizeUser, cookieExtractor } = require('./services/common'); 
const { User } = require('./model/User');
const server =express();
const path = require('path');
 
// JWT options
const opts = {};
opts.jwtFromRequest = cookieExtractor
opts.secretOrKey = process.env.JWT_SECRET_KEY; // TODO: should not be in code;
//middleWare

server.use(express.static(path.resolve(__dirname,'build'))) 
server.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false, // don't save session if unmodified
      saveUninitialized: false, // don't create session until something stored
    })
  );
  server.use(cookieParser())
  server.use(passport.authenticate('session'));
server.use(cors({
    exposedHeaders: ['X-Total-Count'], 
}));
 
server.use(express.json())
server.use('/products',isAuth(),productRouter.router);
server.use('/brands',isAuth(),brandsRouter.router);
server.use('/categories',isAuth(),categoriesRouter.router)
server.use('/auth',AuthRouter.router)
server.use('/users',isAuth(),UsersRouter.router)
server.use('/cart',isAuth(),cartsRouter.router)
server.use('/orders',isAuth(),orderRouter.router)

// Passport Strategies
passport.use(
    'local',
   
    new LocalStrategy( {usernameField:'email'},async function (email, password, done) {
      // by default passport uses username
      try {
        console.log('login',email,password);
        
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: 'invalid credentials' }); // for safety
        }
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          'sha256',
          async function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: 'invalid credentials' });
            }
            const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
            done(null, {id:user.id, role:user.role, token}); // this lines sends to serializer
          }
        );
      } catch (err) {
        done(err);
      }
    })
  );
  passport.use(
    'jwt',
    new JwtStrategy(opts, async function (jwt_payload, done) { 
      console.log('jwt',{ jwt_payload });
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, sanitizeUser(user)); // this calls serializer
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
  // this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
    console.log('serialize', user);
    process.nextTick(function () {
      return cb(null,{ id: user.id, role: user.role });
    });
  });
  
  // this changes session variable req.user when called from authorized request
  
  passport.deserializeUser(function (user, cb) {
    console.log('de-serialize', user);
    process.nextTick(function () {
      return cb(null, user);
    });
  });


  main().catch((err) => console.log(err));

  async function main() { 
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('database connected');
  }
server.listen(process.env.PORT,()=>{
    console.log('Server Started');
})