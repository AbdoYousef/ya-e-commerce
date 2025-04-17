import jwt from 'jsonwebtoken'
import { NextFunction, Response } from 'express'
import { ExtendedRequest } from '../types/extendedRequest'
import { userModel } from '../models/userModel';


const validateJWT = async(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
    )=>{
        try{
            const authorizationHeader = req.get('authorization');
            if(!authorizationHeader){
                res.status(403).send("Authorization header not provided");
                return;
            }
            const token = authorizationHeader.split(" ")[1];
            if(!token){
                res.status(403).send("Invalid token");
                return;
            }
            jwt.verify(token, process.env.JWT_SECRET || '', async (err: any, payload: any)=>{
                if(err){
                    res.status(403).send("Invalid token");
                    return;
                }
                if(!payload){
                    res.status(403).send("Invalid token payload");
                    return;
                }
                const userPayload = payload as {
                    email: string;
                    firstName: string;
                    lastName: string;
                };
                const user= await userModel.findOne({ email: userPayload.email});
                req.user = user;
                next();
                })

        }
        catch(error){
            console.error(error);
            res.status(500).send("Error validating JWT");
            return;
        }
}

export default validateJWT;