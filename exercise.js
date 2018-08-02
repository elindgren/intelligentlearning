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

    let required = [];
    let required_sets = [];
    for (let i = 0; i < exerciseJSON.required_sets.length; i++) {
        required_sets[i] = [];
    }
    let non_required = [];

    for (let i = 0; i < exerciseJSON.exercises.length; i++) {
        // Create button for exercise
        let element = initExerciseButton(exerciseJSON.exercises[i]);

        // Add it to array based on how required it is
        if (exerciseJSON.required.includes(exerciseJSON.exercises[i].id)) {
            required.push(element);
        } else {
            let found = false;
            for (let j = 0; j < exerciseJSON.required_sets.length; j++) {
                if (exerciseJSON.required_sets[j].includes(exerciseJSON.exercises[i].id)) {
                    required_sets[j].push(element);
                    found = true;
                    break
                }
            }

            if (!found) {
                non_required.push(element);
            }
        }
        exerciseContainer.appendChild(element);
    }

    let map = generateExerciseMap(required, required_sets);
    // TODO: Display elements based on map
    // TODO: Draw lines between elements

};

function initExerciseButton(exercise) {
    let button = document.createElement("button");
    //Set the status of the button
    if (exercise.status === "not_started") {
        button.className = "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised exercise";
    } else if (exercise.status === "started") {
        button.className = "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised exercise exercise-started";
    } else if (exercise.status === "completed") {
        button.className = "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised exercise exercise-completed";
    } else {
        console.log("Invalid status for exercise: " + exercise.id + "!");
        button.className = "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised exercise";
    }

    button.id = exercise.id;

    //Create a thumbnail and text element - place them inside the button.
    let exerciseThumbnail = document.createElement("img");
    exerciseThumbnail.src = exercise.image_path;
    exerciseThumbnail.style.height = "150px";
    exerciseThumbnail.style.width = "125px";
    button.appendChild(exerciseThumbnail);

    //Add an onclick-function which moves to the exercise page and loads the settings for the current exercise.
    button.onclick = function () {
        console.log(this.id);
        //Pass the current exercise as a parameter
        location.href = "exercise_page.html" + "?exercise=" + this.id;
        return false;
    };

    return button;
}

function generateExerciseMap(required, required_sets) {
    let map_width = required.length + required_sets.length;
    let map_height = 1;
    for (let i = 0; i < required_sets.length; i++) {
        if (required_sets[i].length > map_height) {
            map_height = required_sets[i].length;
        }
    }

    let map = [];

    let required_index = 0;
    let required_set_index = 0;
    for (let column_num = 0; column_num < map_width; column_num++) {
        let element_found = false;
        let column = [];
        // Prepare column by filling it with hidden elements
        for (let row_num = 0; row_num < map_height; row_num++) {
            let blank = document.createElement("button");
            blank.className = "exercise exercise-dummy";
            column[row_num] = blank;
        }

        // Add appropriate elements to map
        if (required_index <= required.length && required_set_index <= required_sets.length) {
            if (required[required_index].id < required_sets[required_set_index][0].id) {
                column = addRequiredToColumn(column, required[required_index]);
                required_index++;
            } else {
                column = addRequiredSetToColumn(column, required_sets[required_set_index]);
                required_set_index++;
            }
        } else if (!(required_index >= required.length && required_set_index >= required_sets.length)) {
            if (required_index >= required.length) {
                column = addRequiredToColumn(column, required[required_index]);
                required_index++;
            } else {
                column = addRequiredSetToColumn(column, required_sets[required_set_index]);
                required_set_index++;
            }
        }

        map[column_num] = column;
    }
    return map;
}

function addRequiredToColumn(column, element) {
    column[Math.floor(column.length / 2)] = element;
    return column;
}

function addRequiredSetToColumn(column, elements) {
    for (let i = 0; i < elements.length; i++) {
        column[i + math.floor((column.length - elements.length) / 2)] = elements[i];
    }
    return column;
}

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