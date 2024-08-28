import 'dotenv/config'
import express from 'express';
import mongoose, { mongo } from 'mongoose';

const app = express();

// database connect
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("[+] Connection to database succesfull")
}).catch(err=>console.log(err))


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

const port = 3000;

import index from './routes/index.js';
import editor from './routes/editor.js';
import signup from './routes/signup.js'

app.use('/', index);
app.use('/editor', editor)
app.use('/signup', signup)


app.listen(port, ()=>{
    console.log(`[+] App started on port: ${port}`);
})