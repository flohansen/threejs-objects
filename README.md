# three.js Objects

A composition of cool 3D accelerated objects.

## What is this?

This is an extension library for [three.js](https://threejs.org/), which
provides some 3D objects ready to use. The main problem I had was to create nice
looking objects for my prototypes. Because creating a prototype is about create
a basic design fast, the development of 3D objects is a bottleneck and slows
down the creation of the prototype.

## How do I use this?

Import an object and add it to the three.js scene. The `options` argument
contains parameters of the object.

```js
import { ParticleWave } from "threejs-objects";

const wave = new ParticleWave(options);
scene.add(wave);
```
