// Log in Javascript console when initialized
console.log("Welcome to tab50!");

// Run "loadUsername" function when window loads
window.onload = loadUsername();
// Run "loadText" function when window loads
window.onload = loadText();
// Run "showHide" function when window loads
window.onload = showHide();

document.addEventListener("DOMContentLoaded", function() {
    getLocation();
    // Make sure DOM content has been loaded before running "loadBackground" function
    loadBackground();
    // Once DOM content has loaded, listen for user clicking "Edit Name" button
    document.querySelector("#username").addEventListener("click", editName);
    // Once DOM content has loaded, listen for user clicking "HUDS Menu" button
    document.querySelector("#menu").addEventListener("click", linkMenu);
    // Once DOM content has loaded, listen for user clicking on the Post-It Note
    document.querySelector("#text").addEventListener("click", checkBlank);
    // Once DOM content has loaded, listen for user clicking on the "x" to hide the Post-It Note
    document.querySelector("#hide").addEventListener("click", hidePostIt);
    // Once DOM content has loaded, listen for user clicking "Notes" button
    document.querySelector("#show").addEventListener("click", showPostIt);
    // Once DOM content has loaded, listen for user clicking Fahrenheit or Celsius toggle
    document.querySelector("#celsius").addEventListener("click", toggleCelsius);
    document.querySelector("#fahrenheit").addEventListener("click", toggleFahrenheit);
});

// Load random background image from folder
function loadBackground() {
    // Choose random image from folder
    var r = Math.floor(Math.random() * 50) + 1;
    // Log image number in Javascript console
    console.log("Image number: " + r);
    var img = "image/" + r + ".jpg";
    var imgURL = chrome.runtime.getURL(img);
    // Change background to chosen image
    document.body.style.backgroundImage = "url(" + imgURL + ")";
}

// Load username from Chrome storage (modified from https://developer.chrome.com/extensions/storage)
function loadUsername() {
    username = chrome.storage.sync.get(["username"], function(result) {
        // Log username in Javascript console
        console.log("Username: " + result.username);
        username = result.username;
        // Run "startTime" function after 100 milliseconds to ensure username is displayed
        startTime();
    })
}

// Enable user to change username (modified from https://developer.chrome.com/extensions/storage)
function editName() {
    username = prompt("Please enter your name:");
    // Save username in Chrome storage
    if (username != null) {
        chrome.storage.sync.set({
            "username": username
        }, function() {
            // Log username in Javascript console
            console.log("Username has been changed to: " + username);
        });
    };
    loadUsername();
}

// Display time and date information on screen (modified from https://www.w3schools.com/js/js_date_methods.asp)
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
    } else if (h < 22 && h >= 18) {
        var h2 = h - 12;
        document.getElementById("minutes").innerHTML = h2 + ":" + m;
        document.getElementById("greeting").innerHTML = "Good evening, " + username + "!";
    } else if (h <= 24 && h >= 22) {
        var h3 = h - 12;
        document.getElementById("minutes").innerHTML = h3 + ":" + m;
        document.getElementById("greeting").innerHTML = "Good night, " + username + "!";
    } else if (h < 5 && h > 0) {
        document.getElementById("minutes").innerHTML = h + ":" + m;
        document.getElementById("greeting").innerHTML = "Good night, " + username + "!";
    } else if (h == 0) {
        var h4 = h + 12;
        document.getElementById("minutes").innerHTML = h4 + ":" + m;
        document.getElementById("greeting").innerHTML = "Good night, " + username + "!";
    } else if (h == 12) {
        document.getElementById("minutes").innerHTML = h + ":" + m;
        document.getElementById("greeting").innerHTML = "Good afternoon, " + username + "!";
    } else {
        document.getElementById("minutes").innerHTML = h + ":" + m;
        document.getElementById("greeting").innerHTML = "Good morning, " + username + "!";
    }
    document.getElementById("dayanddate").innerHTML = days[day] + " " + months[month] + " " + date;
    // Check time every 500 milliseconds
    var t = setTimeout(startTime, 500);
}

