var num_modes;
var all_scores=[];
var current_modes=[];
var tot_num_subprob;
var textarea_notes = [];
window.addEventListener("load", function(){
    tot_num_subprob = document.querySelectorAll(".select_points").length;
    num_modes=document.querySelector(".submit_mode").length;

    for(var i = 0; i < num_modes; i++) {
        var a = [];
        for(var j = 0; j < tot_num_subprob; j++)
            a.push(0);
        all_scores.push(a);
    }
    
    //add event listeners for textareas
    var areas = document.querySelectorAll(".notes");
    var i = 0; 
    areas.forEach(function(element){
        var exercise_index = i;
        element.addEventListener("input", function(){ 
            textarea_notes[exercise_index] = element.value;
            localStorage.setItem("notes", JSON.stringify(textarea_notes));
        }, false)
        i++;
    })
    

    //add event listeners for points selection
    var sel = document.querySelectorAll(".select_points")
    var i = 0; 
    sel.forEach(function(element){
        var exercise_index = i;  
        var parentAccordion = findSibling(element.parentNode.parentNode.parentNode, "accordion");
        var panel = parentAccordion.nextElementSibling;
        var submit_mode = parentAccordion.querySelector(".submit_mode");
        element.addEventListener("change", function(){ 
            var current_index_mode = submit_mode.selectedIndex;
            saveScores(exercise_index, current_index_mode, element.selectedIndex);
            updateTotalScoreAll();
        })
        i++;
    })
    
    //add event listeners for submit-mode selection
    var sel = document.querySelectorAll(".submit_mode");
    var i = 0; 
    sel.forEach(function(element){ 
        element.addEventListener("change", function(){
            
            updateScores();
            saveSubmitModes();
            
            updateTotalScoreAll();
        });
        i++;
    })

    //accordion
    var acc = document.getElementsByClassName("accordion");
    var i;
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function(event) {

             //prevent click on select nodes
             if(event.target.tagName.toLowerCase() == "select" ||
                event.target.parentNode.tagName.toLowerCase() == "option")
                return;
                

            //event.preventDefault();
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight)
            {
                setIconOpen(this, true);
                panel.style.maxHeight = null;
            }
            else
            {
                setIconOpen(this, false);
                panel.style.maxHeight = panel.scrollHeight + "px";  
            }
                
            //expand parent
            this.parentElement.style.maxHeight = this.parentElement.scrollHeight + "px"; 
        });
    }

    //numeric inputs
    var numberInputs = document.getElementsByClassName("number"); 
    for (i = 0; i < numberInputs.length; i++) {
        setInputFilter(numberInputs[i], function(value){
            return /^\d*$/.test(value);
        });
    }
  
    load();
}, false);

function setIconOpen(element, open)
{
  var classAdd;
  var classRemove;
  if(open) {
    classAdd = 'fa-chevron-down';
    classRemove = 'fa-chevron-up';
  }
  else {
    classAdd = 'fa-chevron-up';
    classRemove = 'fa-chevron-down';
  }
  
  var child = element.querySelector("." + classRemove);
  if(child)
  { 
    child.classList.remove(classRemove);
    child.classList.add(classAdd);
  }
}

function readTextFile(file, func)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                func(rawFile.responseText);
            }
        }
    }
    rawFile.send(null);
}

//update total score of every exercise
function updateTotalScoreAll(){
    var exercises = document.querySelectorAll(".main_exercise")
    exercises.forEach(function(exercise)
    {
        var panel = exercise.nextElementSibling;
        var sel = panel.querySelectorAll(".select_points");
        var sum=0;
        sel.forEach(function(sel){
            sum+=parseInt(sel.value);
        }) 
        exercise.querySelector(".maxpoints").innerHTML = sum; 
    });
}

