import { userModel } from "../models/userModel";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface RegisterParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}


export const register = async({firstName, lastName, email, password}: RegisterParams)=>{
    try{
        const findUser = await userModel.findOne({email})
        if(findUser){
            return {data: "User already exists!", statusCode: 400};
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({firstName, lastName, email, password: hashedPassword});
        await newUser.save();
        return {data: generateJWT({email, firstName, lastName}), statusCode: 200};
    }
    catch(error){
        console.error("Error while registering user:", error);
        return { data: "Internal Server Error", statusCode: 500 };
    }
}

interface  LoginParams {
    email: string;
    password: string;
}

export const login = async({email, password}: LoginParams)=>{
    try{
        const findUser = await userModel.findOne({email});
        if(!findUser){
            return {data: "User not found!", statusCode: 401};
        }
        const passwordMatch = await bcrypt.compare(password, findUser.password);
        if(passwordMatch){
            return {data: generateJWT({email, firstName: findUser.firstName, lastName: findUser.lastName}), statusCode: 200};
        }
        return {data: "Incorrect password!", statusCode: 401};
    }
    catch(error){
        console.error("Error while login user:", error);
        return { data: "Internal Server Error", statusCode: 500 };
    }
}

const generateJWT = (data: any) => {
    return jwt.sign(data, process.env.JWT_SECRET || '');
    // return jwt.sign(data, 'eCY970YY5XxByAryYXrgi9qcq4JT8xf9', {expiresIn: '24h'});
}