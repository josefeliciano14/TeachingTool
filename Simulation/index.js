//Setup
const relativeSize = 0.2;
const plate = document.getElementById("plate");
const center = document.getElementById("center");

const circles = [];
for(let i=1; i<=6; i++){
    circles.push(document.getElementById("circle" + i));
}

const centerMenu = document.getElementById("centerMenu");
centerMenu.style.visibility = "hidden";

const circle1Menu = document.getElementById("circle1Menu");
circle1Menu.style.visibility = "hidden";

const circle2Menu = document.getElementById("circle2Menu");
circle2Menu.style.visibility = "hidden";

const circle3Menu = document.getElementById("circle3Menu");
circle3Menu.style.visibility = "hidden";

const circle4Menu = document.getElementById("circle4Menu");
circle4Menu.style.visibility = "hidden";

const circle5Menu = document.getElementById("circle5Menu");
circle5Menu.style.visibility = "hidden";

const circle6Menu = document.getElementById("circle6Menu");
circle6Menu.style.visibility = "hidden";

const centerText = document.getElementById("centerText");
centerText.style.visibility = "hidden";

const circle1Text = document.getElementById("circle1Text");
circle1Text.style.visibility = "hidden";

const circle2Text = document.getElementById("circle2Text");
circle2Text.style.visibility = "hidden";

const circle3Text = document.getElementById("circle3Text");
circle3Text.style.visibility = "hidden";

const circle4Text = document.getElementById("circle4Text");
circle4Text.style.visibility = "hidden";

const circle5Text = document.getElementById("circle5Text");
circle5Text.style.visibility = "hidden";

const circle6Text = document.getElementById("circle6Text");
circle6Text.style.visibility = "hidden";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.height = 600;
canvas.width = 600;


//Resize Circles 
center.style.width = (plate.offsetWidth * relativeSize) + "px";
center.style.height = (plate.offsetHeight * relativeSize) + "px";
for(let i=0; i<circles.length; i++){
    circles[i].style.width = (plate.offsetWidth * relativeSize) + "px";
    circles[i].style.height = (plate.offsetHeight * relativeSize) + "px";
}

//Place Center Circle 
center.style.left = (plate.offsetWidth/2 - center.offsetWidth/2) + "px";
center.style.top = (plate.offsetHeight/2 - center.offsetHeight/2) + "px";

const platePadding = plate.offsetWidth*0.05;

//Place Other Circles
for(let i=0; i<6; i++){
    circles[i].style.left = (plate.offsetWidth/2 - circles[i].offsetWidth/2 + Math.cos(Math.PI*2/6*i)*(plate.offsetWidth/2 - circles[i].offsetWidth/2 - platePadding)) + "px";
    circles[i].style.top = (plate.offsetHeight/2 - circles[i].offsetWidth/2 - Math.sin(Math.PI*2/6*i)*(plate.offsetHeight/2 - circles[i].offsetWidth/2 - platePadding)) + "px";
}


//Get center point of circles 
const center_x = Number(center.style.left.toString().replace("px", "")) + center.offsetWidth / 2;
const center_y = Number(center.style.top.toString().replace("px", "")) + center.offsetHeight / 2;
const circle1_x = Number(circles[0].style.left.toString().replace("px", "")) + circles[0].offsetWidth / 2;
const circle1_y = Number(circles[0].style.top.toString().replace("px", "")) + circles[0].offsetHeight / 2;
const circle2_x = Number(circles[1].style.left.toString().replace("px", "")) + circles[1].offsetWidth / 2;
const circle2_y = Number(circles[1].style.top.toString().replace("px", "")) + circles[1].offsetHeight / 2;

const circle3_x = Number(circles[2].style.left.toString().replace("px", "")) + circles[2].offsetWidth / 2;
const circle3_y = Number(circles[2].style.top.toString().replace("px", "")) + circles[2].offsetHeight / 2;
const circle4_x = Number(circles[3].style.left.toString().replace("px", "")) + circles[3].offsetWidth / 2;
const circle4_y = Number(circles[3].style.top.toString().replace("px", "")) + circles[3].offsetHeight / 2;

