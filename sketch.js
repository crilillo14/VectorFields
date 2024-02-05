

let Field;
let vectorScaling = .5;
let gapBetweenRows;
let gapBetweenCols;
let counter = 0;

let resetchance = 0.005;


function setup() {
  createCanvas((7 * windowWidth) / 8, (7 * windowHeight) / 8);
  Field = generateField(40, 40);
  



}

function draw() {
  background(40);

  translate(width / 2, height / 2);
  scale(1, -1);

  noStroke()
  circle(0, 0, 3);

  
  //visualizeVelocityField(Field)

  for (i = 0; i < Field.length; i++) {
  for (j = 0; j < Field[i].length; j++) {
    let positionVector = Field[i][j][Field[i][j].length - 1]; // get the last position vector
    let newposition = positionVector.copy();
    let velocityVector = VectorFunction(newposition);
    newposition = newposition.add(velocityVector); // add velocity to position
    Field[i][j].push(newposition); // push the new position



    for(k = 0; k < Field[i][j].length; k++){
      let alpha = 255 / (k + 1); // Add 1 to avoid division by zero
      p5.
      circle(Field[i][j][k].x , Field[i][j][k].y , 5); // show position
    }
    

    if(Field[i][j].length > 20) {
      Field[i][j].splice(0, 1)
    }

    if(velocityVector.mag() < 1) { // if the particle is moving too slow, take away from the front
      Field[i][j].splice(Field[i][j].length - 1, 1)
    }


    if(random(0, 1) < resetchance) {
      Field[i][j] = getInitialFieldPosition(i , j);
    }


  }
}

} // ---------------------------------------------------- end of draw()












function VectorFunction(positionVector , velocityVector) {
  let x = vectorScaling*log(abs(positionVector.x))
  let y = vectorScaling*log(abs(positionVector.y));
  let vector = createVector(x , y);
  
  // Calculate the color based on the vector's direction
  let hue = (vector.heading() + PI) / (2 * PI) * 255;
  let saturation = 255;
  let brightness = vector.mag() / vectorScaling * 255;
  
  // Set the color mode to HSB and the stroke color to the calculated color
  colorMode(HSB);
  //stroke(hue, saturation, brightness, 255);
  fill(hue, saturation, brightness, 255); // Set the fill color to the same color as the stroke
  
  return vector;
} //---------------------------------------------- end of vectorFunction()







function generateField(nrows, ncols) {
  let field = [];
  
  gapBetweenRows = width / nrows;
  gapBetweenCols = height / ncols;
  
  for (let i = 0; i <= nrows; i++) {
    let ColumnVector = [];
    
    for (let j = 0; j <= ncols; j++) {
      let x = (i * gapBetweenRows) - width / 2;
      let y = -1*((j * gapBetweenCols) - height / 2 );
      
      ColumnVector.push([createVector(x, y)]);
    }
    
    field.push(ColumnVector);
  }

  return field;
} // --------------------------------------------- end of generateField()



function getInitialFieldPosition(i, j) {
  let x = (i * gapBetweenRows) - width / 2;
  let y = -1*((j * gapBetweenCols) - height / 2);
  return [createVector(x , y)]
}













function visualizeVelocityField(Field) {
  for (let column of Field) {
    for (let positionVector of column) {

      velocityVector = VectorFunction(positionVector).mult(vectorScaling)
      drawArrow(positionVector, velocityVector, 'blue' )
      
    }
  }
}


function drawArrow(base, vec, myColor) {
  push(); // Start a new drawing state
  
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  
  translate(base.x + vec.x, base.y + vec.y); // Move to the end of the vector
  
  let angle = atan2(vec.y, vec.x);
  rotate(angle); // Rotate the arrow to point in the direction of the vector
  
  let arrowSize = vec.mag() * 4; // Make the arrow size proportional to the vector's magnitude
  
  // Draw an arrow head
  triangle(0, arrowSize / 5, 0, -arrowSize / 5, arrowSize , 0);
  
  pop(); // Restore original state
}
