import { cartModel } from "../models/cartModel";
import productModel from "../models/productModel";

interface CreateCartForUser {
    userId: string;
}

const createCartForUser = async({userId}: CreateCartForUser)=>{
    try{
        const cart = await cartModel.create({userId, totalAmount: 0});
        await cart.save();
        return cart;
    }
    catch(error){
        console.error("Error while creating cart for user:", error);
        return { data: "Internal Server Error", statusCode: 500 };
    }
}

interface GetActiveCartForUser {
    userId: string;
}



export const getActiveCartForUser = async({userId}: GetActiveCartForUser)=>{
    try{
        let cart = await cartModel.findOne({userId, status: "active"});
        if(!cart){
            let cart = await createCartForUser({userId});
            return cart;
        }
        return cart;
    }
    catch(error){
        console.error("Error while getting active cart for user:", error);
        return { data: "Internal Server Error", statusCode: 500 };
    }
}

interface AddItemToCart{
    userId: string;
    productId: string;
    quantity: number;
}

export const addItemToCart = async ({userId, productId, quantity}: AddItemToCart)=>{
    try{
        let cartResult = await getActiveCartForUser({userId});
        if (!cartResult) {
            return { data: "Cart not found", statusCode: 404 };
        }
        const cart = cartResult as any;
        // check the item already exists in the cart or not 
        // toString() as it is an object and the productId is string
        const existsInCart = cart.items.find((item: any) => item.product.toString() === productId);
        if(existsInCart){
            existsInCart.quantity += quantity;
        }
        let product = await productModel.findById(productId);
        if(!product){
            return { data: "Product not found", statusCode: 404 };
        }
        // check the item in stock or not
        if(product.stock < quantity){
            return { data: "Not enough stock", statusCode: 400 };
        }
        // Update the stock of the product
        product.stock -= quantity;
        // await product.save();
        if(!existsInCart){
            cart.items.push({product: productId, quantity, unitPrice: product.price});
        }
        // Update the total amount for the cart
        cart.totalAmount += quantity * product.price;
        // const updatedCart = await cart.save();
        await Promise.all([
            product.save(),
            cart.save()
        ]);
        return {data: cart, statusCode: 201};
    }
    catch(error){
        console.error("Error while adding item to cart:", error);
        return { data: "Internal Server Error", statusCode: 500 };
    }
}