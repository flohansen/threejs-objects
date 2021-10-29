export const vertexShader = `
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform float waveHeight;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 translate;
attribute float scale;

varying vec2 vUv;

void main() {
  vec3 trans = vec3(
    0.0,
    sin(time + translate.x * 5.0 + translate.z * 2.0) * waveHeight,
    0.0
  );

  vec4 mvPosition = modelViewMatrix * vec4(translate + trans, 1.0);

  mvPosition.xyz += position * scale;

  vUv = uv;
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const fragmentShader = `
precision highp float;

uniform sampler2D map;
uniform vec4 particleColor;

varying vec2 vUv;

void main() {
  vec4 color = particleColor * texture2D(map, vUv);
  gl_FragColor = color;
}
`;
