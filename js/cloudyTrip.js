const canvas = document.getElementById("VL_canvas");
const ctx = canvas.getContext("2d");

const NUM_OF_IMG = 3;

let img = [];
for (let i = 0; i < NUM_OF_IMG; i++) {
    img[i] = new Image();
}
let mountain = new Image();
mountain.src = "../images/CloudyTrip/mountain_snowy.png";

//let img = [new Image(), new Image(), new Image()];
img[0].src = "../images/CloudyTrip/tree1.png";
img[1].src = "../images/CloudyTrip/tree2.png";
img[2].src = "../images/CloudyTrip/tree3.png";

let clouds = new Image();
clouds.src = "../images/CloudyTrip/cloud.png";

let currentFloor = {r: 0, g: 0, b: 0};

let c_w = canvas.width;

let x = 0;
let y = 100;

let floorStyle = "RGB(0,0,0)";

const NUM_OF_TREES = 3;

let x_i = [];

for (let i = 0; i < NUM_OF_TREES; i++) {
    x_i[i] = -c_w*i/NUM_OF_TREES - canvas.height/6;
}

let x_mnt = -canvas.height*0.7;

let x_cld = -canvas.height*0.2;

const linearInterpolationRGB = (r0, g0, b0, r1, g1, b1, tLength) => {
    
    //r0, g0, b0 Represents current RGB value
    //r1, g1, b1 Destination RGB value
    //tlength the total transition length

    
    
    let newRed;
    let newGreen;
    let newBlue;

    let array = [];
    
    for (let i=0; i <= tLength; i++){
    //RED
    newRed=r0+((i*(r1-r0))/tLength);
    //Green
    newGreen=g0+((i*(g1-g0))/tLength);
    //Blue
    newBlue=b0+((i*(b1-b0))/tLength);
    
    array[i] = {r: newRed, g: newGreen, b: newBlue};
    }

    return array;
}

let flags = {dayNight: false, rain: false, snow: false};

const setUpCanvas = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    let new_c_w = canvas.width;

    x_i[0] = x_i[0] * new_c_w / c_w;
    x_i[1] = x_i[1] * new_c_w / c_w;
    x_i[2] = x_i[2] * new_c_w / c_w;

    x_mnt = x_mnt * new_c_w / c_w;

    x_cld = x_cld * new_c_w / c_w;

    c_w = new_c_w;
};

const drawImages = (x_img) => {
    ctx.drawImage(mountain, x_mnt, canvas.height*0.4, canvas.height*0.7, canvas.height*0.7);

    ctx.drawImage(img[0], x_img[0], canvas.height*2/3, canvas.height/6, canvas.height/3);
    ctx.drawImage(img[1], x_img[1], canvas.height*2/3, canvas.height/6, canvas.height/3);
    ctx.drawImage(img[2], x_img[2], canvas.height*2/3, canvas.height/6, canvas.height/3);

    ctx.drawImage(clouds, x_cld, canvas.height*0.2, canvas.height*0.24, canvas.height*0.1);
};
const drawComponents = (r,g,b) => {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "RGB("+currentRGB.r+","+currentRGB.g+","+currentRGB.b+")";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawImages(x_i);

    ctx.fillStyle = "RGB("+currentFloor.r+","+currentFloor.g+","+currentFloor.b+")";
    ctx.fillRect(0, canvas.height*0.97, canvas.width, canvas.height*0.03);
    if (flags.snow) {
        drawSnowflakes();
    }
    if (flags.rain) {
        drawRain();
    }
};

setUpCanvas();
setInterval(() => {
    (x_i[0])+=5;
    (x_i[1])+=5;
    (x_i[2])+=5;
    x_mnt += 2;
    x_cld += 1;
    moveParticles();
    moveRain();

    for (let i = 0; i < 3; i++) {
        if (x_i[i] > canvas.width) {
            x_i[i] = x_i[(i+2)%3] - canvas.width*1/3 - canvas.height/6;
        }
    }
    if (x_mnt > canvas.width) {
        x_mnt = -canvas.height*0.7;
    }

    if (x_cld > canvas.width) {
        x_cld = -canvas.height*0.24;
    }

    drawComponents(currentRGB.r,currentRGB.g,currentRGB.b);
},50);

