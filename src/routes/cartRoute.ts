import express from 'express';
import { addItemToCart, clearCart, deleteItemInCart, getActiveCartForUser, updateItemInCart } from '../services/cartServices';
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

router.delete('', validateJWT), async(req: ExtendedRequest, res: any)=>{
    try{
        const userId = req?.user?._id;
        const response = await clearCart({userId});
        res.status(response.statusCode).send(response.data);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

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

router.put("/items/:id", validateJWT, async(req: ExtendedRequest, res)=>{
    try {
        const userId = req?.user?._id;
        if (!userId) {
            return void res.status(401).json({ message: 'Unauthorized' });
        }
        const {productId, quantity} = req.body;
        const response = await updateItemInCart({userId, productId, quantity});
        res.status(response.statusCode).send(response.data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.delete('/items/:productId', validateJWT, async (req: ExtendedRequest, res: any)=>{
    try {
        const userId = req?.user?._id;
        if (!userId) {
            return void res.status(401).json({ message: 'Unauthorized' });
        }
        const {productId} = req.params;
        const response = await deleteItemInCart({userId, productId});
        if (!response) {
            return res.status(500).json({ message: "Failed to delete item" });
        }
        res.status(response.statusCode).send(response.data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

export default router;