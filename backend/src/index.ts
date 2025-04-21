import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import userRoute from './routes/userRoute';
import { seedInitialProducts } from './services/productServices';
import cartRoute from './routes/cartRoute';
import productRoute from './routes/productRoute';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DATABASE_URL || '')
.then(() => console.log("connected to ecommerce db!"))
.catch((err) => console.log(`Error connecting to ecommerce db: ${err}`));

seedInitialProducts();
app.use('/user', userRoute);
app.use('/product', productRoute)
app.use('/cart', cartRoute);

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})