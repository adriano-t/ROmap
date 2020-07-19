

/* YAML ESEMPIO POLDO
---
name: dp_poldo
skills : 
    - grafi
    - modellazione
    - buona caratterizzazione 
title: Sottosequenze crescenti e decrescenti
description1: Si consideri la seguente sequenza di numeri naturali:<br>\[63, 18, 55, 81, 7, 9, 25, 13, 31, 47, 70, 83, 4, 32, 16, 61, 43, 20, 15, 54, 63, 99, 43, 14, 27\]

tasks:
- {
    tot_points: 10,
    ver_points: 10,
    description1: "Trovare una sottosequenza crescente che sia la più lunga possibile"
  }
- {
    tot_points: 20,
    ver_points: 20,
    description1: "Trovare quante sono le sottosequenze crescenti di lunghezza massima"
  }
- {
    tot_points: 20,
    ver_points: 20,
    description1: "Una sequenza è detta una _Z-sequenza_ , o sequenza crescente con un possibile ripensamento, se esiste un indice _i_ tale che ciascuno degli elementi della sequenza esclusi al più il primo e l'_i_-esimo sono strettamente maggiori dell'elemento che immediatamente li precede nella sequenza. Trovare la più lunga Z-sequenza che sia una sottosequenza della sequenza data"
  }
- {
    tot_points: 10,
    ver_points: 10,
    description1: "Trovare la più lunga sottosequenza crescente che includa l'elemento di valore 32"
  }
...

*/


window.addEventListener("load", function(){


    //accordion
    var acc = document.getElementsByClassName("accordion");
    var i;
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function(event) {
            // if(event.target != this)
            //     return; 
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
