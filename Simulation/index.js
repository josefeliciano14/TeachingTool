//Setup
const relativeSize = 0.2;
const plate = document.getElementById("plate");
const center = document.getElementById("center");

const circles = [];
for(let i=1; i<=6; i++){
    circles.push(document.getElementById("circle" + i));
}

//Hide centerMenu
const centerMenu = document.getElementById("centerMenu");
centerMenu.style.visibility = "hidden";


//Hide circleMenu 1-6 
for(let i=1; i<=6; i++){
    const circleMenu = document.getElementById("circle" + i + "Menu");
    circleMenu.style.visibility = "hidden";
}

//Hide centerText
const centerText = document.getElementById("centerText");
centerText.style.visibility = "hidden";

//Hide circleText 1-6 
for(let i=1; i<=6; i++){
    const circleText = document.getElementById("circle" + i + "Text");
    circleText.style.visibility = "hidden";
}


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight *  0.717; //relative to window screen org val 600 
canvas.width = window.innerWidth * 0.353;


function resizeCircles(){
    const relativeSize = 0.2;
    center.style.width = (plate.offsetWidth * relativeSize) + "px"; 
    center.style.height = (plate.offsetHeight * relativeSize) + "px";   
    for(let i=0; i<circles.length; i++){
        circles[i].style.width = (plate.offsetWidth * relativeSize) + "px";
        circles[i].style.height = (plate.offsetHeight * relativeSize) + "px";
    }
}

function placeCircles(){
    //Place Center Circle 
    center.style.left = (plate.offsetWidth/2 - center.offsetWidth/2) + "px";
    center.style.top = (plate.offsetHeight/2 - center.offsetHeight/2) + "px";

    const platePadding = plate.offsetWidth*0.05;

    //Place Other Circles 1-6
    for(let i=0; i<6; i++){
        circles[i].style.left = (plate.offsetWidth/2 - circles[i].offsetWidth/2 + Math.cos(Math.PI*2/6*i)*(plate.offsetWidth/2 - circles[i].offsetWidth/2 - platePadding)) + "px";
        circles[i].style.top = (plate.offsetHeight/2 - circles[i].offsetWidth/2 - Math.sin(Math.PI*2/6*i)*(plate.offsetHeight/2 - circles[i].offsetWidth/2 - platePadding)) + "px";
    }
}

function placeText(e){
    const eventID = e.target.offsetParent.id;
    switch (eventID) {
        case "centerMenu":
            centerText.style.visibility = "visible";
            centerText.style.left = (center.offsetWidth/2 - centerText.offsetWidth/2) + "px";
            centerText.style.top = (center.offsetHeight/2 - centerText.offsetHeight/2) + "px";
            break;
        case "circle1Menu":
            circle1Text.style.visibility = "visible";
            circle1Text.style.left = (center.offsetWidth/2 - circle1Text.offsetWidth/2) + "px";
            circle1Text.style.top = (center.offsetHeight/2 - circle1Text.offsetHeight/2) + "px";
            break;
        case "circle2Menu":
            circle2Text.style.visibility = "visible";
            circle2Text.style.left = (center.offsetWidth/2 - circle2Text.offsetWidth/2) + "px";
            circle2Text.style.top = (center.offsetHeight/2 - circle2Text.offsetHeight/2) + "px";
            break;
        case "circle3Menu":
            circle3Text.style.visibility = "visible";
            circle3Text.style.left = (center.offsetWidth/2 - circle3Text.offsetWidth/2) + "px";
            circle3Text.style.top = (center.offsetHeight/2 - circle3Text.offsetHeight/2) + "px";
            break;
        case "circle4Menu":
            circle4Text.style.visibility = "visible";
            circle4Text.style.left = (center.offsetWidth/2 - circle4Text.offsetWidth/2) + "px";
            circle4Text.style.top = (center.offsetHeight/2 - circle4Text.offsetHeight/2) + "px";
            break;
        case "circle5Menu":
            circle5Text.style.visibility = "visible";
            circle5Text.style.left = (center.offsetWidth/2 - circle5Text.offsetWidth/2) + "px";
            circle5Text.style.top = (center.offsetHeight/2 - circle5Text.offsetHeight/2) + "px";
            break;
        case "circle6Menu":
            circle6Text.style.visibility = "visible";
            circle6Text.style.left = (center.offsetWidth/2 - circle6Text.offsetWidth/2) + "px";
            circle6Text.style.top = (center.offsetHeight/2 - circle6Text.offsetHeight/2) + "px";
            break;
    }
    
}

