const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

const spaceshipSize = 30;
const hexagonRadius = 50;
const hexagonColor = 'rgba(255, 255, 255, 1)';
const hexagonBorderColor = 'rgba(0, 0, 0, 1)';
const selectedHexagonColor = 'rgba(0, 255, 0, 0.5)';
const spaceshipImageSrc = 'SpaceShuttle1.png';

const spaceships = [
  { x: 50, y: 50, team: 1, angle: 0 },
  { x: 200, y: 50, team: 1, angle: 0 },
  { x: 275, y: 100, team: 1, angle: 0 },
  { x: 350, y: 50, team: 2, angle: 0 },
  { x: 425, y: 100, team: 2, angle: 0 },
  { x: 125, y: 100, team: 2, angle: 0 },
];

const asteroids = [
  { x: 400, y: 400 },
  // Add more asteroids as needed
];

const spaceshipImage = new Image();

spaceshipImage.onload = function () {
  draw();
};

spaceshipImage.src = spaceshipImageSrc;

let selectedSpaceship = null;
let hexagonOverlayVisible = false;

function drawSpaceship(x, y, team, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.drawImage(spaceshipImage, -spaceshipSize / 2, -spaceshipSize / 2, spaceshipSize, spaceshipSize);
  ctx.restore();
}

function drawAsteroid(x, y) {
  ctx.fillStyle = 'gray';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
}

function drawHexagon(x, y, borderColor, fillColor) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const hexagonX = x + hexagonRadius * Math.cos(angle);
    const hexagonY = y + hexagonRadius * Math.sin(angle);
    ctx.lineTo(hexagonX, hexagonY);
  }
  ctx.closePath();
  ctx.fill();

  // Draw border
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawHexagonOverlay() {
  const allHexagons = calculateAllHexagons();
  allHexagons.forEach(hexagon => drawHexagon(hexagon.x, hexagon.y, hexagonBorderColor, hexagon.color));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw asteroids
  asteroids.forEach(asteroid => drawAsteroid(asteroid.x, asteroid.y));

  if (hexagonOverlayVisible) {
    drawHexagonOverlay();
  }

  // Draw spaceships
  spaceships.forEach(spaceship => drawSpaceship(spaceship.x, spaceship.y, spaceship.team, spaceship.angle));
}

function getMousePos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function calculateAllHexagons() {
  const allHexagons = [];
  for (let x = hexagonRadius; x < canvas.width; x += hexagonRadius * 3) {
    for (let y = hexagonRadius; y < canvas.height; y += (hexagonRadius * Math.sqrt(3))) {
      allHexagons.push({ x, y, color: hexagonColor });
    }
  }
  for (let x = hexagonRadius + 75; x < canvas.width; x += hexagonRadius * 3) {
    for (let y = hexagonRadius + 50; y < canvas.height; y += (hexagonRadius * Math.sqrt(3))) {
      allHexagons.push({ x, y, color: hexagonColor});
    }
  }
  function setHexagonColorAt(x,y,color){  //Paul ist geil
    try{
      const hexagon = allHexagons.find(e => e.x === x && e.y === y)       //find hexagon space ship is on and sets colour
      hexagon.color = color
    }catch{
      //Paul wurde gefangen
    }
  }

  //find hexagon of spaceship
  const x = selectedSpaceship.x
  const y = selectedSpaceship.y
  setHexagonColorAt(x,y,"lightgreen")
  setHexagonColorAt(x,y+(hexagonRadius * Math.sqrt(3)),"yellow")
  setHexagonColorAt(x,y+((hexagonRadius * Math.sqrt(3))*2),"yellow")
  setHexagonColorAt(x,y-(hexagonRadius * Math.sqrt(3)),"yellow")
  setHexagonColorAt(x,y-((hexagonRadius * Math.sqrt(3))*2),"yellow")
  


  

  return allHexagons;
}

function findHexagonUnderMouse(mousePos) {
  const hexagons = calculateAllHexagons();
  for (const hexagon of hexagons) {
    const distance =
      Math.sqrt(Math.pow(mousePos.x - hexagon.x, 2) + Math.pow(mousePos.y - hexagon.y, 2));
    if (distance <= hexagonRadius) {
      return hexagon;
    }
  }
  return null;
}

canvas.addEventListener('mousedown', function (event) {
  const mousePos = getMousePos(canvas, event);

  // Check if clicked inside a hexagon
  if (hexagonOverlayVisible) {
    const clickedHexagon = findHexagonUnderMouse(mousePos);
    if (clickedHexagon) {
      selectedSpaceship.x = clickedHexagon.x;
      selectedSpaceship.y = clickedHexagon.y;
      hexagonOverlayVisible = false;
      console.log("invisible")
      draw();
      return
    }
  }

  // Check if clicked on a spaceship
  spaceships.forEach(spaceship => {
    if (mousePos.x >= spaceship.x - (spaceshipSize/2) && mousePos.x <= spaceship.x + (spaceshipSize/2) && mousePos.y >= spaceship.y - (spaceshipSize/2) && mousePos.y <= spaceship.y + (spaceshipSize/2)) {
      if (selectedSpaceship === spaceship) {
        hexagonOverlayVisible = !hexagonOverlayVisible;
      } else {
        selectedSpaceship = spaceship;
        hexagonOverlayVisible = true;
        console.log("visible")
      }
    }
  });


  draw();
});

canvas.addEventListener('mousemove', function (event) {
  draw();
});

// Initial draw
draw();