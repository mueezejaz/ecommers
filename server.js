import bgGreen from"colors";
import  express  from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import morgan from "morgan";
import authRouts from "./routes/authRout.js"
import cors from "cors";
import CategoryRoutes from "./routes/categoryRouts.js"
import productRoute from "./routes/productRouter.js"
import path from "path";
import { fileURLToPath } from "url";
const app = express();
//env config
dotenv.config();
//config database
connectDB();
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
//midelware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors())
app.use(express.static(path.join(__dirname,'./client/build')))
//routes
app.use('/api/v1/auth',authRouts);
app.use('/api/v1/category',CategoryRoutes);
app.use("/api/v1/product",productRoute);
app.use("*",function(req,res){
    res.sendFile(path.join(__dirname,"./client/build/index.html"))
})
const port =process.env.PORT||8080;
app.get('/',(req,res)=>{
res.send('server is working')
})

app.listen(port,()=>{
    console.log(`app is runing on ${port}`.bgGreen.white)
});