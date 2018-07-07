window.onload = function sadboi() {
    for (i = 0; i < 10; i++) {
        //Create a button element and style it accordingly
        let element = document.createElement("button");
        element.className="mdl-button mdl-js-button mdl-js-ripple-effect  exercise";
        element.id = "exercise" + i;
        //element.style.backgroundImage = "url('images/hej.jpg')";
        //element.style.backgroundSize = "250px 200px";
        let t = document.createTextNode("Exercise " + i);
        element.appendChild(t);
        //Add an onclick-function which moves to the exercise page and loads the settings for the current exercise.
        //element.innerHTML = '<img src="images/hej.jpg" width="10%" height = "10%"/>';
        element.onclick = function(){
            console.log(this.id);
            //Pass the current exercise as a parameter
            location.href="exercise_page.html" + "?exercise=" + this.id;
            return false
        };
        exerciseContainer.appendChild(element)
    }
};
//This function returns to WeekOne. For breadcrumbs.
function goToWeekOne(){
    location.href="main.html"
}