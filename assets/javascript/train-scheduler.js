//Initialise
var config = {
  apiKey: "AIzaSyCwVMm6ADZK8vhomncIsLiVcb1y41msKhU",
  authDomain: "classwork-3c0ce.firebaseapp.com",
  databaseURL: "https://classwork-3c0ce.firebaseio.com",
  projectId: "classwork-3c0ce",
  storageBucket: "classwork-3c0ce.appspot.com",
  messagingSenderId: "972609370378"
};
firebase.initializeApp(config);
var database = firebase.database();


//Functions

//Event handlers
$(document).ready(function(){

  
  // On submit 
  $("#submit-btn").on("click",function(){
    event.preventDefault();
    
    var trainData = {
      name : $("#trainName").val().trim(),
      destination : $("#destination").val().trim(),
      time : $("#trainTime").val().trim(),
      frequency : $("#frequency").val().trim()
    };

    console.log(trainData);

    database.ref().push(trainData);

    document.getElementById("myForm").reset();

     
  });  

});