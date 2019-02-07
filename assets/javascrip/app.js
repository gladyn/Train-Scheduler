$(document).ready(function () {
    // initialize firebase

    var config = {
        apiKey: "AIzaSyBbu1Zu2WRI3ljmYpQG0gmeqqJf0kJdSwk",
        authDomain: "train-165af.firebaseapp.com",
        databaseURL: "https://train-165af.firebaseio.com",
        projectId: "train-165af",
        storageBucket: "train-165af.appspot.com",
        messagingSenderId: "173031357149"
      };
      firebase.initializeApp(config);

   
    var database = firebase.database();
    dateAdded: firebase.database.ServerValue.TIMESTAMP

    $("#trainBtn").on("click", function (event) {
        event.preventDefault(); //no button reset

       
        var trainName = $("#inputName").val().trim();
        // destination train is going
        var destination = $("#inputDest").val().trim();
        // the time the first train arrives for the day
        var firstTrainT = moment($("#inputTtime").val(), "hh:mm").subtract(1, "years").format("X");
        
        console.log($("#inputTtime").val());
        console.log(moment($("#inputTtime").val(), "hh:mm"));
        console.log(moment($("#inputTtime").val(), "hh:mm").subtract(1, "years"));

        // var firstTrainT = moment($("#inputTrain").val(), "hh:mm").subtract(1, "years").format("X");
        // how often the train comes
        var frequency = $("#inputFreq").val().trim();

        
        var currentTime = moment();

       
        var newTrain = {

            trainName: trainName,
            trainDestination: destination,
            trainFirstTime: firstTrainT,
            trainFrequency: frequency,

        };

        database.ref().push(newTrain);


        //clears elements before adding new text
        $("#inputName").val("");
        $("#inputDest").val("");
        $("#inputTime").val("");
        $("#inputFreq").val("");
        return false;

    });

    
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());
        //store in variables
        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().trainDestination;
        var firstTrainT = childSnapshot.val().trainFirstTime;
        var frequency = childSnapshot.val().trainFrequency;
        
        //  time
        var trainTime = moment.unix(firstTrainT).format("hh:mm");
        console.log("train starts at " + trainTime);
        //calculate difference between times\

        // converts the first time the train arrives in the day to proper formatting
        var firstTimeConverted = moment(currentTime, "hh:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // the current time
        var currentTime = moment().format("hh:mm");
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // the time the next train arrives. current time plus frequency
        var nextArrival = moment(currentTime, 'hh:mm').add(frequency, "minutes").format("hh:mm");
        console.log("the next train is at " + nextArrival);


        var a = moment(nextArrival, "hh:mm");
        var b = moment(currentTime, "hh:mm");


        var minUntil = a.diff(b, "minutes");

        console.log("minUntil ", a, b, minUntil);
        console.log(moment(nextArrival, "hh:mm").fromNow());
        console.log(moment(nextArrival, "hh:mm").diff(moment(currentTime, "hh:mm"), "minutes"));

        console.log("minutes until " + minUntil);
        console.log("name " + trainName);
        console.log("destination " + destination);
        console.log("train time at " + trainTime);
        console.log("frequency " + frequency);
        console.log("next time " + nextArrival);


       
        $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + trainTime + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minUntil + "</td></tr>");

    });
});
