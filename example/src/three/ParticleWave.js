import * as THREE from "three";

const vertexShader = `
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 translate;
attribute float scale;

varying vec2 vUv;

void main() {
  vec3 trans = vec3(
    0.0,
    translate.y + sin(time + translate.x * 5.0 + translate.z * 2.0) * 0.05,
    0.0
  );

  vec4 mvPosition = modelViewMatrix * vec4(translate + trans, 1.0);

  mvPosition.xyz += position * scale;

  vUv = uv;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D map;

varying vec2 vUv;

void main() {
  vec4 color = texture2D(map, vUv);
  gl_FragColor = color;
}
`;

const random = (min, max) => Math.random() * (max - min) + min;

class ParticleWave extends THREE.Mesh {
  constructor(options) {
    const particleSize = options?.particleSize ?? 0.025;
    const particleTexture = options?.particleTexture ?? "";
    const width = options?.numberParticles ? options.numberParticles[0] : 50;
    const height = options?.numberParticles ? options.numberParticles[1] : 50;
    const noise = options?.noise ?? 0;

    const geometry = new THREE.InstancedBufferGeometry();

    const circleGeometry = new THREE.CircleBufferGeometry(1, 6);
    geometry.index = circleGeometry.index;
    geometry.attributes = circleGeometry.attributes;

    const translateArray = new Float32Array(width * height * 3);
    const sizeArray = new Float32Array(width * height);

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const index = i * width + j;
        const randx = random(-noise, noise);
        const randz = random(-noise, noise);

        translateArray[index * 3 + 0] = (1.0 / width) * j - 0.5 + randx;
        translateArray[index * 3 + 1] = 0.0;
        translateArray[index * 3 + 2] = (1.0 / height) * i - 0.5 + randz;

        sizeArray[index] = random(-particleSize, particleSize);
      }
    }

    geometry.setAttribute(
      "translate",
      new THREE.InstancedBufferAttribute(translateArray, 3)
    );

    geometry.setAttribute(
      "scale",
      new THREE.InstancedBufferAttribute(sizeArray, 1)
    );

    const material = new THREE.RawShaderMaterial({
      uniforms: {
        map: { value: new THREE.TextureLoader().load(particleTexture) },
        time: { value: 0.0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      depthTest: true,
      depthWrite: true,
      blending: THREE.AdditiveBlending,
    });

    super(geometry, material);
  }
}

export default ParticleWave;
