import express from 'express';


const router = express.Router();


router.get('/', (req, res)=>{
    res.send("works")
})

router.post('/post', (req, res)=>{
    console.log(req.body);

    res.send("post route works too")
})


export default router;