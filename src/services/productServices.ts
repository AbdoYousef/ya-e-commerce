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
            {title: "Dell Laptop", image: "Product-1-image", price: 1000, stock: 100},
        ];
        // await productModel.create(products);
        const existingProducts = await getAllProducts();
        if(existingProducts.length === 0){
            await productModel.insertMany(products);
        }
    }
    catch (error) {
        console.error(error);
        throw new Error("Error seeding initial products");
    }
}