function centerClicked(){
    if(centerMenu.style.visibility == "hidden"){
        centerMenu.style.visibility = "visible";
    }
    else{
        centerMenu.style.visibility = "hidden";
    }
}

function menuClicked(e){
    const eventID = e.target.offsetParent.id;
    switch (eventID) {
        case "centerMenu":
            centerText.innerHTML = e.target.innerHTML;
            placeText(e);
            break;
        case "circle1Menu":
            circle1Text.innerHTML = e.target.innerHTML;
            placeText(e);
            break;
        case "circle2Menu":
            circle2Text.innerHTML = e.target.innerHTML;
            placeText(e);
            break;
        case "circle3Menu":
            circle3Text.innerHTML = e.target.innerHTML;
            placeText(e);
            break;
        case "circle4Menu":
            circle4Text.innerHTML = e.target.innerHTML;
            placeText(e);
            break;
        case "circle5Menu":
            circle5Text.innerHTML = e.target.innerHTML;
            placeText(e);
            break;
        case "circle6Menu":
            circle6Text.innerHTML = e.target.innerHTML;
            placeText(e);
            break;
    }
               
}

function handleResize() {
    placeText({ target: { offsetParent: { id: "centerMenu" } } });
    placeText({ target: { offsetParent: { id: "circle1Menu" } } });
    placeText({ target: { offsetParent: { id: "circle2Menu" } } });
    placeText({ target: { offsetParent: { id: "circle3Menu" } } });
    placeText({ target: { offsetParent: { id: "circle4Menu" } } });
    placeText({ target: { offsetParent: { id: "circle5Menu" } } });
    placeText({ target: { offsetParent: { id: "circle6Menu" } } });

}


function circleClicked(i){
    switch (i){
        case 1: 
            if(circle1Menu.style.visibility == "hidden"){
                circle1Menu.style.visibility = "visible";
            }
            else{
                circle1Menu.style.visibility = "hidden";
            }
            break;
        case 2: 
            if(circle2Menu.style.visibility == "hidden"){
                circle2Menu.style.visibility = "visible";
            }
            else{
                circle2Menu.style.visibility = "hidden";
            }
            break;
        case 3: 
            if(circle3Menu.style.visibility == "hidden"){
                circle3Menu.style.visibility = "visible";
            }
            else{
                circle3Menu.style.visibility = "hidden";
            }
            break;
        case 4: 
            if(circle4Menu.style.visibility == "hidden"){
                circle4Menu.style.visibility = "visible";
            }
            else{
                circle4Menu.style.visibility = "hidden";
            }
            break;
        case 5: 
            if(circle5Menu.style.visibility == "hidden"){
                circle5Menu.style.visibility = "visible";
            }
            else{
                circle5Menu.style.visibility = "hidden";
            }
            break;
        case 6: 
            if(circle6Menu.style.visibility == "hidden"){
                circle6Menu.style.visibility = "visible";
            }
            else{
                circle6Menu.style.visibility = "hidden";
            }
            break;
    }
}

//Circle event listener to show menu
centerMenu.addEventListener("click", (e) => menuClicked(e));
for (let i = 1; i <= 6; i++) {
    const circleMenu = document.getElementById(`circle${i}Menu`);
    circleMenu.addEventListener("click", (e) => menuClicked(e));
}


//ircle event listener when clicked
center.addEventListener("click", () => centerClicked());
for (let i = 1; i <= 6; i++) {
    const circle = document.getElementById(`circle${i}`);
    circle.addEventListener("click", () => {circleClicked(i)});
}

//Result Button 
const resultBtn = document.getElementById("results-btn");
resultBtn.addEventListener("click", (e) => handleResultButtonClick(e));


