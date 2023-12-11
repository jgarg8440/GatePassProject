const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const studentData = require('./models/student');
// const Approvemodel = require('./models/Approve');
const PORT = 8080;

// Connection in mongodb


// async function connectToDatabase(databaseUrl) {
//   try {
//     await mongoose.connect(databaseUrl);
//     console.log(`Connection to ${databaseUrl} successful`);
//   } catch (error) {
//     console.error(`Connection to ${databaseUrl} failed: ${error.message}`);
//   }
// }

// async function connectToStudentData() {
//   await connectToDatabase('mongodb://127.0.0.1:27017/studentdata');
// }

// async function connectToApproveModel() {
//   await connectToDatabase('mongodb://127.0.0.1:27017/Approvemodel');
// }

// async function main() {
//   // Connect to the 'studentdata' database
//   await connectToStudentData();

//   // Connect to the 'Approvemodel' database
//   await connectToApproveModel();
// }

// main();
main()
    .then(()=>{
        console.log("connection Successful");
    })
    .catch((err) =>{
     console.log(err)});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/studentdata');
}


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));



app.get("/",(req,res)=>{
    res.render("login.ejs");
});

app.get("/studentsignin",(req,res)=>{
    res.render("studentlogin.ejs");
});

app.get("/wardensignin",(req,res)=>{
    res.render("wardenlogin.ejs");
});

app.get("/guardsignin",(req,res)=>{
    res.render("guardlogin.ejs");
});

app.get("/studenthome",(req,res)=>{
    res.render("sudenthome.ejs");
});


app.get("/wardendashboard", async (req,res)=>{
    
    let studat =  await studentData.find();
     res.render("wardendashboard.ejs",{studat});    
});
app.get("/wardenhome",(req,res)=>{
    res.render("wardenhome.ejs");
});

app.get("/guardhome",(req,res)=>{
    res.render("guardhome.ejs");
});

app.get("/guarddeshboard",async (req,res)=>{
    let studat =  await studentData.find();
    res.render("guarddeshboard.ejs",{studat});
})

app.get("/dashboard", async (req,res)=>{
    let studat =  await studentData.find();
    res.render("deshboard.ejs",{studat});
});


app.get("/apply",(req,res)=>{
    res.render("apply.ejs");
});

app.post("/deshboard", (req, res) => {
    try {
        const formData = req.body;
        formData.Status = 'pending';
        const newStudent = new studentData(formData);

        newStudent.save();
        console.log("Data is saved to the database");
    } catch (err) {
        console.error(err);
    }
    res.redirect("/apply");
});

app.post("/ward",async (req, res) => {

    const approvaldata = req.body;
    await studentData.updateOne({_id: approvaldata.id}, { Status: approvaldata.decision });
    res.redirect("/wardendashboard");
});



app.listen(PORT,()=>{
    console.log(`Local host connection sucessfully at port {PORT}`)
})