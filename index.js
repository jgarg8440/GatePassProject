const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const studentData = require('./models/student');
// const Approvemodel = require('./models/Approve');
const PORT = process.env.PORT || 8080;
const session = require('express-session');
const bodyParser = require('body-parser');



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

app.use(session({
    secret: 'zhhhh-aaaaaaaaaaa-aa', // Change this to a secure secret key
    resave: false,
    saveUninitialized: true,
}));



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

app.post('/wardenLogin', (req, res) => {
    const { username, password } = req.body;

    // Mock authentication logic
    if (username === 'admin' && password === '123') {
        // Store user information in the session
        req.session.user = { username };
        
        // Redirect to home if credentials are true
        res.redirect('/wardenhome');
    } else {
        // Reload the same page if credentials are false
        res.redirect('back');
    }
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




app.get("/apply",(req,res)=>{

    if(!req.session.user){
        res.redirect('/studentsignin')
        return
    }
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

app.get('/createuser', (req, res)=>{
    if(!req.session.user){
        res.redirect('/wardensignin')
        return
    }

    res.render('createUser')
})


const userSchema = new mongoose.Schema({
    studentName: String,
    roomNumber: String,
    hostelName: String,
    rollNumber: String,
    password: String,
});

const User = mongoose.model('User', userSchema);



app.post('/users', (req, res) => {
    const { studentName, roomNumber, hostelName, rollNumber, password } = req.body;

    // Create a new user using the Mongoose model
    const newUser = new User({
        studentName,
        roomNumber,
        hostelName,
        rollNumber,
        password,
    });

    // Save the user to the MongoDB database
    newUser.save();

    res.render('userCreated')
});



app.post('/student/login', async (req, res) => {
    const { rollNumber, password } = req.body;

    try {
        // Find the user in the database by username
        const user = await User.findOne({ rollNumber });
        console.log(user)

        if (user) {
            // Compare the provided password with the hashed password in the database
            const passwordMatch = (password == user.password)

            if (passwordMatch) {
                req.session.user = user
                res.redirect('/studenthome') // Redirect or serve a success page as needed
            } else {
                res.send('Invalid credentials. Please try again.'); // Incorrect password
            }
        } else {
            res.send('User not found. Please check your username.'); // User not found
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});



const gatePassSchema = new mongoose.Schema({
    place: String,
    purpose: String,
    dateTime: Date,
    status: { type: String, default: 'new' },
    studentName: String,
    roomNumber: String,
    hostelName: String,
    rollNumber: String, // Store the user's username
});

const GatePass = mongoose.model('GatePass', gatePassSchema);

// Handle gate pass application
app.post('/apply-gate-pass', async (req, res) => {
    const { place, purpose, dateTime } = req.body;

    try {
        // Create a new gate pass using the Mongoose model
        const newGatePass = new GatePass({
            place,
            purpose,
            dateTime,
            ...req.session.user
        });

        // Save the gate pass to the MongoDB database
        await newGatePass.save();

        res.send('Gate pass application submitted successfully!');
    } catch (error) {
        console.error('Error during gate pass application:', error);
        res.status(500).send('Internal Server Error');
    }
});




app.get('/gatepasses',async  (req, res)=>{
    let gatePasses = await GatePass.find({rollNumber: req.session.user.rollNumber})
    res.render('gatepasses', {gatePasses})
})


app.get("/wardendashboard", async (req,res)=>{

    if(!req.session.user){
        res.redirect('/wardensignin')
        return
    }
    
    const gatePasses = await GatePass.find({});

    // Render the EJS view with the gate passes data
    res.render('wardendashboard', { gatePasses });   
});


app.post('/update-gate-pass-status/:gatePassId/:status', async (req, res) => {
    const  status  = req.params.status;
    const gatePassId = req.params.gatePassId;

    console.log(status)

    try {
        // Update the status in the MongoDB database
        await GatePass.findByIdAndUpdate(gatePassId, { status: status });

        res.json({ message: 'Status updated successfully.' });
    } catch (error) {
        console.error('Error updating gate pass status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT,()=>{
    console.log(`Local host connection sucessfully at port {PORT}`)
})