const circle5_x = Number(circles[4].style.left.toString().replace("px", "")) + circles[4].offsetWidth / 2;
const circle5_y = Number(circles[4].style.top.toString().replace("px", "")) + circles[4].offsetHeight / 2;
const circle6_x = Number(circles[5].style.left.toString().replace("px", "")) + circles[5].offsetWidth / 2;
const circle6_y = Number(circles[5].style.top.toString().replace("px", "")) + circles[5].offsetHeight / 2;

//Get midpoints between circles 
const mpC1C2_x = ((circle1_x + circle2_x)/2) - 20; 
const mpC1C2_y = ((circle1_y + circle2_y)/2) + 15;

const mpC2C3_x = (((circle2_x) + circle3_x)/2); 
const mpC2C3_y = ((circle2_y + circle3_y)/2);

const mpC3C4_x = ((circle3_x + circle4_x)/2) + 20; 
const mpC3C4_y = ((circle3_y + circle4_y)/2) + 15;

const mpC4C5_x = ((circle4_x + circle5_x)/2) + 20; 
const mpC4C5_y = ((circle4_y + circle5_y)/2) - 15;

const mpC5C6_x = ((circle5_x + circle6_x)/2); 
const mpC5C6_y = ((circle5_y + circle6_y)/2);

const mpC6C1_x = ((circle6_x + circle1_x)/2) - 20; 
const mpC6C1_y = ((circle6_y + circle1_y)/2) - 15;



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
center.addEventListener("click", () => centerClicked());
centerMenu.addEventListener("click", (e) => menuClicked(e));
circle1Menu.addEventListener("click", (e) => menuClicked(e));
circle2Menu.addEventListener("click", (e) => menuClicked(e));
circle3Menu.addEventListener("click", (e) => menuClicked(e));
circle4Menu.addEventListener("click", (e) => menuClicked(e));
circle5Menu.addEventListener("click", (e) => menuClicked(e));
circle6Menu.addEventListener("click", (e) => menuClicked(e));


//Event listener circles 1-6
for (let i = 1; i <= 6; i++) {
    const circle = document.getElementById(`circle${i}`);
    circle.addEventListener("click", () => {circleClicked(i)});
}

//Draws stright line for circle 1
function circle1StraightLine(){
    ctx.beginPath();
    ctx.strokeStyle = "purple";
    ctx.moveTo(mpC1C2_x - 15, mpC1C2_y - 18);
    ctx.lineTo(mpC6C1_x - 15, mpC6C1_y + 18);
    ctx.stroke(); 

}
//Draws circle1 Bezier curve above
function circle1Curve1(){
    ctx.beginPath();
    ctx.strokeStyle = "purple";
    ctx.bezierCurveTo(mpC1C2_x-30, mpC1C2_y-8, mpC1C2_x-14, mpC1C2_y-5, mpC1C2_x-15, mpC1C2_y+15);
    ctx.moveTo(mpC1C2_x - 15, mpC1C2_y +15);
    ctx.lineTo(mpC6C1_x - 15, mpC6C1_y - 19);
    ctx.stroke();   
}
function circle1Curve2(){
    ctx.beginPath();
    ctx.strokeStyle = "purple";
    ctx.bezierCurveTo(mpC6C1_x - 15.4, mpC6C1_y-20, mpC6C1_x-14, mpC6C1_y+5, mpC6C1_x-35, mpC6C1_y+9.8);
    ctx.moveTo(mpC1C2_x - 15, mpC1C2_y +15);
    ctx.lineTo(mpC6C1_x - 15, mpC6C1_y - 19);
    ctx.stroke(); 
}


