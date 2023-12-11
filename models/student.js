const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    fName : {
        type : String,
        maxLength : 50,
        required : true,
    },
    mName : {
        type : String,
        maxLength : 50
    },
    lName : {
        type : String,
        maxLength : 50,
        required : true,
    },
    hName: {
        type: String,
        enum: [
          'Select Your Hostel',
          'Nek-Chand Tower(N.C.) - 1',
          'Nek-Chand Tower(N.C.) - 2',
          'Nek-Chand Tower(N.C.) - 3',
          'Nek-Chand Tower(N.C.) - 4',
          'Nek-Chand Tower(N.C.) - 5',
          'Nek-Chand Tower(N.C.) - 6',
          'Zakir - A',
          'Zakir - B',
          'Zakir - C',
          'Zakir - D',
          'Sukhna - Hostel',
          'Tagore - Hostel',
          'Shivalik - Hostel',
          'Le Corbusier(L.C.) - Hostel',
        ],
        required : true
    },
    rNO : {
        type : Number,
        maxLength : 10,
        required : true,
    },
    mode: {
        type: String,
        enum: ['Day', 'Night'],
        required: true,
    },
    pOV : {
        type : String,
        maxLength : 50,
        required : true,
    },
    time: {
        type: Date,
        required: true,
    },
    Status: {
        type: String,
    }
})

const studentData = mongoose.model("studentData", studentSchema);
module.exports = studentData; 


