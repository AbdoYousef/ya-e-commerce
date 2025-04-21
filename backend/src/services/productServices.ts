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
            {title: "Dell Laptop",
                image: "https://i5.walmartimages.com/seo/HP-15-6-FHD-Laptop-AMD-Ryzen-5-7520U-8GB-RAM-256GB-SSD-Pale-Rose-Gold-Windows-11-Home-15-fc0039wm_016446eb-4ada-4429-84b0-4badb49d083e.d83a8f1aeadc64a771d4dd1c375c46bd.jpeg",
                price: 1000,
                stock: 100},
            {title: "Asus Laptop",
                image: "https://i5.walmartimages.com/seo/HP-15-6-FHD-Laptop-AMD-Ryzen-5-7520U-8GB-RAM-256GB-SSD-Pale-Rose-Gold-Windows-11-Home-15-fc0039wm_016446eb-4ada-4429-84b0-4badb49d083e.d83a8f1aeadc64a771d4dd1c375c46bd.jpeg",
                price: 15000,
                stock: 50},
            {title: "HP Laptop",
                image: "https://i5.walmartimages.com/seo/HP-15-6-FHD-Laptop-AMD-Ryzen-5-7520U-8GB-RAM-256GB-SSD-Pale-Rose-Gold-Windows-11-Home-15-fc0039wm_016446eb-4ada-4429-84b0-4badb49d083e.d83a8f1aeadc64a771d4dd1c375c46bd.jpeg",
                price: 20000,
                stock: 80},
        ];
        // await productModel.create(products);
        const existingProducts = await getAllProducts();
        if(existingProducts.length === 0){
            await productModel.insertMany(products);
        }
    }
    catch (error) {
        console.error(error);
        // throw new Error("Error seeding initial products");
    }
}