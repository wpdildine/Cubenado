var canvas = document.querySelector("#render");
var engine = new BABYLON.Engine(canvas, true);

var createScene = function () {

  /*************************** Scene ***************************/

  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.0, 0.0, 0.0);

  var camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(0, 0, -0), scene);
  camera.setPosition(new BABYLON.Vector3(0, 50, -300));
  camera.attachControl(canvas, true);

  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
  light.intensity = 0.9;

  var pointLight = new BABYLON.PointLight('light2', new BABYLON.Vector3(100, 1000, 1), scene);
  pointLight.diffuse = new BABYLON.Color3(1, 0, 0);
  pointLight.specular = new BABYLON.Color3(1, 1, 0);

  /*************************** Shader ***************************/

  BABYLON.Effect.ShadersStore["customVertexShader"] = "precision highp float;\r\n" +

    "// Attributes\r\n" +
    "attribute vec3 position;\r\n" +
    "attribute vec3 normal;\r\n" +
    "attribute vec2 uv;\r\n" +

    "// Uniforms\r\n" +
    "uniform mat4 world;\r\n" +
    "uniform mat4 worldViewProjection;\r\n" +

    "// Varying\r\n" +
    "varying vec3 vPositionW;\r\n" +
    "varying vec3 vNormalW;\r\n" +
    "varying vec2 vUV;\r\n" +

    "void main(void) {\r\n" +
    "    vec4 outPosition = worldViewProjection * vec4(position, 1.0);\r\n" +
    "    gl_Position = outPosition;\r\n" +
    "    \r\n" +
    "    vPositionW = vec3(world * vec4(position, 1.0));\r\n" +
    "    vNormalW = normalize(vec3(world * vec4(normal, 0.0)));\r\n" +
    "    \r\n" +
    "    vUV = uv;\r\n" +
    "}\r\n";

  BABYLON.Effect.ShadersStore["customFragmentShader"] = "precision highp float;\r\n" +

    "// Lights\r\n" +
    "varying vec3 vPositionW;\r\n" +
    "varying vec3 vNormalW;\r\n" +
    "varying vec2 vUV;\r\n" +

    "// Refs\r\n" +
    "uniform sampler2D textureSampler;\r\n" +
    "uniform vec3 lightPosition;\r\n" +
    "uniform float time;\r\n" +

    "void main(void) {\r\n" +
    "    float ToonThresholds[4];\r\n" +
    "    ToonThresholds[0] = 0.95;\r\n" +
    "    ToonThresholds[1] = 0.5;\r\n" +
    "    ToonThresholds[2] = 0.2;\r\n" +
    "    ToonThresholds[3] = 0.03;\r\n" +
    "    \r\n" +
    "    float ToonBrightnessLevels[5];\r\n" +
    "    ToonBrightnessLevels[0] = 1.0;\r\n" +
    "    ToonBrightnessLevels[1] = 0.8;\r\n" +
    "    ToonBrightnessLevels[2] = 0.6;\r\n" +
    "    ToonBrightnessLevels[3] = 0.35;\r\n" +
    "    ToonBrightnessLevels[4] = 0.2;\r\n" +
    "    \r\n" +
    "    vec3 vLightPosition = lightPosition;\r\n" +
    "    \r\n" +
    "    // Light\r\n" +
    "    vec3 lightVectorW = normalize(vLightPosition - vPositionW);\r\n" +
    "    \r\n" +
    "    // diffuse\r\n" +
    "    float ndl = max(0., dot(vNormalW, lightVectorW));\r\n" +
    "    \r\n" +
    "    vec3 color = vec3(1.0*sin(time) , 0.3, 0.3);\r\n" +
    "    \r\n" +
    "    if (ndl > ToonThresholds[0])\r\n" +
    "    {\r\n" +
    "        color *= ToonBrightnessLevels[0];\r\n" +
    "    }\r\n" +
    "    else if (ndl > ToonThresholds[1])\r\n" +
    "    {\r\n" +
    "        color *= ToonBrightnessLevels[1];\r\n" +
    "    }\r\n" +
    "    else if (ndl > ToonThresholds[2])\r\n" +
    "    {\r\n" +
    "        color *= ToonBrightnessLevels[2];\r\n" +
    "    }\r\n" +
    "    else if (ndl > ToonThresholds[3])\r\n" +
    "    {\r\n" +
    "        color *= ToonBrightnessLevels[3];\r\n" +
    "    }\r\n" +
    "    else\r\n" +
    "    {\r\n" +
    "        color *= ToonBrightnessLevels[4];\r\n" +
    "    }\r\n" +
    "    \r\n" +
    "    gl_FragColor = vec4(color.r, color.g, color.b, 1.);\r\n" +
    "}\r\n";

  /*************************** Compiler ***************************/

  var shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, {
      vertex: "custom",
      fragment: "custom",
    },
    {
      attributes: ["position", "normal", "uv"],
      uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
    });

  shaderMaterial.setColor3("rgb", .3, .3, .3);
  shaderMaterial.setFloat("time", 0);
  shaderMaterial.setVector3("cameraPosition", BABYLON.Vector3.Zero());
  shaderMaterial.backFaceCulling = false;

  /********************** Basic Material ***************************/

  var mat = new BABYLON.StandardMaterial("mat1", scene);
  mat.backFaceCulling = true;
  var texture = new BABYLON.Texture("assets/bw.jpg", scene);
  mat.diffuseTexture = texture;

  /*************************** SPS Mesh ***************************/

  var box = BABYLON.MeshBuilder.CreateBox("box", {size: 2, segments: 1}, scene);
  var SPS = new BABYLON.SolidParticleSystem('SPS', scene);
  SPS.addShape(box, 10000);
  var mesh = SPS.buildMesh();
  mesh.material = mat;
  mesh.position.y = -100;
  box.dispose();

  /*************************** Behavior ***************************/

  var speed = 1.5;

  /****** Freezes Normals for Performance *************************/

  SPS.mesh.freezeNormals();

  /************************* Initialize ***************************/

  SPS.initParticles = function () {
    for (var p = 0; p < this.nbParticles; p++) {
      this.recycleParticle(this.particles[p]);
    }
  };
  SPS.vars.scale = 0;

  /********************* Recycle Particles ************************/
  SPS.recycleParticle = function (particle) {

    if (particle.idx > particleCount) {
      particle.alive = false;
    }
    else {
      particle.alive = true;
    }
    if (!particle.alive) {
      if (particle.scale.y == 0) {
        return;
      }
      particle.scale.x = 0;
      particle.scale.y = 0;
      particle.scale.z = 0;
      return;
    }
    else {
      particle.position.x = Math.random() * 6;
      particle.position.y = Math.random() * 6;
      particle.position.z = Math.random() * 6;
      particle.velocity.x = (Math.random() - 0.5) * speed;
      particle.velocity.y = Math.random() * speed;
      particle.velocity.z = (Math.random() - 0.5) * speed;
      SPS.vars.scale = scaleValue - 3 * (Math.random());
      particle.scale.x = SPS.vars.scale;
      particle.scale.y = SPS.vars.scale;
      particle.scale.z = SPS.vars.scale;
      particle.rotation.x = Math.seededRandom() * 3.5;
      particle.rotation.y = Math.seededRandom() * 3.5;
      particle.rotation.z = Math.seededRandom() * 3.5;
      particle.color.r = Math.random() * 0.6 + 0.5;
      particle.color.g = Math.random() * 0.6 + 0.5;
      particle.color.b = Math.random() * 0.6 + 0.5;
    }

  };

  /*************************** Behavior ***************************/

  SPS.updateParticle = function (particle) {
    if (particle.position.y > 200 || particle.position.y < 0 || Math.pow((particle.position.x - 0), 2) + Math.pow((particle.position.z - 0), 2) > Math.pow(140, 2)) {
      this.recycleParticle(particle);
    }

    particle.velocity.y += (gravityValue * .01);
    (particle.position).addInPlace(particle.velocity);
    particle.position.y += speedValue / 4;

    var spin = (particle.idx % 2 == 0) ? 1 : -1;
    particle.rotation.z += 0.1 * spin;
    particle.rotation.x += 0.05 * spin;
    particle.rotation.y += 0.008 * spin;
  };

  /************************* Render ***************************/

  SPS.initParticles();

  /************* Execute Prior to Render **********************/

  scene.registerBeforeRender(function () {
    SPS.setParticles();
    SPS.mesh.rotation.y += vortexValue * .025;
    shaderMaterial.setVector3("lightPosition", pointLight.position);
    SPS.computeParticleColor = calcColor;
    SPS.computeParticleTexture = calcTexture;
    SPS.computeParticleRotation = calcRotation;
  });

  return scene;

};
var scene = createScene();

var time = 0;
var f = document.querySelector("#fps");
engine.runRenderLoop(function () {
  f.innerHTML = fps.getFPS();
  var shaderMaterial = scene.getMaterialByName("shader");
  shaderMaterial.setFloat("time", time);
  time += 0.02;
  shaderMaterial.setVector3("cameraPosition", scene.activeCamera.position);
  scene.render();
});

window.addEventListener("resize", function () {

  engine.resize();

});








