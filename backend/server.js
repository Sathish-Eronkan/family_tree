import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import routes from './routes/familyTreeRoutes.js';
const app = express();
const port = process.env.PORT || 5000;
app.get('/',(req,res)=>{
    res.send('API is running');
})

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cookie parser middleware
app.use(cookieParser());
app.use('/api',routes);

app.listen(port,() => console.log(`server is running on port ${port}`));