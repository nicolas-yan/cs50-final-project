// Log in Javascript console when initialized
console.log("Welcome to tab50!");

// Run "username" function when window loads
window.onload = username();
window.onload = loadtextFunction;

// Make sure DOM content has been loaded before running "background" function
document.addEventListener("DOMContentLoaded", function () {
    background();
    // Once DOM content has loaded, listen for user clicking "Edit Name" button
    document.querySelector("#username").addEventListener("click", nameFunction);
    // Once DOM content has loaded, listen for user clicking "HUDS Menu" button
    document.querySelector("#menu").addEventListener("click", menuFunction);
    // Once DOM content has loaded, listen for user clicking post-it note
    document.querySelector("#text").addEventListener("click", blankornewFunction);
});

// Choose random image from folder
function background() {
    var r = Math.floor(Math.random() * 50) + 1;
    // Log image number in Javascript console
    console.log("Image number: " + r);
    var img = "image/" + r + ".jpg";
    var imgURL = chrome.runtime.getURL(img);
    // Change background to chosen image
    document.body.style.backgroundImage = "url(" + imgURL + ")";
}

// Load username from Chrome storage
// Modified from https://developer.chrome.com/extensions/storage
function username() {
    username = chrome.storage.sync.get(["username"], function(result) {
        // Log username in Javascript console
        console.log("Username: " + result.username);
        username = result.username;
        // Run "startTime" function after 100 milliseconds to ensure username is displayed
        startTime();
    })
}

// Enable user to change username
// Modified from https://developer.chrome.com/extensions/storage
function nameFunction() {
    username = prompt("Please enter your name:");
    // Save username in Chrome storage
    if (username != null) {
        chrome.storage.sync.set({"username": username}, function() {
            // Log username in Javascript console
            console.log("Username has been changed to: " + username);
        });
    };
    username();
}

// Display time and date information on screen
// Modified from https://www.w3schools.com/js/js_date_methods.asp
function startTime() {
    // Get the current day based on user location
    var today = new Date();
    // Get relevant variables based on current day
    var h = today.getHours();
    var m = today.getMinutes();
    var date = today.getDate();
    var month = today.getMonth();
    // Creating an array of months (because month is returned as number)
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var day = today.getDay();
    // Creating an array of days (because day is returned as number)
    var days = ["Sunday,", "Monday,", "Tuesday,", "Wednesday,", "Thursday,", "Friday,", "Saturday,", "Sunday,"]
    // Add a zero in front of single digit minutes with "checkTime" function
    m = checkTime(m);
    // Displaying time and greeting the user with relevant greeting based on the time of day
    if (h < 18 && h > 12) {
        var h1 = h - 12;
        document.getElementById("minutes").innerHTML = h1 + ":" + m;
        document.getElementById("greeting").innerHTML = "Good afternoon, " + username + "!";
    }
    else if (h < 22 && h >= 18) {
        var h2 = h - 12;
        document.getElementById("minutes").innerHTML = h2 + ":" + m;
        document.getElementById("greeting").innerHTML = "Good evening, " + username + "!";
    }
    else if (h <= 24 && h >= 22) {
        var h3 = h - 12;
        document.getElementById("minutes").innerHTML = h3 + ":" + m;
        document.getElementById("greeting").innerHTML = "Good night, " + username + "!";
    }    
    else if (h < 5 && h > 0) {
        document.getElementById("minutes").innerHTML = h + ":" + m;
        document.getElementById("greeting").innerHTML = "Good night, " + username + "!";
    }     
    else if (h == 0) {
        var h4 = h + 12;
        document.getElementById("minutes").innerHTML = h4 + ":" + m;
        document.getElementById("greeting").innerHTML = "Good night, " + username + "!";
    }  
    else if (h == 12) {
        document.getElementById("minutes").innerHTML = h + ":" + m;
        document.getElementById("greeting").innerHTML = "Good afternoon, " + username + "!";
    } 
    else {
        document.getElementById("minutes").innerHTML = h + ":" + m;
        document.getElementById("greeting").innerHTML = "Good morning, " + username + "!";
    }
    document.getElementById("dayanddate").innerHTML = days[day] + " " + months[month] + " " + date;
    var t = setTimeout(startTime, 50);
}

// Add a zero in front of single digit minutes (e.g. change "7" to "07")
// Source: https://www.w3schools.com/js/js_date_methods.asp
function checkTime(m) {
    if (m < 10) {m = "0" + m}
    return m;
}

// Go to HUDS menu of the day
function menuFunction() {
    // Getting hour again to avoid using global variable
    var now = new Date();
    var hour = now.getHours();
    // If before 2pm, link to lunch menu, else link to dinner menu
    if (hour <= 13) {
        window.open("http://www.foodpro.huds.harvard.edu/foodpro/menu_items.asp?type=30&meal=1", "_self");
    }
    else {
        window.open("http://www.foodpro.huds.harvard.edu/foodpro/menu_items.asp?type=30&meal=2", "_self");
    }
}

function loadtextFunction() {
    loadtext = chrome.storage.sync.get(["textinput"], function(result) {
        console.log("Text right now: " + result.textinput);
        loadtext = result.textinput;
        document.getElementById("text").innerHTML = loadtext;
    })
}

function blankornewFunction() {
    if (document.getElementById("text").innerHTML == "Click here to edit me!") {
        blanktextFunction();
        console.log("Blank");
    }
    else {
        newtextFunction();
        console.log("New");
    }
}

function blanktextFunction() {
    document.getElementById("text").innerHTML = "";
}

function newtextFunction() {
    var textinput = text.innerHTML;
    chrome.storage.sync.set({"textinput": textinput}, function() {
        console.log("Text input is: " + textinput);
    })
    var s = setTimeout(newtextFunction, 2000);
}