function handleResultButtonClick(e) { 
    const centerValue = document.getElementById('centerText').innerHTML;
    const circle1Value = document.getElementById('circle1Text').innerHTML;
    const circle2Value = document.getElementById('circle2Text').innerHTML;
    const circle3Value = document.getElementById('circle3Text').innerHTML;
    const circle4Value = document.getElementById('circle4Text').innerHTML;
    const circle5Value = document.getElementById('circle5Text').innerHTML;
    const circle6Value = document.getElementById('circle6Text').innerHTML;
    const circleValues = [circle1Value,circle2Value,circle3Value,circle4Value,circle5Value,circle6Value]
    
    for(let i = 0; i < 6; i++) {
        if(circleValues[i] == ''){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    if (centerValue !== '' && circle1Value !== '' && circle2Value !== '' && circle3Value !== '' && circle4Value !== '' && circle5Value !== '' && circle6Value !== '') {
        // Clear previous lines draw on canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    
    //switch statement check center value 
    switch(centerValue){
        case "BSA":
            centerBSA(centerValue,circle1Value,circle2Value,circle3Value,circle4Value,circle5Value,circle6Value);
            break; 
        case "HSA":
            centerHSA(centerValue,circle1Value,circle2Value,circle3Value,circle4Value,circle5Value,circle6Value);
            break;
        case "Anti-BSA":
            centerAntiBSA(centerValue,circle1Value,circle2Value,circle3Value,circle4Value,circle5Value,circle6Value);
            break;
        case "Anti-HSA":
            centerAntiHSA(centerValue,circle1Value,circle2Value,circle3Value,circle4Value,circle5Value,circle6Value);
            break;
        case "Anti-HSA + BSA":
            centerAntiHSA_BSA(centerValue,circle1Value,circle2Value,circle3Value,circle4Value,circle5Value,circle6Value);
            break;
        case "BSA + Ins":
            centerBSA_Ins(centerValue,circle1Value,circle2Value,circle3Value,circle4Value,circle5Value,circle6Value);
            break;
        case "Anti-BSA + Anti-Ins":
            centerAntiBSA_AntiIns(centerValue,circle1Value,circle2Value,circle3Value,circle4Value,circle5Value,circle6Value);
            break;
    }
}

function drawCurves(circle){
    const val = circle; //0-5
    const angle = Math.PI*(2/6)*val;

    const r1 = 0.417*(plate.offsetWidth / 2); //125 relative to bigger circle *300 
    const r2 = 0.467*(plate.offsetWidth / 2); //140
    const centerX = plate.offsetWidth / 2;
    const centerY = plate.offsetHeight / 2; 

    //Curve Point 1
    const x1 = r1*Math.cos(angle+.25);
    const y1 = r1*Math.sin(angle+.25);

    //Curve Point 2
    const x2 = r2*Math.cos(angle+.50);
    const y2 = r2*Math.sin(angle+.50);

    //Curve Point 3
    const x3 = r1*Math.cos(angle+.75);
    const y3 = r1*Math.sin(angle+.75);


    if(val <= 5){
        ctx.beginPath(); // start a new path
        ctx.moveTo(centerX+ x1, centerY - y1);
        ctx.quadraticCurveTo(centerX + x2, centerY -y2, centerX+ x3, centerY - y3); // adjust control point
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;
        ctx.stroke(); // stroke the path
    }
 
}

function drawLines(circle){
    const val = circle; //0-5
    const angle = Math.PI*(2/6)*val;
    const angle1 = Math.PI*(2/6)*(val+1);

    const r1 = 0.417*(plate.offsetWidth / 2); //125 
    const centerX = plate.offsetWidth / 2;
    const centerY = plate.offsetHeight / 2; 

    //Curve Point 1
    const x1 = r1*Math.cos(angle1+.25);
    const y1 = r1*Math.sin(angle1+.25);

    //Curve Point 3
    const x3 = r1*Math.cos(angle+.75);
    const y3 = r1*Math.sin(angle+.75);

    if(val <= 5){
        ctx.beginPath();
        ctx.moveTo(centerX + x3, centerY - y3); //circle 1 val 0
        ctx.lineTo(centerX + x1, centerY - y1); //circle 2 val 1
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
 
}

function drawLongerLinesLeft(circle){
    const val = circle; //0-5
    const angle = Math.PI*(2/6)*val; //current circle
    const angle1 = Math.PI*(2/6)*(val+1); //next circle

    const r1 = 0.417*(plate.offsetWidth / 2); //125
    const r3 = 0.533*(plate.offsetWidth / 2); //160
    const centerX = plate.offsetWidth / 2;
    const centerY = plate.offsetHeight / 2; 

    //Current Circle Point 3
    const x1 = r1*Math.cos(angle+.75);
    const y1 = r1*Math.sin(angle+.75);

    //Next Circle Point 1
    const x2 = r1*Math.cos(angle1+.25);
    const y2 = r1*Math.sin(angle1+.25);

    //Next Circle Point 3
    const x3 = r3*Math.cos(angle1+.75);
    const y3 = r3*Math.sin(angle1+.75);


    if(val <= 5){
        ctx.beginPath();
        ctx.moveTo(centerX + x1, centerY - y1); //circle 1 val 0
        ctx.lineTo(centerX + x2, centerY - y2); //circle 2 val 1
        ctx.lineTo(centerX + x3, centerY - y3); //circle 2 val 1
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
 
}

function drawLongerLinesRight(circle){
    const val = circle; //0-5
    const angle = Math.PI*(2/6)*val; //current circle
    const angle1 = Math.PI*(2/6)*(val+1); //next circle

    const r1 = 0.417*(plate.offsetWidth / 2); //125
    const r3 = 0.533*(plate.offsetWidth / 2); //160
    const centerX = plate.offsetWidth / 2;
    const centerY = plate.offsetHeight / 2; 

    //Next Circle Point 1
    const x2 = r1*Math.cos(angle1+.25);
    const y2 = r1*Math.sin(angle1+.25);
    
    //Current Circle Point 3
    const x1 = r1*Math.cos(angle+.75);
    const y1 = r1*Math.sin(angle+.75);

    //Next Circle Point 1
    const x3 = r3*Math.cos(angle+.25);
    const y3 = r3*Math.sin(angle+.25);

    
    if(val <= 5){
        ctx.beginPath();
        ctx.moveTo(centerX + x2, centerY - y2); //circle 1 val 0
        ctx.lineTo(centerX + x1, centerY - y1); //circle 2 val 1
        ctx.lineTo(centerX + x3, centerY - y3); //circle 2 val 1
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
 
}

function centerBSA(a,b,c,d,e,f,g){
    const centerValue = a;
    const circleValues = [b, c, d, e, f, g];

    for(let i = 0; i < 6; i++) {
        if(centerValue == "BSA"){
            if(circleValues[i] == "Anti-BSA"){
                if(i==5){
                    if(circleValues[i-5] == "Anti-BSA" || circleValues[i-5] == "Anti-HSA"){ 
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }

                }
                else if(circleValues[i+1] == "Anti-BSA" || circleValues[i+1] == "Anti-HSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLines(i+5);       
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);

                    }

                }
            }
            else if(circleValues[i] == "Anti-HSA"){
                if(i==5){
                    if(circleValues[i-5] == "Anti-BSA" || circleValues[i-5] == "Anti-HSA"){ 
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }

                }
                else if(circleValues[i+1] == "Anti-BSA" || circleValues[i+1] == "Anti-HSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLines(i+5);       
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);

                    }

                }
            }
            
        }
    }
}

function centerHSA(a,b,c,d,e,f,g){
    const centerValue = a;
    const circleValues = [b, c, d, e, f, g];

    for(let i = 0; i < 6; i++) {
        if(centerValue == "HSA"){
            if(circleValues[i] == "Anti-BSA"){
                if(i==5){
                    if(circleValues[i-5] == "Anti-BSA" || circleValues[i-5] == "Anti-HSA" || circleValues[i-5] == "Anti-HSA + BSA"){ 
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }

                }
                else if(circleValues[i+1] == "Anti-BSA" || circleValues[i+1] == "Anti-HSA" || circleValues[i+1] == "Anti-HSA + BSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLines(i+5);       
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);

                    }

                }
            }
            else if(circleValues[i] == "Anti-HSA"){
                if(i==5){
                    if(circleValues[i-5] == "Anti-BSA" || circleValues[i-5] == "Anti-HSA" || circleValues[i-5] == "Anti-HSA + BSA"){ 
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }

                }
                else if(circleValues[i+1] == "Anti-BSA" || circleValues[i+1] == "Anti-HSA" || circleValues[i+1] == "Anti-HSA + BSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLines(i+5);       
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);

                    }

                }
            }
            else if(circleValues[i] == "Anti-HSA + BSA"){
                if(i==5){
                    if(circleValues[i-5] == "Anti-BSA" || circleValues[i-5] == "Anti-HSA" || circleValues[i-5] == "Anti-HSA + BSA"){ 
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }

                }
                else if(circleValues[i+1] == "Anti-BSA" || circleValues[i+1] == "Anti-HSA" || circleValues[i+1] == "Anti-HSA + BSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLines(i+5);       
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);

                    }

                }
            }
            
        }
    }
}