let currentRGB = {r: 135, g: 206, b:235};

window.addEventListener('resize', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw it all again.
    setUpCanvas();
    drawComponents(currentRGB.r, currentRGB.g, currentRGB.b);
});

let dayNightArray;
let dayNightInterval;

let i_currColor = 0;

const changeCurrentColor = () => {
    currentRGB = dayNightArray[i_currColor];
    i_currColor++;
    console.log(dayNightArray[i_currColor]);

    if (i_currColor == 29) {
        clearInterval(dayNightInterval);
        i_currColor = 0;
    }
};

const changeBackground = () => {
    if (flags.dayNight) {
        dayNightArray = linearInterpolationRGB(12, 20, 69, 135, 206, 235, 30);
    } else {
        dayNightArray = linearInterpolationRGB(135, 206, 235, 12, 20, 69, 30);
    }
    for (let i = 0; i < 30; i++) {
        //console.log(dayNightArray[i]);
    }
    flags.dayNight = !flags.dayNight;
    dayNightInterval = setInterval(changeCurrentColor, 50);
}

const dayNightButton = document.getElementById("nightDay");
dayNightButton.addEventListener("click", changeBackground);

let snowParticlesCount = 250;
let particlesArray = [];

const random = (min, max) => {
	return min + Math.random() * (max-min+1);
};

const createSnowflakes = () => {
	for (let i = 0; i < snowParticlesCount; i++) {
		particlesArray.push({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			opacity: Math.random(),
			speedX: random(-11,11),
			speedY: random(7, 15),
			radius: random(0.5, 4.2)
		})
	}
};

const drawSnowflakes = () => {
	for (let i = 0; i < particlesArray.length; i++) {
		let gradient = ctx.createRadialGradient(
			particlesArray[i].x,
			particlesArray[i].y,
			0,
			particlesArray[i].x,
			particlesArray[i].y,
			particlesArray[i].radius
		);
		gradient.addColorStop(0, "rgba(255,255,255,"+particlesArray[i].opacity+")");
		gradient.addColorStop(0.8, "rgba(210,236,255,"+particlesArray[i].opacity+")");

		ctx.beginPath();
		ctx.arc(
			particlesArray[i].x,
			particlesArray[i].y,
			particlesArray[i].radius,
			0,
			Math.PI*2,
			false
		);
		ctx.fillStyle = gradient;
		ctx.fill();
		
	}
};

const moveParticles = () => {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].x += particlesArray[i].speedX;
        particlesArray[i].y += particlesArray[i].speedY;
        if (particlesArray[i].y > canvas.height) {
            particlesArray[i].x = Math.random() * canvas.width * 1.5;
            particlesArray[i].y = -50;
        }
    
    }
};

createSnowflakes();

const snowButton = document.getElementById("Snow");
snowButton.addEventListener("click", () => {
    flags.snow = !flags.snow;
    if (flags.snow) {
        currentFloor = {r: 255, g: 255, b: 255};
    } else {
        currentFloor = {r: 0, g: 0, b: 0};
    }
});

let init = [];
let maxParts = 1000;
var particles = [];

const createRain = () => {
    for(let a = 0; a < maxParts; a++) {
      init.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        l: Math.random() * 1,
        xs: -4 + Math.random() * 4 + 2,
        ys: Math.random() * 10 + 10
      })
    }
    for(let i = 0; i < maxParts; i++) {
        particles[i] = init[i];
      }
}

createRain();   
    
    const drawRain = () => {
      for(let i = 0; i < particles.length; i++) {
        let p = particles[i];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
        ctx.stroke();
      }
    }
    
    const moveRain = () => {
      for(var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.xs;
        p.y += p.ys;
        if(p.x > canvas.width || p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = -20;
        }
      }
    }

const rainButton = document.getElementById("Rain");
rainButton.addEventListener("click", () => {
    flags.rain = !flags.rain;
})