//Draws stright line for circle 2
function circle2StraightLine(){
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.moveTo(mpC1C2_x, mpC1C2_y);
    ctx.lineTo(center_x -15, center_y - mpC2C3_y);
    ctx.stroke();

}
//Draws line 2 with benzier curve to right
function circle2Curve1(){
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.bezierCurveTo(mpC1C2_x-30, mpC1C2_y-8, mpC1C2_x-14, mpC1C2_y-5, mpC1C2_x-15, mpC1C2_y+15);
    ctx.moveTo(mpC1C2_x -30, mpC1C2_y - 8);
    ctx.lineTo(center_x + 16, (center_y - mpC2C3_y)+7);
    ctx.stroke();
}
//Draws line 2 with benzier curve to left
function circle2Curve2(){
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.bezierCurveTo(mpC2C3_x+19, mpC2C3_y+70, mpC2C3_x, mpC2C3_y+62, mpC2C3_x - 17, mpC2C3_y+70);
    ctx.moveTo(mpC1C2_x -30, mpC1C2_y - 8);
    ctx.lineTo(center_x + 16, (center_y - mpC2C3_y)+7);
    ctx.stroke();
}


//Draws straight line for circle 3
function circle3StraightLine(){
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(mpC3C4_x, mpC3C4_y);
    ctx.lineTo(center_x + 15, center_y - mpC2C3_y);
    ctx.stroke();
}
//Draws line 3 with benzier curve to right
function circle3Curve1(){
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.bezierCurveTo(mpC2C3_x+18, mpC2C3_y+70, mpC2C3_x+2, mpC2C3_y+64, mpC2C3_x-14, mpC2C3_y+70);
    ctx.moveTo(mpC3C4_x+36, mpC3C4_y-12);
    ctx.lineTo(center_x - 14, (center_y - mpC2C3_y)+7.7);
    ctx.stroke();
}
function circle3Curve2(){
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.bezierCurveTo(mpC3C4_x+30, mpC3C4_y-10, mpC3C4_x+9, mpC3C4_y-10, mpC3C4_x+15, mpC3C4_y+12);
    ctx.moveTo(mpC3C4_x+28, mpC3C4_y-10);
    ctx.lineTo(center_x - 14, (center_y - mpC2C3_y)+7.7);
    ctx.stroke();
}


//Draws stright line for circle 4
function circle4StraightLine(){
    ctx.beginPath();
    ctx.strokeStyle = "yellow";
    ctx.moveTo(mpC3C4_x + 15, mpC3C4_y - 18);
    ctx.lineTo(mpC4C5_x + 15, mpC4C5_y + 18);
    ctx.stroke();
}
function circle4Curve1(){
    ctx.beginPath();
    ctx.strokeStyle = "yellow";
    ctx.bezierCurveTo(mpC3C4_x+30, mpC3C4_y-10, mpC3C4_x+12, mpC3C4_y-10, mpC3C4_x+14.8, mpC3C4_y+9);
    ctx.moveTo(mpC3C4_x + 14.5, mpC3C4_y + 8);
    ctx.lineTo(mpC4C5_x + 13.4, mpC4C5_y - 15);
    ctx.stroke();
}
function circle4Curve2(){
    ctx.beginPath();
    ctx.strokeStyle = "yellow";
    ctx.bezierCurveTo(mpC4C5_x + 35, mpC4C5_y+8, mpC4C5_x+14, mpC4C5_y+5, mpC4C5_x+15.4, mpC4C5_y-20);
    ctx.moveTo(mpC3C4_x + 14.5, mpC3C4_y + 8);
    ctx.lineTo(mpC4C5_x + 15, mpC4C5_y - 15);
    ctx.stroke();
}

