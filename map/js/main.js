window.addEventListener("load", function(){


    //accordion
    var acc = document.getElementsByClassName("accordion");
    var i;
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function(event) {
             console.log(event.target.classList)
             if(event.target.classList.contains("submit_mode") || event.target.classList.contains("number") || event.target.parentNode.classList.contains("submit_mode"))
                     return; 
            event.preventDefault();
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
            console.log(this.parentElement);
        });
    }

    //numeric inputs
    var numberInputs = document.getElementsByClassName("number"); 
    for (i = 0; i < numberInputs.length; i++) {
        console.log(numberInputs[i]);
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

function load(){
    if(!localStorage.getItem('points')){
        !console.log(localStorage.getItem('points'), "no dati")
        return
    }    
    var arr_load=JSON.parse(localStorage.getItem('points'))
    var elements = document.querySelectorAll(".select_points")
    var i = 0;
    elements.forEach(function(element){
        console.log(element);
        element.selectedIndex=arr_load[i];
        i++;
    });
}

function save(){
    var arr_save=[];
    var elements = document.querySelectorAll(".select_points")
    console.log(elements)
    elements.forEach(function(element){
        console.log(element);
        arr_save.push(element.selectedIndex)
    })
    localStorage.setItem('points',JSON.stringify(arr_save))
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
