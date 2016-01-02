/*********************** Globals *************************/

var particleCount = parseInt(document.getElementById('nbParticles').value);
var particleRangeSlider = document.getElementById('nbParticles');

var rotationSeedValue = parseInt(document.getElementById('seedRotation').value);
var rotationSlider = document.getElementById('randomRotation');

var gravityValue = 0;
var gravitySlider = document.getElementById('gravitySlide');

var speedValue = 2;
var speedSlider = document.getElementById('speedSlide');

var scaleValue = 2;
var scaleSlider = document.getElementById('scaleSlide');

var vortexValue = 2;
var vortexSlider = document.getElementById('vortexSlide');

var cColor = document.getElementById('cColor');
var cTexture = document.getElementById('cTexture');
var cRotation = document.getElementById('cRotation');
var calcColor = false;
var calcRotation = false;
var calcTexture = false;


/************************* GUI ***************************/

function particleRange() {
  this.partVal = document.getElementById('nbParticles');
  this.partVal.addEventListener('change', function (evt) {
    document.getElementById('labelParticles').innerHTML = parseInt(partVal.value);
  }, false);
}
particleRange();

particleRangeSlider.addEventListener('change', function (evt) {
  particleCount = parseInt(document.getElementById('nbParticles').value);
});

function randomizeRotationRange() {
  rotationSlider.addEventListener('change', function (evt) {
    rotationSeedValue = parseInt(document.getElementById('randomRotation').value);
    document.getElementById('seedRotation').innerHTML = rotationSeedValue;
    Math.seed = rotationSeedValue;
  });
}
randomizeRotationRange();

function gravityRange() {
  gravitySlider.addEventListener('change', function (evt) {
    gravityValue = parseInt(document.getElementById('gravitySlide').value);
    document.getElementById('gravityVal').innerHTML = gravityValue;
  });
}
gravityRange();

function speedRange() {
  speedSlider.addEventListener('change', function (evt) {
    speedValue = parseInt(document.getElementById('speedSlide').value);
    document.getElementById('speedVal').innerHTML = speedValue;
  });
}
speedRange();

function scaleRange() {
  scaleSlider.addEventListener('change', function (evt) {
    scaleValue = parseInt(document.getElementById('scaleSlide').value);
    document.getElementById('scaleVal').innerHTML = scaleValue;
  });
}
scaleRange();

function vortexRange() {
  vortexSlider.addEventListener('change', function (evt) {
    vortexValue = parseInt(document.getElementById('vortexSlide').value);
    document.getElementById('vortexVal').innerHTML = vortexValue;
  });
}
vortexRange();

function calcCheck() {
  cColor.addEventListener('change', function (evt) {
    if (calcColor == true) {
      calcColor = false;
    }
    else {
      calcColor = true;
    }
  });
  cTexture.addEventListener('change', function (evt) {
    if (calcTexture == true) {
      calcTexture = false;
    }
    else {
      calcTexture = true;
    }
  });
  cRotation.addEventListener('change', function (evt) {
    if (calcRotation == true) {
      calcRotation = false;
    }
    else {
      calcRotation = true;
    }
  });
}
calcCheck();


/******************* Override Bug in SPS *******************/

function changeMaterial() {
  if (scene.meshes[0].material == scene.getMaterialByName('shader')) {
    scene.meshes[0].material = scene.getMaterialByName('mat1');
  }
  else {
    scene.meshes[0].material = scene.getMaterialByName('shader');
  }
}

/********************* Seed Helper  ************************/

Math.seed = 6;
Math.seededRandom = function (max, min) {
  max = max || 1;
  min = min || 0;

  Math.seed = (Math.seed * 9301 + 49297) % 233280;
  var rnd = Math.seed / 233280;

  return min + rnd * (max - min);
};

/*************************** FPS ***************************/
var fps = {
  startTime: 0,
  frameNumber: 0,
  getFPS: function () {
    this.frameNumber++;
    var d = new Date().getTime(),
      currentTime = ( d - this.startTime ) / 1000,
      result = Math.floor(( this.frameNumber / currentTime ));

    if (currentTime > 1) {
      this.startTime = new Date().getTime();
      this.frameNumber = 0;
    }
    return result;

  }
};
