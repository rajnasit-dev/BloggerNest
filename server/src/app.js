import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

//These middlewares make sure that when a request comes with a JSON or form body, it gets parsed and becomes accessible via req.body.
app.use(express.json());// for JSON body
app.use(express.urlencoded({extended: true}));// for form submissions
app.use(express.static("public"));
app.use(cookieParser());


//Routes import
import userRouter from './routes/user.routes.js'

//Routes declaration
app.use('/api/v1/user', userRouter);
export {app}