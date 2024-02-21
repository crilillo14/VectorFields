

let Field;
let gapBetweenRows;
let gapBetweenCols;
let counter = 0; // unused

//display settings
let zoomfactor = 0.5
const n = 30;
let adjustedn;
let simwidth, simlength;

// main loop settings
let vectorScaling = 1; // speed buff multiplier
let trailLength = 20; // max length of particle trail
let deathThresholdSpeed = 5; // length at which the particle dies; going too slow
let maxSpeed = 1; // max speed
let resetchance = 0.01; // chance that a particle dies at any given frame
let decayingThreshold = 0.05;


//sliders
let zoomslider, translationX = 0, translationY = 0;









function setup() {

  createCanvas(windowWidth, windowHeight);

  angleMode(DEGREES)

  //zoomslider = createSlider(0.5 , 2, 1, 0)
  //zoomslider.position(20, 20)

    // Create a label for the slider
    textFont('monospace')
    zoomLabel = createElement('label', 'ZOOM');
    zoomLabel.position(20, 20);
    zoomLabel.style('color', '#fff'); // Change the color to white

  
    // Create the slider
    zoomslider = createSlider(0.5 , 2, 1, 0);
    zoomslider.position(20, 50); // Position it below the label
}








function draw() {
  let translated = false;


  if(zoomfactor!= zoomslider.value() || translated) {
    background(0,25,200, 255)
    zoomfactor = zoomslider.value()
    adjustedn = n / zoomfactor
    Field = generateField(adjustedn, adjustedn);

  }

  zoomLabel.html('ZOOM: x' + zoomfactor.toFixed(2));


  scale(1, -1);
  translate(width / 2, -height / 2 );

  colorMode(RGB)
  background(0, 25, 200, 5);
  drawGrid()



  noStroke()

  //visualizeVelocityField(Field)
  gameLoop(Field)

} // ---------------------------------------------------- end of draw()








function gameLoop(Field) {

  for (i = 0; i < Field.length; i++) {          // MAIN LOOP, UPDATES VELOCITIES AND POSITIONS
    for (j = 0; j < Field[i].length; j++) {
  
      let positionVector = Field[i][j][Field[i][j].length - 1]; // get the last position vector
      let newposition = positionVector.copy();
      let velocityVector = CalculateVelocity(newposition);
      newposition = newposition.add(velocityVector); // add velocity to position
      Field[i][j].push(newposition); // push the new position
  
      for(k = 0; k < Field[i][j].length; k++){  
        circle(Field[i][j][k].x , Field[i][j][k].y , 1); // show position
      }
  
      if(Field[i][j].length > trailLength) {
        Field[i][j].splice(0, 1)
      }
  
      if(velocityVector.mag() < decayingThreshold) { // if the particle is moving too slow, take away from the front
        Field[i][j].splice(Field[i][j].length - 1, 1)
        if(velocityVector.mag() < deathThresholdSpeed) { // if it's gotten too slow, rebirth
          Field[i][j] = getInitialFieldPosition(i , j);
        }
      }
  
      if(random(0, 1) < resetchance) { // particle dies with p = resetchance
        Field[i][j] = getInitialFieldPosition(i , j);
  
      }
  
  
    }
  }
}







function drawGrid() {
  let stepx = width / adjustedn
  let stepy = height / adjustedn
  let len = 2
  noStroke()
  fill(255)
  circle(0 , 0, 5)
  stroke(255)
  line(-width / 2 , 0 , width / 2, 0 )
  line(0 , -height / 2 , 0 , height / 2)
  for(i = 1; i < adjustedn / 2; i++) {
    if(i % 5 == 0) {
      line((stepx * i), len * 5 , stepx * i  , -len * 5)
      line(-(stepx * i), len * 5 ,-stepx * i  , -len * 5)
      line(len * 5, (stepy * i) , -len * 5 , stepy * i )
      line(len * 5, -(stepy * i) , -len * 5 , -stepy * i )
    } else {
      line((stepx * i) , len , stepx * i , -len)
      line(-(stepx * i), len , -stepx * i , -len)
      line(len, -(stepy * i), -len, -stepy * i)
      line(len, (stepy * i) , -len, (stepy * i))
    }
  }
}








function CalculateVelocity(p) {
  let x = -p.y + 0.5*p.x
  let y = p.x
  let velocity = createVector(x,y)
  velocity.mult(-vectorScaling)
  velocity.setMag(min(velocity.mag() , maxSpeed))

  angleMode(RADIANS)
  // Calculate the color based on the vector's direction
  let hue = (velocity.heading() + PI) / (2 * PI) * 255;
  let saturation = 255;
  let brightness = velocity.mag()  * 255;
  angleMode(DEGREES)
  // Set the color mode to HSB and the stroke color to the calculated color
  colorMode(HSB);
  //stroke(hue, saturation, brightness, 255);
  fill(hue, saturation, brightness, 255); // Set the fill color to the same color as the stroke

  colorMode(RGB)
  return velocity;

} //---------------------------------------------- end of vectorFunction()











// Field Generation and getting initial positions


function generateField(nrows, ncols , translationX , translationY) {
  let field = [];
  
  gapBetweenRows = (width / nrows) ;
  gapBetweenCols = (height / ncols) ;
  
  for (let i = 0; i <= nrows; i++) {
    let ColumnVector = [];
    
    for (let j = 0; j <= ncols; j++) {
      let x = (i * gapBetweenRows) - (width / 2) + translationX;
      let y = -((j * gapBetweenCols) - (height / 2) + translationY) ;
      
      ColumnVector.push([createVector(x, y)]);
    }
    
    field.push(ColumnVector);
  }

  return field;
} // --------------------------------------------- end of generateField()


function getInitialFieldPosition(i, j) {
  let x = (i * gapBetweenRows) - width / 2 + translationX;
  let y = -1*((j * gapBetweenCols) - height / 2) + translationY;
  return [createVector(x , y)]
}






















// INITIAL OBJECTIVE OF THE PROJECT, RAW VISUALIZATION OF A STATIC VELOCITY FIELD GIVEN SOME FUNCTION OF ITS POSITION

function visualizeVelocityField(Field) {
  for (let column of Field) {
    for (let positionVector of column) {

      velocityVector = CalculateVelocity(positionVector)
      drawArrow(positionVector, velocityVector, 'red' )
      
    }
  }
}


function drawArrow(base, vec, myColor) {
  push(); // Start a new drawing state
  
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  
  translate(base.x + vec.x, base.y + vec.y); // Move to the end of the vector
  angleMode(RADIANS)
  let angle = atan2(vec.y, vec.x);
  rotate(angle); // Rotate the arrow to point in the direction of the vector
  
  let arrowSize = vec.mag() * 4; // Make the arrow size proportional to the vector's magnitude
  
  // Draw an arrow head
  triangle(0, arrowSize / 5, 0, -arrowSize / 5, arrowSize , 0);
  
  pop(); // Restore original state
}
