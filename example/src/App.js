import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { ParticleWave } from "threejs-objects";
import "./App.css";

function App() {
  const canvasRef = useRef();

  useEffect(() => {
    const clock = new THREE.Clock();
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000.0
    );

    camera.position.z = 10;
    camera.lookAt(0, 0, 0);
    camera.position.y = 1;

    const wave = new ParticleWave({
      waveHeight: 0.1,
      particleSize: 0.025,
      particleTexture: "img/circle.png",
      numberParticles: [50, 50],
      noise: 0.005,
    });

    wave.scale.set(15, 1, 15);

    const scene = new THREE.Scene();
    scene.add(wave);

    const update = (dt) => {
      wave.material.uniforms.time.value += dt;
    };

    const draw = (time) => {
      requestAnimationFrame(draw);

      const dt = clock.getDelta();
      update(dt);

      renderer.render(scene, camera);
    };

    clock.start();
    requestAnimationFrame(draw);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} id="sandbox"></canvas>
    </div>
  );
}

export default App;
