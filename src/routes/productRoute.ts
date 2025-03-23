import express from "express";
import { getAllProducts } from "../services/productServices";

const router = express.Router();

router.get('/', async(req, res)=>{
    try {
        const products = await getAllProducts();
        res.status(200).send(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;