//Draws stright line for circle 5
function circle5StraightLine(){
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.moveTo(mpC4C5_x, mpC4C5_y-1);
    ctx.lineTo(center_x + 15, center_y + mpC2C3_y);
    ctx.stroke();
}
function circle5Curve1(){
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.bezierCurveTo(mpC4C5_x + 35, mpC4C5_y+8, mpC4C5_x+14, mpC4C5_y+5, mpC4C5_x+15.4, mpC4C5_y-20);
    ctx.moveTo(mpC4C5_x +35, mpC4C5_y+8);
    ctx.lineTo(center_x-18, (center_y + mpC2C3_y)-9);
    ctx.stroke();

}
function circle5Curve2(){
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.bezierCurveTo(mpC5C6_x+20, mpC5C6_y-72, mpC5C6_x, mpC5C6_y-62, mpC5C6_x - 20, mpC5C6_y-72);
    ctx.moveTo(mpC4C5_x +35, mpC4C5_y+8);
    ctx.lineTo(center_x-18, (center_y + mpC2C3_y)-9);
    ctx.stroke();
}

//Draws stright line for circle 6
function circle6StraightLine(){
    ctx.beginPath();
    ctx.strokeStyle = "orange";
    ctx.moveTo(mpC6C1_x, mpC6C1_y);
    ctx.lineTo(center_x - 15, center_y + mpC2C3_y);
    ctx.stroke();
}
function circle6Curve1(){
    ctx.beginPath();
    ctx.strokeStyle = "orange";
    ctx.bezierCurveTo(mpC6C1_x - 15.4, mpC6C1_y-20, mpC6C1_x-14, mpC6C1_y+5, mpC6C1_x-35, mpC6C1_y+9.8);
    ctx.moveTo(mpC6C1_x -35, mpC6C1_y + 10);
    ctx.lineTo(center_x + 15, (center_y + mpC2C3_y)-8);
    ctx.stroke();
}
function circle6Curve2(){
    ctx.beginPath();
    ctx.strokeStyle = "orange";
    ctx.bezierCurveTo(mpC5C6_x+20, mpC5C6_y-72, mpC5C6_x, mpC5C6_y-62, mpC5C6_x - 20, mpC5C6_y-72);
    ctx.moveTo(mpC6C1_x -35, mpC6C1_y + 10);
    ctx.lineTo(center_x + 15, (center_y + mpC2C3_y)-8);
    ctx.stroke();
}