function centerAntiBSA(a,b,c,d,e,f,g){
    const centerValue = a;
    const circleValues = [b, c, d, e, f, g];

    for(let i = 0; i < 6; i++) {
        if(centerValue == "Anti-BSA"){
            if(circleValues[i] == "BSA"){
                if(i == 5){
                    if(circleValues[i-5] == "BSA"){
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                    else if(circleValues[i-5] == "HSA"){
                        drawCurves(i);
                        drawLines(i);
                        drawLongerLinesLeft(i-1);
                    }
                }
                else if(circleValues[i+1] == "BSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLines(i+5);
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                    
                }
                else if(circleValues[i+1] == "HSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLongerLinesLeft(i+5);
                    }
                    else{
                        drawCurves(i);
                        drawLines(i);
                        drawLongerLinesLeft(i-1);
                    }
                }
            }
            else if(circleValues[i] == "HSA"){
                if(i == 5){
                    if(circleValues[i-5] == "HSA"){
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                    else if(circleValues[i-5] == "BSA"){
                        drawCurves(i);
                        drawLines(i-1);
                        drawLongerLinesRight(i);
                    }
                }
                else if(circleValues[i+1] == "HSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLines(i+5);
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                    
                }
                else if(circleValues[i+1] == "BSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i+5);
                        drawLongerLinesRight(i);
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLongerLinesRight(i);
                    }
                }
            }
        }
    }
}

