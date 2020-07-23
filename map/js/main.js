var num_modes;
var all_scores=[];
var current_modes=[];
var tot_num_subprob;
var textarea_notes = [];
window.addEventListener("load", function(){
    tot_num_subprob = document.querySelectorAll(".select_points").length
    num_modes=document.querySelector(".submit_mode").length
    

    for(i=0;i<num_modes;i++){
        var a=[]
        for(j=0;j<tot_num_subprob;j++)
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
        var accordion = element.parentNode.parentNode;
        element.addEventListener("change", function(){
            var current_index_mod = accordion.querySelector(".submit_mode").selectedIndex;
            saveScores(exercise_index, current_index_mod, element.selectedIndex)
            saveSubmitModes();
            updateTotalScore(element);
        })
        i++;
    })
    
    //add event listeners for submit-mode selection
    var sel = document.querySelectorAll(".submit_mode")
    var i = 0; 
    sel.forEach(function(element){
        var exercise_index = i;
        element.addEventListener("change", function(){
            updateScore(exercise_index, element.selectedIndex);
            saveSubmitModes();
            updateTotalScore(element);
        });
        i++;
    })

    //accordion
    var acc = document.getElementsByClassName("accordion");
    var i;
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function(event) {
             //console.log(event.target.classList)
             if(event.target.classList.contains("submit_mode") || event.target.classList.contains("select_points") || event.target.parentNode.classList.contains("submit_mode") ||event.target.parentNode.classList.contains("select_points"))
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
            //console.log(this.parentElement);
        });
    }

    //numeric inputs
    var numberInputs = document.getElementsByClassName("number"); 
    for (i = 0; i < numberInputs.length; i++) {
        //console.log(numberInputs[i]);
        setInputFilter(numberInputs[i], function(value){
            return /^\d*$/.test(value);
        });
    }
    //const yaml = require('js-yaml');
    //;
    // try {
    //     let fileContents = readTextFile("./poldo.yaml", function(text){
    //         let data = jsyaml.safeLoad(text);
    //         console.log(data);
    //     });
    // } catch (e) {
    //     console.log(e);
    // }
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

//update total score of the parent exercise
function updateTotalScore(element){
    var accordion = findParent(element, "accordion"); 
    var panel = accordion.parentNode;
    var parentAccordion = findSibling(panel, "accordion"); 

    var sel = panel.querySelectorAll(".select_points")
    var sum=0;
    sel.forEach(function(sel){
        sum+=parseInt(sel.value);
    })
    parentAccordion.querySelector(".maxpoints").innerHTML = sum; 
}

//update total score of every exercise
function updateTotalScoreAll(){
    var panels = document.querySelectorAll(".panel")
    panels.forEach(function(panel)
    {
        var sel = panel.querySelectorAll(".select_points")
        var sum=0;
        sel.forEach(function(sel){
            sum+=parseInt(sel.value);
        })
        var parentAccordion = findSibling(panel, "accordion");
        parentAccordion.querySelector(".maxpoints").innerHTML = sum; 
    });
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
    if(pts)
    {
        all_scores = JSON.parse(pts)

        //load selected score for each exercise
        var selected_points = document.querySelectorAll(".select_points")
        var ex_index = 0;
        selected_points.forEach(function(element){
            var exercise_submitmode = loaded_submit_modes[ex_index];
            element.selectedIndex = all_scores[exercise_submitmode][ex_index];
            console.log("exercise index:", element.selectedIndex)
            ex_index++;
        });
    }

    //load notes
    var notes = localStorage.getItem("notes");
    if(notes)
    {
        textarea_notes = JSON.parse(notes);
        console.log("load", textarea_notes);
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

function updateScore(exerciseIndex, selectedMode)
{
    var sel = document.querySelectorAll(".select_points");
    var current_score = all_scores[selectedMode][exerciseIndex];
    sel[exerciseIndex].selectedIndex = current_score;
    console.log(current_score, sel[exerciseIndex].selectedIndex);
}

function saveSubmitModes()
{
    //save submit modes
    var arr_save = [];
    var selected_modes = document.querySelectorAll(".submit_mode")
    var i = 0;
    selected_modes.forEach(function(element){
        arr_save[i] = element.selectedIndex;
        i++;
    });
    console.log("save submit_mode", arr_save);
    localStorage.setItem('submit_mode',JSON.stringify(arr_save))
}

/// save in the scores matrix the updated the current selected value index
function saveScores(exercise_index , mode_index , selected_value_index) {
    console.log(exercise_index+")", mode_index, selected_value_index)
    //save updated score
    all_scores[mode_index][exercise_index]=selected_value_index
    localStorage.setItem('points',JSON.stringify(all_scores))
    console.log("save all_scores", all_scores);

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
