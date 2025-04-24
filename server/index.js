const express=require("express");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const morgan=require("morgan")
const dotenv=require("dotenv");
const {dbConnection}=require("./utils/index")
const {routeNotFound,errorHandler}=require("./middleware/errorMiddlewaves")
dotenv.config();
dbConnection();
const app=express();
const routes=require("./routes/index")
const port=process.env.PORT||5000;
app.use(cors({
origin:['http://localhost:3000','http://localhost:3001'],
methods:["GET","POST","PUT","DELETE"],
credentials:true,
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(morgan("dev"))
app.use('/api',routes);
app.use(routeNotFound);
app.use(errorHandler)
app.listen(port,()=>{
    console.log(`Server is running at port ${port}`);
})