function centerAntiHSA(a,b,c,d,e,f,g){
    const centerValue = a;
    const circleValues = [b, c, d, e, f, g];

    for(let i = 0; i < 6; i++) {
        if(centerValue == "Anti-HSA"){
            if(circleValues[i] == "HSA"){
                if(i == 5){
                    if(circleValues[i-5] == "HSA"){
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                    else if(circleValues[i-5] == "BSA"){
                        drawCurves(i);
                        drawLines(i);
                        drawLongerLinesLeft(i-1);
                    }
                }
                else if(circleValues[i+1] == "HSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLines(i+5);
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                    
                }
                else if(circleValues[i+1] == "BSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLongerLinesLeft(i+5);
                    }
                    else{
                        drawCurves(i);
                        drawLines(i);
                        drawLongerLinesLeft(i-1);
                    }
                }
            }
            else if(circleValues[i] == "BSA"){
                if(i == 5){
                    if(circleValues[i-5] == "BSA"){
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                    else if(circleValues[i-5] == "HSA"){
                        drawCurves(i);
                        drawLines(i-1);
                        drawLongerLinesRight(i);
                    }
                }
                else if(circleValues[i+1] == "BSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLines(i+5);
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                    
                }
                else if(circleValues[i+1] == "HSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i+5);
                        drawLongerLinesRight(i);
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLongerLinesRight(i);
                    }
                }
            }
        }
    }
}

