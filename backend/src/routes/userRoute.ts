import express from 'express'
import { login, register } from '../services/userServices';


const router = express.Router();

// Register Router
router.post('/register', async(req, res) => {
    try{
        const{firstName, lastName, email, password} = req.body;
        const {statusCode, data} = await register({firstName, lastName, email, password});
        res.status(statusCode).json(data);

    }
    catch(err){
        console.error(err);
        res.status(500).send({error: 'Internal Server Error'});
    }
});

// Login Route
router.post('/login', async(req, res) => {
    try{
        const {email, password}= req.body;
        const {statusCode, data}= await login({email, password});
        res.status(statusCode).json(data);
    }
    catch(err){
        console.error(err);
        res.status(500).send({error: 'Internal Server Error'});
    }
})

export default router;