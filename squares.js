var clickElement;
var allMatches = [];
var foundMatches = [];
var allElements = [];
var element1, element2, element3;
var hit = new Audio("audio/hit.wav");
var beep = new Audio("audio/beep.wav");
var bellyes = new Audio("audio/bellyes.mp3");
var score = 0;

Array.prototype.arrIndexOf = function (val) {
    "use strict";
    var i, j, match;
    if (val instanceof Array) {
        for (i = 0; i < this.length; i = i + 1) {
            if (this[i] instanceof Array && this[i].length === val.length) {
                match = true;
                for (j = 0; j < val.length; j = j + 1) {
                    if (this[i][j] !== val[j]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    return i;
                }
            }

        }
        return -1;
    } else {
        return Array.prototype.indexOf(val);
    }
};

function updateScore(val) {
    score = score + val;
    document.getElementById("scoreboard").innerHTML = score;
}

element1 = "";
element2 = "";
element3 = "";
function getRandom() {
    'use strict';
    
    return (Math.round((Math.random() * 100)) % 3) + 1;
}

function select(element) {
    "use strict";
    element.style.transition = "1s ease";
    element.style.opacity = "0.5";
    element.style.borderRadius = "50%";
}

function unselect(element) {
    "use strict";
    element.style.transition = "1s ease";
    element.style.opacity = "1";
    element.style.borderRadius = "0%";
}

function unselectAll() {
    "use strict";
    unselect(element1);
    unselect(element2);
    unselect(element3);
    element1 = "";
    element2 = "";
    element3 = "";
}

function generateSquare() {
    'use strict';
    var div, imgList, foregroundList, backgroundList, text;
    imgList = ["<span>&#9728;</span>", "<span>&#9770;</span>", "<span>&#9733;</span>"];
    foregroundList = ["#000000", "#7F0800", "#00017F"];
    backgroundList = ["#FFDF4C", "#92CC51", "#516CCC"];
    div = document.createElement("div");
    text = getRandom() - 1;
    div.setAttribute("data-character", imgList[text]);
    div.style.backgroundColor = backgroundList[getRandom() - 1];
    div.style.color = foregroundList[getRandom() - 1];
    div.innerHTML += imgList[text];
    div.src = imgList[getRandom() - 1];
    div.onclick = function () { clickElement(this); };
    div.className = "hapimage"; // front" + getRandom().toString() + " back" + getRandom().toString();
    return div;
}

function matchDiv(a, b, c) {
    "use strict";
    var div;
    div = document.createElement("div");
    div.width = "100px";
    div.height = "20px";
    div.innerHTML = a.toString() + ", " + b.toString() + ", " + c.toString();
    div.onmouseover = function () {
        select(allElements[a - 1]);
        select(allElements[b - 1]);
        select(allElements[c - 1]);
    };
    div.onmouseout = function () {
        unselect(allElements[a - 1]);
        unselect(allElements[b - 1]);
        unselect(allElements[c - 1]);
    };
    return div;
}

function matchOrDistinct(a, b, c) {
    "use strict";
    if (a === b && b === c) {
        return true;
    } else if (a !== b && b !== c && a !== c) {
        return true;
    } else {
        return false;
    }
}

function backgroundsMatch(a, b, c) {
    'use strict';
    return matchOrDistinct(a.style.backgroundColor, b.style.backgroundColor, c.style.backgroundColor);
}

function charactersMatch(a, b, c) {
    'use strict';
    return matchOrDistinct(a.innerHTML, b.innerHTML, c.innerHTML);
}

function foregroundsMatch(a, b, c) {
    'use strict';
    return matchOrDistinct(a.style.color, b.style.color, c.style.color);
}

function squaresMatch(a, b, c) {
    'use strict';
    var all, el1, el2, el3;
    all = document.getElementsByClassName("hapimage");
    el1 = all[a];
    el2 = all[b];
    el3 = all[c];
    if (foregroundsMatch(el1, el2, el3) && backgroundsMatch(el1, el2, el3) && charactersMatch(el1, el2, el3)) {
        return true;
    }
    return false;
}

function getPos(el) {
    "use strict";
    return parseInt(el.getAttribute("data-position"));
}

function tryMatch() {
    "use strict";
    var tuple;
    tuple = [getPos(element1), getPos(element2), getPos(element3)];
    if (allMatches.arrIndexOf(tuple) !== -1 && foundMatches.arrIndexOf(tuple) === -1) {
        bellyes.play();
        foundMatches.push(tuple);
        document.getElementById("answercontainer").appendChild(matchDiv(getPos(element1), getPos(element2), getPos(element3)));
        updateScore(1);
    } else {
        beep.play();
        updateScore(-1);
    }
}

function clickElement(element) {
    'use strict';

    if (element1 === "") {
        select(element);
        hit.play();
        element1 = element;
        return;
    }
    
    if (element2 === "" && getPos(element1) !== getPos(element)) {
        select(element);
        hit.play();
        if (getPos(element1) < getPos(element)) {
            element2 = element;
        } else {
            element2 = element1;
            element1 = element;
        }
        return;
    }
    
    if (element3 === "" && getPos(element1) !== getPos(element) && getPos(element2) !== getPos(element)) {
        select(element);
        hit.play();
        if (getPos(element) > getPos(element2)) {
            element3 = element;
        } else {
            element3 = element2;
            if (getPos(element1) < getPos(element)) {
                element2 = element;
            } else {
                element2 = element1;
                element1 = element;
            }
        }
        setTimeout(tryMatch, 500);
        setTimeout(unselectAll, 1000);

        return;
    }
}

function newGame() {
    'use strict';
    var i, div, perms, oldmatches, newmatches, hapbutton;
    document.getElementById("answercontainer").innerHTML = "";
    document.getElementById("gameboard").innerHTML = "";
    div = document.getElementById("gameboard");
    updateScore(0);
    allElements = [];
    allMatches = [];
    foundMatches = [];
    
    for (i = 0; i < 9; i = i + 1) {
        allElements.push(generateSquare());
        allElements[i].setAttribute("data-position", i + 1);
        div.appendChild(allElements[i]);
    }
    
    perms = [[1, 2, 3], [1, 2, 4], [1, 2, 5], [1, 2, 6], [1, 2, 7], [1, 2, 8], [1, 2, 9], [1, 3, 4], [1, 3, 5],
             [1, 3, 6], [1, 3, 7], [1, 3, 8], [1, 3, 9], [1, 4, 5], [1, 4, 6], [1, 4, 7], [1, 4, 8], [1, 4, 9],
             [1, 5, 6], [1, 5, 7], [1, 5, 8], [1, 5, 9], [1, 6, 7], [1, 6, 8], [1, 6, 9], [1, 7, 8], [1, 7, 9],
             [1, 8, 9], [2, 3, 4], [2, 3, 5], [2, 3, 6], [2, 3, 7], [2, 3, 8], [2, 3, 9], [2, 4, 5], [2, 4, 6],
             [2, 4, 7], [2, 4, 8], [2, 4, 9], [2, 5, 6], [2, 5, 7], [2, 5, 8], [2, 5, 9], [2, 6, 7], [2, 6, 8],
             [2, 6, 9], [2, 7, 8], [2, 7, 9], [2, 8, 9], [3, 4, 5], [3, 4, 6], [3, 4, 7], [3, 4, 8], [3, 4, 9],
             [3, 5, 6], [3, 5, 7], [3, 5, 8], [3, 5, 9], [3, 6, 7], [3, 6, 8], [3, 6, 9], [3, 7, 8], [3, 7, 9],
             [3, 8, 9], [4, 5, 6], [4, 5, 7], [4, 5, 8], [4, 5, 9], [4, 6, 7], [4, 6, 8], [4, 6, 9], [4, 7, 8],
             [4, 7, 9], [4, 8, 9], [5, 6, 7], [5, 6, 8], [5, 6, 9], [5, 7, 8], [5, 7, 9], [5, 8, 9], [6, 7, 8],
             [6, 7, 9], [6, 8, 9], [7, 8, 9]];
    for (i = 0; i < perms.length; i = i + 1) {
        if (squaresMatch(perms[i][0] - 1, perms[i][1] - 1, perms[i][2] - 1)) {
            allMatches.push(perms[i]);
        }
    }
    
    hapbutton = document.createElement("button");
    hapbutton.textContent = "Gyul!";
    hapbutton.style.position = "relative";
    hapbutton.style.bottom = "0px";
    hapbutton.style.left = "0px";
    hapbutton.onclick = function () {
        if (foundMatches.length === allMatches.length) {
            bellyes.play();
            newGame();
            updateScore(3);
        } else {
            beep.play();
            updateScore(-1);
        }
    };
    document.getElementById("answercontainer").appendChild(hapbutton);

}