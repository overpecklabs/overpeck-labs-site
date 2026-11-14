import * as THREE from "three";

/** Glowing "lab liquid" shader: flowing bands, fresnel rim, a moving caustic highlight, and a fill cutoff along the tube. */
export function makeLiquidMaterial(color = "#19f0d2", deep = "#0b8f82") {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uFill: { value: 1 },
      uColor: { value: new THREE.Color(color) },
      uDeep: { value: new THREE.Color(deep) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = -mv.xyz;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uFill;
      uniform vec3 uColor;
      uniform vec3 uDeep;
      varying vec2 vUv;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        if (vUv.x > uFill) discard;
        float flow = 0.5 + 0.5 * sin(vUv.x * 46.0 - uTime * 3.2 + sin(vUv.y * 6.283) * 0.6);
        float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        float caustic = smoothstep(0.82, 1.0, sin(vUv.x * 14.0 - uTime * 2.1 + vUv.y * 9.0) * 0.5 + 0.5) * smoothstep(0.15, 0.4, vUv.y) * (1.0 - smoothstep(0.4, 0.65, vUv.y));
        vec3 col = mix(uDeep, uColor, 0.55 + 0.3 * flow);
        col += fres * 0.55 + caustic * 0.45;
        gl_FragColor = vec4(col, 0.93);
      }
    `,
  });
}
