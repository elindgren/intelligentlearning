class Exercise {
    constructor(elementID, exercise_name, thumbnail, difficulty, exercise_type,) {
        this.elementID = elementID; //The HTML ID for the exercise
        this.exercise_name = exercise_name; //The name of the given exercise
        this.difficulty = difficulty; //Exercise difficulty
        this.thumbnail = thumbnail; //Exercise thumbnail
        this.exercise_type = exercise_type; //The type of exercise (Obligatory, Bonus etc.)

        this.status = 0; //Exercise status
        this.time_spent = 0; //Time spent on this exercse

        this.small_width = 100;
        this.large_width = 200;

        this.small_height = 50;
        this.large_height = 150;
        //Current dimensions
        this.current_width = this.small_width;
        this.current_height = this.small_height;
    }

    toggleSize() {
        if (this.current_height === this.small_height && this.current_width === this.small_width) {
            this.current_height = this.large_height;
            this.current_width = this.large_width;
        } else {
            this.current_height = this.small_height;
            this.current_width = this.small_width;
        }
        document.getElementById(this.elementID).clientHeight = this.current_height;
        document.getElementById(this.elementID).clientWidth = this.current_width;

    }

}
window.onload = function sadboi() {
    for (i = 0; i < 10; i++) {
        let element = document.createElement("button");
        element.className="mdl-button mdl-js-button mdl-js-ripple-effect";
        element.id = "exercise" + i;
        let t = document.createTextNode("Exercise " + i);
        element.appendChild(t);
        //element.innerHTML = '<img src="images/hej.jpg" width="10%" height = "10%"/>';
        element.onclick = function(){
            console.log(this.id);
            //Pass the current exercise as a parameter
            location.href="exercise_page.html" + "?exercise=" + this.id;
            return false
        };
        mainDiv.appendChild(element)
    }
};
//This function returns to WeekOne. For breadcrumbs.
function goToWeekOne(){
    location.href="main.html"
}