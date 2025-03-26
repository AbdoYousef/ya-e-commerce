import express from 'express';
import { addItemToCart, getActiveCartForUser } from '../services/cartServices';
import  validateJWT  from '../middlewares/validateJWT';
import { ExtendedRequest } from '../types/extendedRequest'

const router = express.Router();

router.get('/', validateJWT, async (req: ExtendedRequest, res) => {
    try {
        const userId = req?.user?._id;

        if (!userId) {
            return void res.status(401).json({ message: 'Unauthorized' });
        }
        const cart = await getActiveCartForUser({userId});
        res.status(200).send(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/items', validateJWT, async (req: ExtendedRequest, res)=>{
    try {
        const userId = req?.user?._id;
        if (!userId) {
            return void res.status(401).json({ message: 'Unauthorized' });
        }
        const {productId, quantity} = req.body;
        const response = await addItemToCart({userId, productId, quantity});
        res.status(response.statusCode).send(response.data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

export default router;