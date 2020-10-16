import * as THREE from "three";
import { vertexShader, fragmentShader } from "../shaders/ParticleWaveShader";
import { random } from "../utils/Random";

class ParticleWave extends THREE.Mesh {
  constructor(options) {
    const particleSize = options?.particleSize ?? 0.025;
    const particleTexture = options?.particleTexture ?? "";
    const waveHeight = options?.waveHeight ?? 1.0;
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
        waveHeight: { value: waveHeight },
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

  update(dt) {
    this.material.uniforms.time.value += dt;
  }
}

export default ParticleWave;
