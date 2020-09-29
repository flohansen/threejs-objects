export const vertexShader = `
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform sampler2D image;
uniform float time;
uniform float amplitude;

attribute vec3 translate;
attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;
varying vec4 vColor;

void main() {
  vec4 imageColor = texture2D(image, translate.xy + 0.5);
  float gray = 0.3 * imageColor.r + 0.59 * imageColor.g + 0.11 * imageColor.b;
  float scale = 0.02;

  vec3 trans = vec3(0.0, 0.0, sin(time + translate.x * 15.0) * amplitude + cos(time + translate.y * 15.0) * amplitude);
  vec4 mvPosition = modelViewMatrix * vec4(translate + trans, 1.0);
  mvPosition.xyz += position * gray * scale;

  vUv = uv;
  vColor = imageColor;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const fragmentShader = `
precision highp float;

uniform sampler2D particleTexture;

varying vec2 vUv;
varying vec4 vColor;

void main() {
  vec4 texColor = texture2D(particleTexture, vUv);
  gl_FragColor = texColor * vColor;
}
`;