function centerAntiHSA_BSA(a,b,c,d,e,f,g){
    const centerValue = a;
    const circleValues = [b, c, d, e, f, g];

    for(let i = 0; i < 6; i++) {
        if(centerValue == "Anti-HSA + BSA"){
            if(circleValues[i] == "HSA"){
                if(i == 5){
                    if(circleValues[i-5] == "HSA"){
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                }
                else if(circleValues[i+1] == "HSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLines(i+5);
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                }

            }
        }
    }
}

function centerBSA_Ins(a,b,c,d,e,f,g){
    const centerValue = a;
    const circleValues = [b, c, d, e, f, g];

    for(let i = 0; i < 6; i++) {
        if(centerValue == "BSA + Ins"){
            if(circleValues[i] == "Anti-BSA"){
                if(i == 5){
                    if(circleValues[i-5] == "Anti-Ins"){
                        drawLongerLinesLeft(i-1);
                        drawLongerLinesRight(i);
                    }
                    else if(circleValues[i-5] == "Anti-BSA"){
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                }
                else if(circleValues[i+1] == "Anti-Ins"){
                    if(i == 0){
                        drawLongerLinesLeft(i+5);
                        drawLongerLinesRight(i);
                    }
                    else{
                        drawLongerLinesLeft(i-1);
                        drawLongerLinesRight(i);
                    }
                }
                else if(circleValues[i+1] == "Anti-BSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLines(i+5); 
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                }

            }
            else if(circleValues[i] == "Anti-Ins"){
                if(i == 5){
                    if(circleValues[i-5] == "Anti-BSA"){
                        drawLongerLinesLeft(i-1);
                        drawLongerLinesRight(i);
                    }
                    else if(circleValues[i-5] == "Anti-Ins"){
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                }
                else if(circleValues[i+1] == "Anti-BSA"){
                    if(i == 0){
                        drawLongerLinesLeft(i+5);
                        drawLongerLinesRight(i);
                    }
                    else{
                        drawLongerLinesLeft(i-1);
                        drawLongerLinesRight(i);
                    }
                }
                else if(circleValues[i+1] == "Anti-Ins"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLines(i+5); 
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                }
            }
        }
    }
}

function centerAntiBSA_AntiIns(a,b,c,d,e,f,g){
    const centerValue = a;
    const circleValues = [b, c, d, e, f, g];

    for(let i = 0; i < 6; i++) {
        if(centerValue == "Anti-BSA + Anti-Ins"){
            if(circleValues[i] == "BSA"){
                if(i == 5){
                    if(circleValues[i-5] == "Ins"){
                        drawLongerLinesLeft(i-1);
                        drawLongerLinesRight(i);
                    }
                    else if(circleValues[i-5] == "BSA"){
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                }
                else if(circleValues[i+1] == "Ins"){
                    if(i == 0){
                        drawLongerLinesLeft(i+5);
                        drawLongerLinesRight(i);
                    }
                    else{
                        drawLongerLinesLeft(i-1);
                        drawLongerLinesRight(i);
                    }
                }
                else if(circleValues[i+1] == "BSA"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLines(i+5); 
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                }

            }
            else if(circleValues[i] == "Ins"){
                if(i == 5){
                    if(circleValues[i-5] == "BSA"){
                        drawLongerLinesLeft(i-1);
                        drawLongerLinesRight(i);
                    }
                    else if(circleValues[i-5] == "Ins"){
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                }
                else if(circleValues[i+1] == "BSA"){
                    if(i == 0){
                        drawLongerLinesLeft(i+5);
                        drawLongerLinesRight(i);
                    }
                    else{
                        drawLongerLinesLeft(i-1);
                        drawLongerLinesRight(i);
                    }
                }
                else if(circleValues[i+1] == "Ins"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLines(i+5); 
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                }
            }
            else if(circleValues[i] == "BSA + Ins"){
                if(i == 5){
                    if(circleValues[i-5] == "BSA + Ins"){
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                }
                else if(circleValues[i+1] == "BSA + Ins"){
                    if(i == 0){
                        drawCurves(i);
                        drawLines(i);
                        drawLines(i+5); 
                    }
                    else{
                        drawCurves(i);
                        drawLines(i-1);
                        drawLines(i);
                    }
                }
            }
        }
    }
}

//responsiveness
function resizeMenus(){
    centerMenu.style.width = "auto"; 
    centerMenu.style.height = "auto"; 
    const fontSizeWidth = centerMenu.offsetWidth * 0.15; 
    const fontSizeHeight = centerMenu.offsetHeight * 0.16; 
    const fontSize = Math.min(fontSizeWidth, fontSizeHeight, 16); 
    centerMenu.style.fontSize = fontSize + 'px';

    for(let i=1; i<=6; i++){
        const circleMenu = document.getElementById("circle" + i + "Menu");
        circleMenu.style.width = "auto"; 
        circleMenu.style.height = "auto";

        const fontSizeWidth = circleMenu.offsetWidth * 0.15; 
        const fontSizeHeight = circleMenu.offsetHeight * 0.16; 
        const fontSize = Math.min(fontSizeWidth, fontSizeHeight, 16); 
        circleMenu.style.fontSize = fontSize + 'px';
    }
}

resizeCircles();
placeCircles();

window.addEventListener('resize', menuClicked);

window.addEventListener('resize', function() {
    resizeCircles();
    placeCircles();
    handleResize();
    handleResultButtonClick();
    resizeMenus();
});

// drawLongerLinesLeft(0);
// drawLongerLinesRight(1);

