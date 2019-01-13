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
var trainRef = database.ref("/train");

//Functions
function addTrainData(trainSnapshot) {
  var name = trainSnapshot.val().name;
  var destination = trainSnapshot.val().destination;
  var trainTime = trainSnapshot.val().time;
  var frequency = trainSnapshot.val().frequency;

  //Calculate minutes away
  var minutesAway = getMinutesAway(trainTime, frequency);

  // Calculate next arrival time
  var nextArrival = getArrivalTime(minutesAway);
  var key = trainSnapshot.key;

  var $tr = $("<tr>");
  $tr.attr("id", key)
    .append(`<td>${name}</td>`)
    .append(`<td>${destination}</td>`)
    .append(`<td>${trainTime}</td>`)
    .append(`<td>${frequency}</td>`)
    .append(`<td>${nextArrival}</td>`)
    .append(`<td>${minutesAway}</td>`)
    .append(`<td><a href='#' onclick="modifyTrain('${key}')"><i class="fas fa-pencil-alt"></i></a>&nbsp;&nbsp;<a href='#' onclick="deleteTrain('${key}')"><i class="fas fa-trash-alt"></i></a></td>`);

  $("#train-info").append($tr);
}


function modifyTrain(key) {
  //Get data from DB and set in input
  database.ref("/train/" + key).once("value").then(function (trainSnapshot) {
    $("#trainName").val(trainSnapshot.val().name);
    $("#destination").val(trainSnapshot.val().destination);
    $("#trainTime").val(trainSnapshot.val().time);
    $("#frequency").val(trainSnapshot.val().frequency);
  });

  $("#update-btn").attr("data-key", key);
  $("#submit-btn").hide();
  $("#update-btn").show();
}

function deleteTrain(key) {
  var trainD = database.ref("/train/" + key);
  trainD.remove();

  //Remove row from table
  $('#' + key).remove();
}

function getArrivalTime(tMinutesTillTrain) {
  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm a");
  //console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  return nextTrain;
}

function getMinutesAway(firstTime, tFrequency) {

  console.log(firstTime, tFrequency);
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;

  var tMinutesTillTrain = tFrequency - tRemainder;
  return tMinutesTillTrain;
}

// To set running clock on header
var update = function () {
  document.getElementById("currentDay")
    .innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
}
setInterval(update, 1000);


//Event handlers
$(document).ready(function () {

  $("#submit-btn").show();
  $("#update-btn").hide();

  // Logout
  $("#logout").on("click",function(){
    firebase.auth().signOut();
    location.replace("index.html");
  })

  // On submit 
  $("#submit-btn").on("click", function () {

    var trainData = {
      name: $("#trainName").val().trim(),
      destination: $("#destination").val().trim(),
      time: $("#trainTime").val().trim(),
      frequency: $("#frequency").val().trim()
    };

    //console.log(trainData);

    trainRef.push(trainData);
    document.getElementById("myForm").reset();

  });

  // When Value Updated
  $("#update-btn").on("click", function () {
    var trainData = {
      name: $("#trainName").val().trim(),
      destination: $("#destination").val().trim(),
      time: $("#trainTime").val().trim(),
      frequency: $("#frequency").val().trim()
    };

    var key = $(this).attr("data-key");
    //console.log("key" + key);
    database.ref("/train/" + key).update(trainData);

    document.getElementById("myForm").reset();

    $("#submit-btn").show();
    $("#update-btn").hide();
  });

  //Listener for new train details added
  trainRef.on("child_added", function (trainSnapshot) {
    addTrainData(trainSnapshot);
  }, function (errObject) {
    console.log("Error Occurred : " + code);
  });

  //Listener for train modified
  trainRef.on("child_changed", function (trainSnapshot) {

    //Remove row from table
    $('#' + trainSnapshot.key).remove();

    addTrainData(trainSnapshot);
  }, function (errObject) {
    console.log("Error Occurred : " + code);
  });
});