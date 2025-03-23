import express from 'express'
import mongoose from 'mongoose'
import userRoute from './routes/userRoute';
import { seedInitialProducts } from './services/productServices';

const app = express();
const port = 3001;

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
.then(() => console.log("connected to ecommerce db!"))
.catch((err) => console.log(`Error connecting to ecommerce db: ${err}`));

app.use('/user', userRoute)
seedInitialProducts();

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})