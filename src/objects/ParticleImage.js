import * as THREE from "three";
import { vertexShader, fragmentShader } from "../shaders/ParticleImageShader";

export default class ParticleImage extends THREE.Mesh {
  constructor(options) {
    const useImageColors = options?.useImageColors ?? false;
    const color = options?.color ?? new THREE.Color(1.0, 1.0, 1.0);
    const amplitude = options?.amplitude ?? 0.05;
    const image = options?.image;
    const particleTexture = options?.particleTexture;
    const numberParticles = options?.numberParticles ?? 1000;

    const geometry = new THREE.InstancedBufferGeometry();

    // prettier-ignore
    const positions = new Float32Array([
      -0.5,  0.5, 0.0, // top left
       0.5,  0.5, 0.0, // top right
       0.5, -0.5, 0.0, // bottom right
      -0.5, -0.5, 0.0  // bottom left
    ]);

    // prettier-ignore
    const uvs = new Float32Array([
      0.0, 1.0, // top left
      1.0, 1.0, // top right
      1.0, 0.0, // bottom right
      0.0, 0.0  // bottom left
    ]);

    // prettier-ignore
    const indices = new Uint16Array([
      0, 3, 1,
      3, 2, 1
    ]);

    const translates = new Float32Array(numberParticles * 3);

    for (let i = 0; i < numberParticles; i++) {
      // Set the position (UV coordinate) of the particle.
      translates[i * 3 + 0] = Math.random() - 0.5;
      translates[i * 3 + 1] = Math.random() - 0.5;
      translates[i * 3 + 2] = 0.0;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(new THREE.Uint16BufferAttribute(indices, 1));
    geometry.setAttribute(
      "translate",
      new THREE.InstancedBufferAttribute(translates, 3)
    );

    const applyVertexShader = () => {
      if (useImageColors) {
        return "#define USE_IMAGE_COLORS\n" + vertexShader;
      }

      return vertexShader;
    };

    const material = new THREE.RawShaderMaterial({
      uniforms: {
        color: { value: color },
        amplitude: { value: amplitude },
        time: { value: 0.0 },
        image: { value: new THREE.TextureLoader().load(image) },
        particleTexture: {
          value: new THREE.TextureLoader().load(particleTexture),
        },
      },
      vertexShader: applyVertexShader(),
      fragmentShader: fragmentShader,
      depthTest: true,
      depthWrite: true,
    });

    super(geometry, material);
  }

  update(dt) {
    this.material.uniforms.time.value += dt;
  }
}
