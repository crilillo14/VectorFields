let Field;
let vectorScaling = 50;
let gapBetweenRows;
let gapBetweenCols;
let counter = 0;
let sliderx , slidery;
let resetchance = 0.05;


function setup() {
  createCanvas((7 * windowWidth) / 8, (7 * windowHeight) / 8);
  Field = generateField(10, 10);



}

function draw() {
  background(0, 0, 30);
  counter++;

  translate(width / 2, height / 2);
  scale(1, -1);
  noStroke();

  circle(0, 0, 3);

  
  //visualizeVelocityField(Field)

  for (i = 0; i < Field.length; i++) {
  for (j = 0; j < Field[i].length; j++) {
    let positionVector = Field[i][j][Field[i][j].length - 1]; // get the last position vector
    let newposition = positionVector.copy();
    let velocityVector = Field
    newposition = newposition.add(VectorFunction(positionVector)); // add velocity to position
    Field[i][j].push(newposition); // push the new position

    for(k = 0; k < Field[i][j].length; k++){
      let alpha = 255 - 10*(Field[i][j].length - k);
      stroke(200 , 200, 200, alpha);
      circle(Field[i][j][k].x , Field[i][j][k].y , 2); // show position
    }

    if(random(0, 1) < resetchance) {
      Field[i][j] = getInitialFieldPosition(i , j);
    }
  }
}


}






function visualizeVelocityField(Field) {
  for (let column of Field) {
    for (let positionVector of column) {

      velocityVector = VectorFunction(positionVector).mult(vectorScaling)
      drawArrow(positionVector, velocityVector, 'blue' )
      
    }
  }
}





function VectorFunction(positionVector , velocityVector) {
  let x = vectorScaling*sin(positionVector.y % (2* PI))
  let y = vectorScaling*cos(positionVector.y % (2 * PI))
  //let x = vectorScaling*positionVector.x;
  //let y = vectorScaling*positionVector.y;
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
      
      ColumnVector.push([createVector(x, y)]);
    }
    
    field.push(ColumnVector);
  }

  return field;
}

function getInitialFieldPosition(i, j) {
  let x = (i * gapBetweenRows) - width / 2;
  let y = -1*((j * gapBetweenCols) - height / 2 );
  return [createVector(x , y)]
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
