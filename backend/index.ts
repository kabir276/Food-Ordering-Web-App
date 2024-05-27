import { Application } from "express";
import express from 'express';
import cors from 'cors';
import adminRouter from "./routes/admin";
import userRouter from "./routes/user";
import cartRouter from "./routes/cart";
import orderRouter from "./routes/orders";
import addressRouter from "./routes/address";
import menuRouter from "./routes/menu";
import dotenv from 'dotenv';
import serverless from 'serverless-http';

dotenv.config();

export const app: Application = express();

const port = 3001;
app.use(cors());
app.use(express.json());

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/user/menu", menuRouter);
app.use("/user/cart", cartRouter);
app.use("/user/order", orderRouter);
app.use("/user/address", addressRouter);
app.get("/",(req,res)=>{
    res.status(200).json("Ok")
})
if (process.env.NODE_ENV !== 'production') {
    const http = require('http');
    const httpserver = http.createServer(app);
    httpserver.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports.handler = serverless(app);