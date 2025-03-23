import productModel from "../models/productModel";

export const getAllProducts = async ()=>{
    try {
        const products = await productModel.find();
        return products;
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching products");
    }
}

export const seedInitialProducts = async ()=>{
    try {
        const products = [
            {title: "Product 1", image: "Product-1-image", price: 10.99, stock: 100},
        ];
    }
    catch (error) {
        console.error(error);
        throw new Error("Error seeding initial products");
    }
}