// Add a zero in front of single digit minutes (e.g. change "7" to "07") [source: https://www.w3schools.com/js/js_date_methods.asp]
function checkTime(m) {
    if (m < 10) {
        m = "0" + m
    }
    return m;
}

// Link to HUDS menu of the day; open in same window once clicked
function linkMenu() {
    // Getting hour again to avoid using global variable
    var now = new Date();
    var hour = now.getHours();
    // If before 2pm, link to lunch menu, else link to dinner menu
    if (hour <= 13) {
        window.open("http://www.foodpro.huds.harvard.edu/foodpro/menu_items.asp?type=30&meal=1", "_self");
    } else {
        window.open("http://www.foodpro.huds.harvard.edu/foodpro/menu_items.asp?type=30&meal=2", "_self");
    }
}

// Load Post-It Note text from Chrome storage, if any (modified from https://developer.chrome.com/extensions/storage)
function loadText() {
    loadText = chrome.storage.sync.get(["textinput"], function(result) {
        console.log("Text loaded: " + result.textinput);
        loadText = result.textinput;
        // Display Post-It Note text that had been inputted previously
        document.getElementById("text").innerHTML = loadText;
    })
}

// Check if Post-It Note is displaying placeholder text
function checkBlank() {
    // If displaying placeholder text, call "blankText" function; else call "newText" function
    if (document.getElementById("text").innerHTML == "Click here to edit me!") {
        blankText();
    } else {
        newText();
    }
}

// Delete placeholder text
function blankText() {
    document.getElementById("text").innerHTML = "";
}

// Save text inputted by user every 2 seconds when the Post-It Note is edited
function newText() {
    var textinput = text.innerHTML;
    chrome.storage.sync.set({
            "textinput": textinput
        }, function() {
            console.log("New Text: " + textinput);
        })
        // Recursive function to continually save inputted text
    var s = setTimeout(newText, 2000);
}

// Check whether to show or hide Post-It Note on load
function showHide() {
    check = chrome.storage.sync.get(["check"], function(result) {
        console.log("Result: " + result.check);
        check = result.check;
        postit = document.getElementById("postit");
        if (check == "Show") {
            postit.style.display = "inline-block";
        } else {
            postit.style.display = "none";
        }
    })
}

// Hide Post-It Note when user clicks "x"
function hidePostIt() {
    postit = document.getElementById("postit");
    postit.style.display = "none";
    chrome.storage.sync.set({
        "check": "Hide"
    }, function() {
        console.log("Hide");
    })
}

// Show Post-It Note when user clicks "Notes" button
function showPostIt() {
    postit = document.getElementById("postit");
    postit.style.display = "inline-block";
    chrome.storage.sync.set({
        "check": "Show"
    }, function() {
        console.log("Show");
    })
}

// Declaring global variables
var api = "api.openweathermap.org/data/2.5/weather?";
var apiKey = "&APPID=03de75a445a04038533e13c2494d6253";
var imperial = "&units=imperial";
var metric = "&units=metric";
var coordinates;
var url;

// Get user's coordinates
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showCoordinates);
    } else { 
        document.getElementById("location").innerHTML = "Geolocation is not supported by this browser.";
    }
}

// Return url with relevant latitude and longitude to call OpenWeatherMap API
function showCoordinates(position) {
    coordinates = "&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
    url = api + apiKey + imperial + coordinates;
}

// Change active state of Celsius/Fahrenheit toggle based on user selection (source: https://www.w3schools.com/howto/howto_js_active_element.asp)
function toggleFahrenheit() {
    var toggle = document.getElementById("toggle");
    var btns = toggle.getElementsByClassName("btn-light");
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
            var current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        });
    }
    chrome.storage.sync.set({
            "Units": "Fahrenheit"
        }, function() {
            console.log("Units: Fahrenheit");
        })
}

// Change active state of Celsius/Fahrenheit toggle based on user selection (source: https://www.w3schools.com/howto/howto_js_active_element.asp)
function toggleCelsius() {
    var toggle = document.getElementById("toggle");
    var btns = toggle.getElementsByClassName("btn-light");
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
            var current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        });
    }
    chrome.storage.sync.set({
            "Units": "Celsius"
        }, function() {
            console.log("Units: Celsius");
        })
}