const canvas = document.getElementById('spaceCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

const spaceshipSize = 30;
const hexagonRadius = 30;
const hexagonColor = 'rgba(255, 255, 255, 1)';
const hexagonBorderColor = 'rgba(0, 0, 0, 1)';
const selectedHexagonColor = 'rgba(0, 255, 0, 0.5)';
const spaceshipImageSrc = 'SpaceShuttle1.png';
const hexagonSize = 3;

const spaceships = [
  { x: 30, y: 30, team: 1, angle: 0 },  //eigentlich 50 50
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

function Array2D(x, y) {
  let arr = Array(x);
  for (let i = 0; i < x; i++) {
    arr[i] = Array(y);
  }
  return arr;
}

let width = 1
let height = 1

function calculateMaxBoundsdidauns() {
  for (let x = hexagonRadius; x < canvas.width; x += hexagonRadius * 1.5) {    //es war wegen der 3 es muss 1.5 sein weil sonst ist es nur die hälfte vom Canvas jk. Musst schon zugeben dass ich geil bin
    width++;                                                                    //btw ChatGPT hat mir 3 mal genau den selben Code geschickt und nix verändert.... Useless af
    for (let y = hexagonRadius; y < canvas.height; y += (hexagonRadius * Math.sqrt(3))) {
      height++;
    }
  }
}
calculateMaxBoundsdidauns()

function calculateAllHexagons() {
  const allHexagons = Array2D(width, height);
  const all1d = []
  for (let ix = 0; ix < width; ix += 2) {
    let x = hexagonRadius + hexagonRadius * hexagonSize * ix / 2
    for (let iy = 0; iy < height; iy++) {
      let y = hexagonRadius + (hexagonRadius * Math.sqrt(hexagonSize)) * iy
      let hexagon = { x, y, color: hexagonColor };
      allHexagons[ix][iy] = hexagon;
      all1d.push(hexagon)
    }
  }
  for (let ix = 1; ix < width; ix += 2) {
    const x = hexagonRadius + hexagonRadius * hexagonSize / 2 + hexagonRadius * hexagonSize * (ix - 1) / 2
    for (let iy = 0; iy < height; iy++) {
      const y = hexagonRadius + hexagonRadius * Math.sqrt(hexagonSize) / 2 + hexagonRadius * Math.sqrt(hexagonSize) * iy
      const hexagon = { x, y, color: hexagonColor };
      allHexagons[ix][iy] = hexagon;
      all1d.push(hexagon)
    }
  }


  function getSpaceShipIndex() {
    for (let ix = 0; ix < allHexagons.length; ix++) {
      const arr1 = allHexagons[ix];
      for (let iy = 0; iy < arr1.length; iy++) {
        const spaceship = arr1[iy];
        if (spaceship.x === selectedSpaceship.x && spaceship.y === selectedSpaceship.y) {
          return { ix, iy };
        }
      }
    }
  }

  function setHexagonColor(x, y, color) {
    try {
      allHexagons[x][y].color = color
    } catch (error) {

    }
  }

  const pos = getSpaceShipIndex();
  const x = pos.ix;
  const y = pos.iy;
  setHexagonColor(x, y, "lightgreen")
  setHexagonColor(x, y + 1, "yellow")
  setHexagonColor(x, y + 2, "yellow")
  setHexagonColor(x, y - 1, "yellow")
  setHexagonColor(x, y - 2, "yellow")
  if (x % 2 === 0) {
    setHexagonColor(x + 1, y, "yellow")
    setHexagonColor(x + 1, y + 1, "yellow")
    setHexagonColor(x + 1, y - 1, "yellow")
    setHexagonColor(x + 1, y - 2, "yellow")
    setHexagonColor(x - 1, y, "yellow")
    setHexagonColor(x - 1, y + 1, "yellow")
    setHexagonColor(x - 1, y - 1, "yellow")
    setHexagonColor(x - 1, y - 2, "yellow")
  } else {
    setHexagonColor(x + 1, y, "yellow")
    setHexagonColor(x + 1, y + 1, "yellow")
    setHexagonColor(x + 1, y + 2, "yellow")
    setHexagonColor(x + 1, y - 1, "yellow")
    setHexagonColor(x - 1, y, "yellow")
    setHexagonColor(x - 1, y + 1, "yellow")
    setHexagonColor(x - 1, y + 2, "yellow")
    setHexagonColor(x - 1, y - 1, "yellow")
  }
  setHexagonColor(x + 2, y, "yellow")
  setHexagonColor(x + 2, y + 1, "yellow")
  setHexagonColor(x + 2, y - 1, "yellow")
  setHexagonColor(x - 2, y, "yellow")
  setHexagonColor(x - 2, y + 1, "yellow")
  setHexagonColor(x - 2, y - 1, "yellow")

  return all1d;
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
    if (clickedHexagon && clickedHexagon.color == "yellow") {
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
    if (mousePos.x >= spaceship.x - (spaceshipSize / 2) && mousePos.x <= spaceship.x + (spaceshipSize / 2) && mousePos.y >= spaceship.y - (spaceshipSize / 2) && mousePos.y <= spaceship.y + (spaceshipSize / 2)) {
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