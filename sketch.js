let myX, myY;
let grid = [];
let words = [
  "For", "example", "eye", "tracking", "technology", "captures",
  "subtle,", "unconscious", "movements", "to", "provide", "meaningful",
  "insights", "into", "user", "attention", "and", "interest"
];
let currentWord = 0;
let clickCount = [];
let sceneNum = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textFont("Comfortaa");
  textAlign(CENTER, CENTER);
  textSize(32);
  
  // Initialize the click count for each word
  for (let i = 0; i < words.length; i++) {
    clickCount.push(0);
  }
  
  // Create the 3x6 grid for word placement
  let gridRows = 3;
  let gridCols = 6;
  let gridWidth = width / gridCols;
  let gridHeight = height / gridRows;
  
  // Create grid coordinates
  for (let i = 0; i < gridRows; i++) {
    for (let j = 0; j < gridCols; j++) {
      grid.push(createVector(j * gridWidth + gridWidth / 2, i * gridHeight + gridHeight / 2));
    }
  }
  
  // Initialize WebGazer
  webgazer.setRegression('ridge').setTracker('clmtrackr').showPredictionPoints(true)
    .showVideo(false)  // Hides the camera video feed
    .setGazeListener(function(data, elapsedTime) {
      if (data == null) return;
      myX = data.x;
      myY = data.y;
    }).begin();
}

function draw() {
  switch(sceneNum) {
    case 0:
      background(0);
      let pos = grid[currentWord];
      fill(255);
      text(words[currentWord], pos.x, pos.y);

      // Display instructions
      fill(0, 255, 0);
      textSize(16);
      text("Look at the word and click on it 4 times to calibrate.", width / 2, height - 50);
      break;

    case 1:
      background(0);
      noCursor();
      text("Even when the user is not consciously aware of how their gaze is being analyzed.", myX, myY);
      break;
  }
}

function mousePressed() {
  if (sceneNum === 0) {
    let pos = grid[currentWord];
    // Check if gaze is close enough to the current word
    if (myX && myY && dist(myX, myY, pos.x, pos.y) < 80) {
      clickCount[currentWord]++; // Increment click count for the word
      console.log(`Clicked on word: ${words[currentWord]}, Click count: ${clickCount[currentWord]}`);

      // If the word has been clicked 4 times, move to the next word
      if (clickCount[currentWord] >= 4) {
        currentWord++;
        if (currentWord >= words.length) {
          // Calibration complete
          console.log("Calibration complete!");
          sceneNum = 1; // Move to the next scene
        }
      }
    }
  }
}
