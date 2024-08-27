import express from 'express';


const app = express();

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

const port = 3000;

import index from './routes/index.js';

app.use('/', index);



app.listen(port, ()=>{
    console.log(`[+] App started on port: ${port}`);
})