function centerBSA(a,b,c,d,e,f,g){
    centerValue = a;
    circle1Value = b;
    circle2Value = c;
    circle3Value = d;
    circle4Value = e; 
    circle5Value = f;
    circle6Value = g;

    for(let i = 1; i <= 6; i++) {
        if(centerValue == "BSA"){

            switch(i) {
                case 1:
                    if(circle1Value == "Anti-BSA"){
                        if(circle2Value == "Anti-BSA" || circle2Value == "Anti-HSA"){
                            circle1Curve1();
                            circle2Curve1();
                        }
                        else if((circle2Value == "BSA" || circle2Value == "HSA" || circle2Value == "Anti-HSA + BSA")&&(circle6Value == "BSA" || circle6Value == "HSA" || circle6Value == "Anti-HSA + BSA")){
                            circle1StraightLine();
                        }
                    }
                    else if(circle1Value == "Anti-HSA"){
                        if(circle2Value == "Anti-BSA" || circle2Value == "Anti-HSA"){
                            circle1Curve1();
                            circle2Curve1();
                        }
                    }
                    continue;
                case 2:
                    if(circle2Value == "Anti-BSA"){
                        if(circle3Value == "Anti-BSA" || circle3Value == "Anti-HSA"){
                            circle3Curve1();
                            circle2Curve2();
                        }
                        else if((circle3Value == "BSA" || circle3Value == "HSA" || circle3Value == "Anti-HSA + BSA")&&(circle1Value == "BSA" || circle1Value == "HSA" || circle1Value == "Anti-HSA + BSA")){
                            circle2StraightLine();
                        }
                    }
                    else if(circle2Value == "Anti-HSA"){
                        if(circle3Value == "Anti-BSA" || circle3Value == "Anti-HSA"){
                            circle3Curve1();
                            circle2Curve2();
                        }
                    }
                    continue;
                case 3:
                    if(circle3Value == "Anti-BSA"){
                        if(circle4Value == "Anti-BSA" || circle4Value == "Anti-HSA"){
                            circle4Curve1();
                            circle3Curve2();
                        }
                        else if((circle4Value == "BSA" || circle4Value == "HSA" || circle4Value == "Anti-HSA + BSA")&&(circle2Value == "BSA" || circle2Value == "HSA" || circle2Value == "Anti-HSA + BSA")){
                            circle3StraightLine();
                        }
                    }
                    else if(circle3Value == "Anti-HSA"){
                        if(circle4Value == "Anti-BSA" || circle4Value == "Anti-HSA"){
                            circle4Curve1();
                            circle3Curve2();
                        }
                    }
                    continue;
                case 4:
                    if(circle4Value == "Anti-BSA"){
                        if(circle5Value == "Anti-BSA" || circle5Value == "Anti-HSA"){
                            circle5Curve1();
                            circle4Curve2();
                        }
                        else if((circle5Value == "BSA" || circle5Value == "HSA" || circle5Value == "Anti-HSA + BSA")&&(circle3Value == "BSA" || circle3Value == "HSA" || circle3Value == "Anti-HSA + BSA")){
                            circle4StraightLine();
                        }
                    }
                    else if(circle4Value == "Anti-HSA"){
                        if(circle5Value == "Anti-BSA" || circle5Value == "Anti-HSA"){
                            circle5Curve1();
                            circle4Curve2();
                        }
                    }
                    continue;
                case 5:
                    if(circle5Value == "Anti-BSA"){
                        if(circle6Value == "Anti-BSA" || circle6Value == "Anti-HSA"){
                            circle5Curve2();
                            circle6Curve2();
                        }
                        else if((circle6Value == "BSA" || circle6Value == "HSA" || circle6Value == "Anti-HSA + BSA")&&(circle4Value == "BSA" || circle4Value == "HSA" || circle4Value == "Anti-HSA + BSA")){
                            circle5StraightLine();
                        }
                    }
                    else if(circle5Value == "Anti-HSA"){
                        if(circle6Value == "Anti-BSA" || circle6Value == "Anti-HSA"){
                            circle5Curve2();
                            circle6Curve2();
                        }
                    }
                    continue;
                case 6:
                    if(circle6Value == "Anti-BSA"){
                        if(circle1Value == "Anti-BSA" || circle1Value == "Anti-HSA"){
                            circle6Curve1();
                            circle1Curve2();
                        }
                        else if((circle1Value == "BSA" || circle1Value == "HSA" || circle1Value == "Anti-HSA + BSA")&&(circle5Value == "BSA" || circle5Value == "HSA" || circle5Value == "Anti-HSA + BSA")){
                            circle6StraightLine();
                        }
                    }
                    else if(circle6Value == "Anti-HSA"){
                        if(circle1Value == "Anti-BSA" || circle1Value == "Anti-HSA"){
                            circle6Curve1();
                            circle1Curve2();
                        }
                    }
                    continue;
            }
        }
    
    }
}

