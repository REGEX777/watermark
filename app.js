import 'dotenv/config'
import express from 'express';
import mongoose, { mongo } from 'mongoose';
import session from 'express-session';
import flash from 'express-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';

import User from './models/User.js';

const app = express();

// database connect
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("[+] Connection to database succesfull")
}).catch(err=>console.log(err))


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true

}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return done(null, false, { message: 'Invalid email or password.' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

const port = 3000;

import index from './routes/index.js';
import editor from './routes/editor.js';
import signup from './routes/signup.js';
import login from './routes/login.js'

app.use('/', index);
app.use('/editor', editor)
app.use('/signup', signup)
app.use('/login', login)


app.listen(port, ()=>{
    console.log(`[+] App started on port: ${port}`);
})