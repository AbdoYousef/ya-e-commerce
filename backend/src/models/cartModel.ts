import mongoose, {Schema, Document, ObjectId} from "mongoose";
import { IProduct } from "./productModel";

const CartStatusEnum = ["active", "completed"];

export interface ICartItem {
    product: IProduct;
    quantity: number;
    unitPrice: number;
}

export interface ICart extends Document{
    userId: string | ObjectId;
    items: ICartItem[];
    totalAmount: number;
    status: "active" | "completed"; 
}

const cartItemSchema = new Schema<ICartItem>({
    product: { type: Schema.Types.ObjectId, ref: "products", required: true },
    quantity: { type: Number, default: 1, required: true },
    unitPrice: { type: Number, required: true }
})

const cartSchema = new Schema<ICart>({
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    items: [cartItemSchema],
    totalAmount: { type: Number, default: 0, required: true },
    status: { type: String, enum: CartStatusEnum, default: "active" }
})

export const cartModel = mongoose.model<ICart>("carts", cartSchema);