function centerHSA(a,b,c,d,e,f,g){
    centerValue = a;
    circle1Value = b;
    circle2Value = c;
    circle3Value = d;
    circle4Value = e; 
    circle5Value = f;
    circle6Value = g;

    for(let i = 1; i <= 6; i++) {
        if(centerValue == "HSA"){

            switch(i) {
                case 1:
                    if(circle1Value == "Anti-BSA"){
                        if(circle2Value == "Anti-BSA" || circle2Value == "Anti-HSA" || circle2Value == "Anti-HSA + BSA"){
                            circle1Curve1();
                            circle2Curve1();
                        }
                    }
                    else if(circle1Value == "Anti-HSA"){
                        if(circle2Value == "Anti-BSA" || circle2Value == "Anti-HSA" || circle2Value == "Anti-HSA + BSA"){
                            circle1Curve1();
                            circle2Curve1();
                        }
                        else if((circle2Value == "BSA" || circle2Value == "HSA")&&(circle6Value == "BSA" || circle6Value == "HSA")){
                            circle1StraightLine();
                        }
                    }
                    else if(circle1Value == "Anti-HSA + BSA"){
                        if(circle2Value == "Anti-BSA" || circle2Value == "Anti-HSA" || circle2Value == "Anti-HSA + BSA"){
                            circle1Curve1();
                            circle2Curve1();
                        }
                        else if((circle2Value == "BSA" || circle2Value == "HSA")&&(circle6Value == "BSA" || circle6Value == "HSA")){
                            circle1StraightLine();
                        }
                    }
                    continue;
                case 2:
                    if(circle2Value == "Anti-BSA"){
                        if(circle3Value == "Anti-BSA" || circle3Value == "Anti-HSA" || circle3Value == "Anti-HSA + BSA"){
                            circle3Curve1();
                            circle2Curve2();
                        }
                    }
                    else if(circle2Value == "Anti-HSA"){
                        if(circle3Value == "Anti-BSA" || circle3Value == "Anti-HSA" || circle3Value == "Anti-HSA + BSA"){
                            circle3Curve1();
                            circle2Curve2();
                        }
                        else if((circle3Value == "BSA" || circle3Value == "HSA")&&(circle1Value == "BSA" || circle1Value == "HSA")){
                            circle2StraightLine();
                        }
                    }
                    else if(circle2Value == "Anti-HSA + BSA"){
                        if(circle3Value == "Anti-BSA" || circle3Value == "Anti-HSA" || circle3Value == "Anti-HSA + BSA"){
                            circle3Curve1();
                            circle2Curve2();
                        }
                        else if((circle3Value == "BSA" || circle3Value == "HSA")&&(circle1Value == "BSA" || circle1Value == "HSA")){
                            circle2StraightLine();
                        }
                    }
                    continue;
                case 3:
                    if(circle3Value == "Anti-BSA"){
                        if(circle4Value == "Anti-BSA" || circle4Value == "Anti-HSA" || circle4Value == "Anti-HSA + BSA"){
                            circle3Curve2();
                            circle4Curve1();  
                        }
                    }
                    else if(circle3Value == "Anti-HSA"){
                        if(circle4Value == "Anti-BSA" || circle4Value == "Anti-HSA" || circle4Value == "Anti-HSA + BSA"){
                            circle3Curve2();
                            circle4Curve1();
                        }
                        else if((circle4Value == "BSA" || circle4Value == "HSA")&&(circle2Value == "BSA" || circle2Value == "HSA")){
                            circle3StraightLine();
                        }
                    }
                    else if(circle3Value == "Anti-HSA + BSA"){
                        if(circle4Value == "Anti-BSA" || circle4Value == "Anti-HSA" || circle4Value == "Anti-HSA + BSA"){
                            circle3Curve2();
                            circle4Curve1();
                        }
                        else if((circle4Value == "BSA" || circle4Value == "HSA")&&(circle2Value == "BSA" || circle2Value == "HSA")){
                            circle3StraightLine();
                        }
                    }
                    continue;
                case 4:
                    if(circle4Value == "Anti-BSA"){
                        if(circle5Value == "Anti-BSA" || circle5Value == "Anti-HSA" || circle5Value == "Anti-HSA + BSA"){
                            circle4Curve2();
                            circle5Curve1();
                        }
                    }
                    else if(circle4Value == "Anti-HSA"){
                        if(circle5Value == "Anti-BSA" || circle5Value == "Anti-HSA" || circle5Value == "Anti-HSA + BSA"){
                            circle4Curve2();
                            circle5Curve1();
                        }
                        else if((circle5Value == "BSA" || circle5Value == "HSA")&&(circle3Value == "BSA" || circle3Value == "HSA")){
                            circle4StraightLine();
                        }
                    }
                    else if(circle4Value == "Anti-HSA + BSA"){
                        if(circle5Value == "Anti-BSA" || circle5Value == "Anti-HSA" || circle5Value == "Anti-HSA + BSA"){
                            circle4Curve2();
                            circle5Curve1();
                        }
                        else if((circle5Value == "BSA" || circle5Value == "HSA")&&(circle3Value == "BSA" || circle3Value == "HSA")){
                            circle4StraightLine();
                        }
                    }
                    continue;
                case 5:
                    if(circle5Value == "Anti-BSA"){
                        if(circle6Value == "Anti-BSA" || circle6Value == "Anti-HSA" || circle6Value == "Anti-HSA + BSA"){
                            circle5Curve2();
                            circle6Curve2();
                        }
                    }
                    else if(circle5Value == "Anti-HSA"){
                        if(circle6Value == "Anti-BSA" || circle6Value == "Anti-HSA" || circle6Value == "Anti-HSA + BSA"){
                            circle5Curve2();
                            circle6Curve2();
                        }
                        else if((circle6Value == "BSA" || circle6Value == "HSA")&&(circle4Value == "BSA" || circle4Value == "HSA")){
                            circle5StraightLine();
                        }
                    }
                    else if(circle5Value == "Anti-HSA + BSA"){
                        if(circle6Value == "Anti-BSA" || circle6Value == "Anti-HSA" || circle6Value == "Anti-HSA + BSA"){
                            circle5Curve2();
                            circle6Curve2();
                        }
                        else if((circle6Value == "BSA" || circle6Value == "HSA")&&(circle4Value == "BSA" || circle4Value == "HSA")){
                            circle5StraightLine();
                        }
                    }
                    continue;
                case 6:
                    if(circle6Value == "Anti-BSA"){
                        if(circle1Value == "Anti-BSA" || circle1Value == "Anti-HSA" || circle1Value == "Anti-HSA + BSA"){
                            circle6Curve1();
                            circle1Curve2();
                        }
                    }
                    else if(circle6Value == "Anti-HSA"){
                        if(circle1Value == "Anti-BSA" || circle1Value == "Anti-HSA" || circle1Value == "Anti-HSA + BSA"){
                            circle6Curve1();
                            circle1Curve2();
                        }
                        else if((circle1Value == "BSA" || circle1Value == "HSA")&&(circle5Value == "BSA" || circle5Value == "HSA")){
                            circle6StraightLine();
                        }
                    }
                    else if(circle6Value == "Anti-HSA + BSA"){
                        if(circle1Value == "Anti-BSA" || circle1Value == "Anti-HSA" || circle1Value == "Anti-HSA + BSA"){
                            circle6Curve1();
                            circle1Curve2();
                        }
                        else if((circle1Value == "BSA" || circle1Value == "HSA")&&(circle5Value == "BSA" || circle5Value == "HSA")){
                            circle6StraightLine();
                        }
                    }
                    continue;
            }
        }
    
    }
}

function drawLines(){
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    canvas.height = 600;
    canvas.width = 600;

    //Get values in circle 
    const centerValue = document.getElementById('centerText').innerHTML;
    const circle1Value = document.getElementById('circle1Text').innerHTML;
    const circle2Value = document.getElementById('circle2Text').innerHTML;
    const circle3Value = document.getElementById('circle3Text').innerHTML;
    const circle4Value = document.getElementById('circle4Text').innerHTML;
    const circle5Value = document.getElementById('circle5Text').innerHTML;
    const circle6Value = document.getElementById('circle6Text').innerHTML;

    centerBSA(centerValue,circle1Value,circle2Value,circle3Value,circle4Value,circle5Value,circle6Value);
    centerHSA(centerValue,circle1Value,circle2Value,circle3Value,circle4Value,circle5Value,circle6Value);
}
    

//Result Button 
const resultBtn = document.getElementById("results-btn");
resultBtn.addEventListener("click", (e) => handleResultButtonClick(e));

function handleResultButtonClick(e) {
    drawLines();
}

//Line











    