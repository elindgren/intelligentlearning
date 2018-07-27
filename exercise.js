window.onload = function sadboi() {
    for (i = 0; i < 10; i++) {
        //Create a button element and style it accordingly
        let element = document.createElement("button");
        element.className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised exercise";
        element.id = "exercise_" + i;
        //Create a thumbnail and text element - place them inside the button.
        let exerciseThumbnail = document.createElement("img");
        exerciseThumbnail.src = "images/ex_uppgift.png";
        exerciseThumbnail.style.height = "150px";
        exerciseThumbnail.style.width = "125px";
        // exerciseThumbnail.style.backgroundSize = "250px 200px";
        let exerciseText = document.createTextNode("Exercise " + i);

        element.appendChild(exerciseThumbnail);
        element.appendChild(exerciseText);


        //element.innerHTML = '<img src="images/hej.jpg" width="10%" height = "10%"/>';
        //Add an onclick-function which moves to the exercise page and loads the settings for the current exercise.
        element.onclick = function(){
            console.log(this.id);
            //Pass the current exercise as a parameter
            location.href="exercise_page.html" + "?exercise=" + this.id;
            return false;
        };
        exerciseContainer.appendChild(element);
    }
};
//This function returns to WeekOne. For breadcrumbs.
function goToWeekOne(){
    location.href="main.html"
}

function fetchExerciseInformation() {
    let path = "exercise_information.json";
    let actualJSON = null;
    loadJSON(function (response) {
        actualJSON = JSON.parse(response);
    }, path);
    return actualJSON;
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