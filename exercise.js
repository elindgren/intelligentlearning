window.onload = function sadboi() {
    console.log("Fetching exercise information.");
    let exerciseJSON = fetchExerciseInformation();
    console.log("Exercise information fetched.");
    if(exerciseJSON == null){
        console.log("Exercise JSON null in sadboi!");
    }
    //Save the JSON locally for availability to other pages.
    strinigifiedExerciseJSON = JSON.stringify(exerciseJSON);
    localStorage.setItem("exerciseJSON", strinigifiedExerciseJSON);
    console.log("JSON size:" + exerciseJSON.exercises.length);
    for (i = 0; i < exerciseJSON.exercises.length; i++) {
        //Create a button element and style it accordingly
        let element = document.createElement("button");
        element.className = "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised exercise";
        element.id = exerciseJSON.exercises[i].id;
        //Create a thumbnail and text element - place them inside the button.
        let exerciseThumbnail = document.createElement("img");
        exerciseThumbnail.src = exerciseJSON.exercises[i].image_path;
        exerciseThumbnail.style.height = "150px";
        exerciseThumbnail.style.width = "125px";
        // exerciseThumbnail.style.backgroundSize = "250px 200px";
        // let exerciseText = document.createTextNode(exerciseJSON.exercises[i].title);
        element.appendChild(exerciseThumbnail);
        // element.appendChild(exerciseText);


        //element.innerHTML = '<img src="images/hej.jpg" width="10%" height = "10%"/>';
        //Add an onclick-function which moves to the exercise page and loads the settings for the current exercise.
        element.onclick = function () {
            console.log(this.id);
            //Pass the current exercise as a parameter
            location.href = "exercise_page.html" + "?exercise=" + this.id;
            return false;
        };
        exerciseContainer.appendChild(element);
    }
};

//This function returns to WeekOne. For breadcrumbs.
function goToWeekOne() {
    location.href = "main.html"
}

function fetchExerciseInformation() {
    let path = "exercise_information.json";
    console.log("Exercise path: " + path);
    let actualJSON = null;
    loadJSON(function (response) {
        actualJSON = JSON.parse(response);
    }, path);
    return actualJSON;
}

//Exercise statuses: started, not_started, finishedx

function fetchExerciseInformationByID(id) {
    console.log("ID: " + id);
    let temp = localStorage.getItem("exerciseJSON");
    if (temp === null) {
        temp = fetchExerciseInformation();
        console.log("No JSON in localstorage");
    } else {
        temp = JSON.parse(temp);
        console.log("JSON in localstorage");
    }
    for (i = 0; i < temp.exercises.length; i++) {
        if (temp.exercises[i].id == id) {
            console.log("Exercise found!");
            return temp.exercises[i];
        }
    }
    console.log("Exercise not found!");
    return null;
}

/**
 * Loads JSON from path
 * @param callback, function that parses JSON
 * @param path, path to JSON
 */
function loadJSON(callback, path) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", path, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && xobj.status === 200) {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}