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
function toggleSize(id) {
    for(i = 0; i < 100; i++){
        document.getElementById(id).innerText = i
    }
}