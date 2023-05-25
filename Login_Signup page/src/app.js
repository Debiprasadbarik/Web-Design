const express = require("express");
const path= require("path");
const app = express();
require("./db/conn");
const Register = require("./models/registers");
const port= process.env.PORT || 3000;

const static_path =path.join(__dirname,"../public");
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));


app.get("/",(req, res) => {
    res.render("index");
})

app.get("/register",(req, res) => {
    res.render("register");
})
app.get("/login",(req, res) => {
    res.render("login");
})
//create a new user in our database
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.compassword;
        if(password === cpassword){
            const registerEmployee = new Register({
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                password: password,
                compassword: cpassword
            })

         const registered =  await registerEmployee.save();
         res.status(201).render("index");
        }else{
            res.send("credentials are not matching");
        }

    } catch (error) {
        res.status(400).send("something went wrong");
    }
})




//for login
app.post("/login",async(req, res) => {
    try {
        const email= req.body.email;
        const password= req.body.password;
       const useremail= await Register.findOne({email:email});
       if(useremail.password === password){
            res.status(201).render("index");
       }else{
            res.send(" Login credentials are not matching");
       }

    } catch (error) {
        res.status(400).send("invalid Login Details");
    }
})

// app.get("/",(req,res)=>{
//     res.send("hello")
// });

app.listen(port,()=>{
    console.log(`server is running at port no ${port}`);
})