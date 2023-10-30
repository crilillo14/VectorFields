let Field;
let vectorScaling = 1;
let gapBetweenRows;
let gapBetweenCols;
let counter = 0;
let sliderx , slidery;


function setup() {
  createCanvas((7 * windowWidth) / 8, (7 * windowHeight) / 8);  
}

function draw() {
  counter++;


  translate(width / 2, height / 2);
  scale(1, -1);
  noStroke();
  background(0, 0, 30);
  circle(0, 0, 5);
  stroke(255);
  Field = generateField(20, 20);
  
  for (let column of Field) {
    for (let positionVector of column) {

      velocityVector = VectorFunction(positionVector).mult(vectorScaling)
      drawArrow(positionVector, velocityVector, 'blue' )
      
    }
  }


}

function VectorFunction(positionVector) {
  let x = sin(positionVector.y % (2* PI))
  let y = cos(positionVector.y % (2 * PI))
  return createVector(x , y)
}



function generateField(nrows, ncols) {
  let field = [];
  
  gapBetweenRows = width / nrows;
  gapBetweenCols = height / ncols;
  
  for (let i = 0; i <= nrows; i++) {
    let ColumnVector = [];
    
    for (let j = 0; j <= ncols; j++) {
      let x = (i * gapBetweenRows) - width / 2;
      let y = -1*((j * gapBetweenCols) - height / 2 );
      
      ColumnVector.push(createVector(x, y));
    }
    
    field.push(ColumnVector);
  }

  return field;
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
