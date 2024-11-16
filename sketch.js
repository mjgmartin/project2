let table;
let orbs = [];
let focusedOrb = null;  // Store the clicked orb for focus display

function preload() {
  table = loadTable("global_inflation_data.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  loadData();
}

function draw() {
  background(220);

  // Show all DataBalls
  for (let orb of orbs) {
    orb.show();
    orb.checkHover(mouseX, mouseY);
  }

  // Display tooltip if hovering over a DataBall
  displayTooltip();

  // If an orb is focused, show detailed information at a fixed position
  if (focusedOrb) {
    displayFocusedOrb();
  }
}

function mousePressed() {
  focusedOrb = null;  // Reset focus on each click

  // Check if any orb is clicked to focus on it
  for (let orb of orbs) {
    if (orb.isHovered) {
      focusedOrb = orb;
      break;
    }
  }
}

function keyPressed() {
  if (key === 'S') {  // Sort by inflation rate
    sortOrbsByInflation();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function loadData() {
  for (let r = 0; r < table.getRowCount(); r++) {
    let name = table.getString(r, "country_name");
    let data2024 = parseFloat(table.getString(r, "2024"));

    if (!isNaN(data2024)) {  // Validate data2024 is a number
      let x = random(width);
      let y = random(height);
      let size = constrain(data2024 * 2, 10, 80);  // Adjust size for visibility
      let colorValue = map(data2024, 0, 20, 0, 255); // Map inflation to color

      let db = new DataBall(x, y, size, name, data2024, colorValue);
      orbs.push(db);
    }
  }
}

function sortOrbsByInflation() {
  // Sort orbs by inflation rate and set new positions in a line
  orbs.sort((a, b) => a.data - b.data);
  
  let spacing = width / (orbs.length + 1);
  for (let i = 0; i < orbs.length; i++) {
    orbs[i].x = (i + 1) * spacing;
    orbs[i].y = height / 2;
  }
}

class DataBall {
  constructor(x, y, size, name, data, colorValue) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.name = name;
    this.data = data;
    this.colorValue = colorValue;
    this.isHovered = false;
  }

  show() {
    // Set color based on inflation rate
    noStroke();
    fill(this.colorValue, 100, 255 - this.colorValue, 180);
    circle(this.x, this.y, this.size);

    // If hovered, show country name on the circle
    if (this.isHovered) {
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(12);
      text(this.name, this.x, this.y);
    }
  }

  checkHover(px, py) {
    let d = dist(px, py, this.x, this.y);
    this.isHovered = d < this.size / 2;

    if (this.isHovered) {
      // Store the current DataBall info for the tooltip
      tooltipData = { name: this.name, data: this.data, x: px, y: py };
    }
  }
}

// Global variable to store tooltip data
let tooltipData = null;

function displayTooltip() {
  if (tooltipData) {
    fill(50, 50, 50, 200);
    noStroke();
    rect(tooltipData.x + 10, tooltipData.y, 100, 40, 5);
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(12);
    text(`Country: ${tooltipData.name}`, tooltipData.x + 15, tooltipData.y + 12);
    text(`Inflation: ${tooltipData.data}%`, tooltipData.x + 15, tooltipData.y + 27);
  }

  tooltipData = null;  // Reset after displaying
}

function displayFocusedOrb() {
  // Display the focused DataBall information at the bottom of the canvas
  fill(50, 50, 50, 200);
  rect(20, height - 60, 200, 40, 5);
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(14);
  text(`Country: ${focusedOrb.name}`, 30, height - 48);
  text(`Inflation: ${focusedOrb.data}%`, 30, height - 32);
}