function exportMap()
{
    console.log("exporting map");
    var exercises = document.querySelectorAll(".main_exercise");
    var out_exercises = [];
    exercises.forEach(function(ex){
        var pointsElements = ex.querySelectorAll(".maxpoints");
        var total_score = parseInt(pointsElements[0].innerHTML)
        var total_score_max = parseInt(pointsElements[1].innerHTML)
        var submit_mode_idx = ex.querySelector(".submit_mode").selectedIndex;
        var submit_mode = ex.querySelector(".submit_mode").options[submit_mode_idx].innerHTML;
        //console.log("total_score" + total_score+"/"+total_score_max, submit_mode, submit_mode_idx);
        
        var panel = ex.nextElementSibling;
        var tasksAccordions = panel.querySelectorAll(".accordion");
        out_tasks = []
        tasksAccordions.forEach(function(taskAccordion){
            
            var task_score = parseInt(taskAccordion.querySelector(".select_points").value)
            var task_max_score = parseInt(taskAccordion.querySelector(".maxpoints").innerHTML)
            
            var task_panel = taskAccordion.nextElementSibling;
            var task_notes = task_panel.querySelector(".notes").value
            out_tasks = {
                "score" : task_score,
                "score_max" : task_max_score,
                "notes" : task_notes
            }
            //console.log("    score:" + task_score+"/"+task_max_score, task_notes)
        })

        out_exercises.push({
            "total_score": total_score,
            "total_score_max": total_score_max,
            "submit_mode": submit_mode,
            "submit_mode_index": submit_mode_idx,
            "tasks" : out_tasks,
        })
    })

    var out_string = JSON.stringify(out_exercises, null, 2);
    console.log(out_string);
    download(out_string,"mappa_esportata.yaml", "text/plain;charset=utf-8");
    alert("Mappa esportata!")

}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function findParent(element, className)
{
    element = element.parentNode;
    while(element)
    {  
        if(element.classList && element.classList.contains(className))
            break;

        element = element.parentNode;
    }
    return element;
}


function findSibling(element, className)
{
    element = element.previousSibling;
    while(element)
    {  
        if(element.classList && element.classList.contains(className))
            break;

        element = element.previousSibling;
    }
    return element;
}

function load()
{
    //load selected submit modes for each exercise
    var sub = localStorage.getItem('submit_mode');
    if(sub)
    {
        var loaded_submit_modes = JSON.parse(sub);
            var selected_modes = document.querySelectorAll(".submit_mode")
            var i = 0;
            selected_modes.forEach(function(element){
            element.selectedIndex = loaded_submit_modes[i];
            i++;
        }); 
    }

    //load all scores
    var pts =localStorage.getItem('points');
    if(pts) {
        all_scores = JSON.parse(pts);
        updateScores();
    }

    //load notes
    var notes = localStorage.getItem("notes");
    if(notes) {
        textarea_notes = JSON.parse(notes);
        //add event listeners for textareas
        var areas = document.querySelectorAll(".notes");
        var i = 0; 
        areas.forEach(function(element){
            var exercise_index = i;
            if(textarea_notes[exercise_index])
                element.value = textarea_notes[exercise_index];
            i++;
        })
    }

    updateTotalScoreAll();
}

      //load selected score for each exercise
function updateScores() {
      var selected_points = document.querySelectorAll(".select_points")
      var sub_ex_index = 0;
      selected_points.forEach(function(element) {
          var panel = element.parentNode.parentNode.parentNode;
          var accordion = findSibling(panel, "accordion")
          var exercise_submitmode = accordion.querySelector(".submit_mode").selectedIndex;
          element.selectedIndex = all_scores[exercise_submitmode][sub_ex_index];
          sub_ex_index++;
      });
}

function saveSubmitModes() {
    //save submit modes
    var arr_save = [];
    var selected_modes = document.querySelectorAll(".submit_mode");
    var i = 0;
    selected_modes.forEach(function(element) {
        arr_save[i] = element.selectedIndex;
        i++;
    });
    localStorage.setItem('submit_mode', JSON.stringify(arr_save))
}

/// save in the scores matrix the updated the current selected value index
function saveScores(exercise_index, mode_index, selected_value_index) {
    //save updated score
    all_scores[mode_index][exercise_index] = selected_value_index;
    localStorage.setItem('points', JSON.stringify(all_scores))
}

function clearStorage(){
    if (confirm('Sei sicuro di voler cancellare tutto?')) {
        localStorage.clear();
        window.location.href = window.location.href;
    }
}
// Restricts input for the given textbox to the given inputFilter function.
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
      textbox.addEventListener(event, function() {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
          this.value = "";
        }
      });
    });
  }
