import express from 'express'
import mongoose from 'mongoose'
import userRoute from './routes/userRoute';
import { seedInitialProducts } from './services/productServices';
import cartRoute from './routes/cartRoute';
import productRoute from './routes/productRoute';

const app = express();
const port = 3001;

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
.then(() => console.log("connected to ecommerce db!"))
.catch((err) => console.log(`Error connecting to ecommerce db: ${err}`));

seedInitialProducts();
app.use('/user', userRoute);
app.use('/product', productRoute)
app.use('/cart', cartRoute);

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})