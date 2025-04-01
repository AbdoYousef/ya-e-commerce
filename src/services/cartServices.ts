import { cartModel, ICart } from "../models/cartModel";
import { IOrderItem, orderModel } from "../models/oderModel";
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

// Update product in cart

interface UpdateItemInCart {
    userId: string;
    productId: string;
    quantity: number;
}

export const updateItemInCart = async ({userId, productId, quantity}: UpdateItemInCart) => {
    try{
        const cart  = await getActiveCartForUser({userId});
        if ("statusCode" in cart) {
            return cart; 
        }
        const existsInCart = cart.items.find((item)=>item.product.toString() === productId);
        if(!existsInCart){
            return { data: "Item not found in the cart", statusCode: 404 };
        }
        const product = await productModel.findById(productId);
        if(!product){
            return { data: "Product not found", statusCode: 404 };
        }
        if(product.stock < quantity){
            return { data: "Not enough stock", statusCode: 400 };
        }
        // Update the stock of the product
        const otherCartItems = cart.items.filter((item)=>item.product.toString() !== productId);
        let total = otherCartItems.reduce((sum: any, product: any)=>{
            return sum += product.quantity * product.unitPrice;
        }, 0);
        existsInCart.quantity = quantity;
        total += existsInCart.quantity * existsInCart.unitPrice;
        cart.totalAmount = total;
        const updatedCart= await cart.save();
        return { data: updatedCart, statusCode: 200 }; 
    }
    catch(err){
        console.error(err);
        return { data: "Internal Server Error", statusCode: 500 };
    }
}


// Delete product from cart
interface DeleteItemInCart {
    userId: string;
    productId: string;
}

export const deleteItemInCart = async({ userId, productId }: DeleteItemInCart) => {
    try{
        const cart = await getActiveCartForUser({userId});
        if ("statusCode" in cart) {
            return cart; 
        }
        const existsInCart = cart.items.find((item)=>item.product.toString() === productId);
        if(!existsInCart){
            return { data: "Item not found in the cart", statusCode: 404 };
        }
        const otherCartItems = cart.items.filter((item)=>item.product.toString() !== productId);
        let total = otherCartItems.reduce((sum: any, product: any)=>{
            return sum += product.quantity * product.unitPrice;
        }, 0);
        cart.items = otherCartItems;
        cart.totalAmount = total;
        const updatedCart= await cart.save();
        return { data: updatedCart, statusCode: 200 }; 


    }
    catch(err){
        console.error(err);
        return { data: "Internal Server Error", statusCode: 500 };
    }
}

// const calculateCartTotalItems = ({cart, productId}: { cart: ICart, productId: string})=>{
//     const otherCartItems = cart.items.filter((item)=>item.product.toString() !== productId);
//         let total = otherCartItems.reduce((sum: any, product: any)=>{
//             return sum += product.quantity * product.unitPrice;
//         }, 0);
// }

interface ClearCart {
    userId: string;
}

export const clearCart = async ({userId}: ClearCart) => {
    try{

        const cart = await getActiveCartForUser({userId});
        if ("statusCode" in cart) {
            return cart; 
        }
        cart.items = [];
        cart.totalAmount = 0;
        const updateCart = await cart.save();
        return { data: updateCart, statusCode: 200 };
    }
    catch(err){
        console.error(err);
        return { data: "Internal Server Error", statusCode: 500 };
    }
}

interface Checkout {
    userId: string;
    address: string;
}

export const checkout = async ({userId, address}: Checkout) => {
    try{
        if(!address){
            return { data: "Address is required", statusCode: 400 };
        }
        const cart = await getActiveCartForUser({userId});
        if ("statusCode" in cart) {
            return cart; 
        }
        const orderItems: IOrderItem[] = [];
        for(const item of cart.items){
            const product = await productModel.findById(item.product);
            if(!product){
                return { data: "Product not found", statusCode: 404 };
            }
            const orderItem: IOrderItem = {
                productTitle: product.title,
                productImage: product.image,
                unitPrice: item.unitPrice,
                quantity: item.quantity
            };
            orderItems.push(orderItem);
        }
        const order = await orderModel.create({
            orderItems,
            total: cart.totalAmount,
            userId,
            address
        });
        await order.save();
        
        // Update cart status to be completed
        cart.status = "completed";
        await cart.save();
        return { data: order, statusCode: 201 };
    }
    catch(err){
        console.error(err);
        return { data: "Internal Server Error", statusCode: 500 };
    }
}