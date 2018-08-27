window.onload = function sadboi() {
    console.log("Fetching exercise information.");
    let exerciseJSON = fetchExerciseInformation();
    console.log("Exercise information fetched.");
    if (exerciseJSON == null) {
        console.log("Exercise JSON null in sadboi!");
    }

    //Save the JSON locally for availability to other pages.
    updateSessionStorage("exerciseJSON", exerciseJSON);
    console.log("JSON size:" + exerciseJSON.exercises.length);
    let totalTries = 0;
    for (let i = 0; i < exerciseJSON.exercises.length; i++) {
        totalTries += exerciseJSON.exercises[i].tries;
    }
    console.log("Total tries: " + totalTries);

    for (i = 0; i < exerciseJSON.exercises.length; i++) {
        //Create a button element and style it accordingly
        let element = document.createElement("button");

        //Set the status of the button
        if (exerciseJSON.exercises[i].status == "not_started") {
            element.className = "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised exercise";
        } else if (exerciseJSON.exercises[i].status == "started") {
            element.className = "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised exercise exercise-started";
        } else if (exerciseJSON.exercises[i].status == "completed") {
            element.className = "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised exercise exercise-completed";
        } else {
            console.log("Invalid status for exercise: " + exerciseJSON.exercises[i].id + "!")
        }
        element.id = exerciseJSON.exercises[i].id;
        //Create a thumbnail and text element - place them inside the button.
        let exerciseThumbnail = document.createElement("img");
        exerciseThumbnail.src = exerciseJSON.exercises[i].image_path;
        exerciseThumbnail.style.height = "auto%";
        exerciseThumbnail.style.width = "100%";
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
    let actualJSON = null;
    if (storageAvailable("sessionStorage")) {
        actualJSON = sessionStorage.getItem("exerciseJSON");
    }
    if (actualJSON == null) {
        console.log("Loading JSON from file");
        let path = "exercise_information.json";
        console.log("Exercise path: " + path);
        loadJSON(function (response) {
            actualJSON = JSON.parse(response);
        }, path);
    } else {
        console.log("Loading JSON from storage");
        actualJSON = JSON.parse(actualJSON);
    }
    return actualJSON;
}

//Exercise statuses: started, not_started, finished

function fetchExerciseInformationByID(id) {
    console.log("ID: " + id);
    let temp = fetchExerciseInformation();
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
    xobj.open("GET", path, false); // For now the async has to be false, otherwise the window load will execute before
                                   // the callback has been completed.
    xobj.setRequestHeader("Cache-Control", "max-age=0"); //This is to avoid the caching of the http response.
                                                         //Otherwise changes to JSON won't take effect.
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && xobj.status === 200) {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function saveExerciseInformation(data) {
    let temp = fetchExerciseInformation();
    for (i = 0; i < temp.exercises.length; i++) {
        if (temp.exercises[i].id == data.id) {
            console.log("Saving data for exercise with id " + data.id);
            temp.exercises[i] = data;
        }
    }
    updateSessionStorage("exerciseJSON", temp);
}

function updateSessionStorage(key, data) {
    let stringifiedData = JSON.stringify(data);
    sessionStorage.setItem(key, stringifiedData);
}

function storageAvailable(type) {
    try {
        let storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
                // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}