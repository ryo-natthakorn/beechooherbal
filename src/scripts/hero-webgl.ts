// src/scripts/hero-webgl.ts
// The hero's living gradient: one full-screen triangle + a GLSL fragment shader that
// drifts fbm noise through the brand greens (Harmony Green → brand-green-deep) with a
// restrained gold glow. Hand-written raw WebGL — no Three.js/ogl dependency (~2KB).
// Lazy-imported by home-motion.ts ONLY on desktop-width fine-pointer devices with
// motion allowed; every failure path simply leaves the CSS .hero-aura fallback visible.
//
// Perf hygiene: DPR capped at 1.5, render loop pauses when the tab is hidden or the
// hero leaves the viewport, canvas fades in only after the first frame renders.

const VERT = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

// Flow speeds tuned per stakeholder review of the design preview (~3x the first cut).
// Colours lifted a step + vignette floor raised (0.75 -> 0.88) after mobile-outdoor
// legibility feedback — same brand-green family, just lighter overall.
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_mouseStrength;

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * sin(p.x * 1.7 + p.y * 1.3 + u_time * 0.16) * cos(p.y * 1.1 - u_time * 0.13);
    p *= 1.6;
    a *= 0.55;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 aspect = vec2(u_res.x / u_res.y, 1.0);
  vec2 p = (uv - 0.5) * aspect * 3.2;

  /* Cloth cursor-push: the flow field bulges away from the pointer, as if the
     cursor is pressing into fabric. u_mouseStrength eases 0<->1 in JS on
     hover/leave so the push fades in/out instead of snapping.
     Calibrated down after stakeholder review called the original (radius 1.4,
     multiplier 0.7) "gimmicky" / "visual noise" — a smaller radius keeps the
     effect local to the cursor instead of bulging across most of the visible
     field, and the lower multiplier keeps the displacement subtle rather than
     an obvious cloth-poke. See hero-webgl.ts's mouseStrength easing below for
     the matching slow-fade half of this change. */
  vec2 mp = (u_mouse - 0.5) * aspect * 3.2;
  vec2 toPoint = p - mp;
  float dist = length(toPoint);
  float push = u_mouseStrength * smoothstep(0.75, 0.0, dist) * 0.22;
  p += normalize(toPoint + 1e-4) * push;

  float n = fbm(p + vec2(0.0, u_time * 0.10));
  float glow = fbm(p * 0.6 - vec2(u_time * 0.07, 0.0));
  vec3 deep = vec3(0.118, 0.255, 0.164); /* lifted deep shade */
  vec3 mid  = vec3(0.157, 0.345, 0.230); /* lifted ~ brand-green-deep #1F4A31 */
  vec3 base = vec3(0.212, 0.463, 0.310); /* lifted brand-green #2D6946 */
  vec3 gold = vec3(1.0, 0.776, 0.0);     /* brand-yellow #FFC600 */
  vec3 col = mix(deep, mid, smoothstep(-0.6, 0.5, n));
  col = mix(col, base, smoothstep(0.0, 0.9, n));
  col = mix(col, gold, smoothstep(0.55, 0.95, glow) * 0.35);
  float vig = smoothstep(1.3, 0.2, length(p * 0.5));
  col *= mix(0.88, 1.08, vig);
  gl_FragColor = vec4(col, 1.0);
}
`;

export function initHeroShader(canvas: HTMLCanvasElement): void {
  const gl = canvas.getContext("webgl", { antialias: false, depth: false, stencil: false });
  if (!gl) return;

  const compile = (type: number, src: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
    return shader;
  };

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "u_res");
  const uTime = gl.getUniformLocation(program, "u_time");
  const uMouse = gl.getUniformLocation(program, "u_mouse");
  const uMouseStrength = gl.getUniformLocation(program, "u_mouseStrength");

  // Cloth cursor-push: canvas is pointer-events:none (so it never blocks the CTAs
  // sitting on top of it), so hover is tracked on window and mapped onto the
  // canvas's own rect — pointer outside that rect just eases the push back to 0.
  let mouseX = 0.5;
  let mouseY = 0.5;
  let mouseTargetStrength = 0;
  let mouseStrength = 0;
  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) {
      mouseTargetStrength = 0;
      return;
    }
    mouseX = x;
    mouseY = y;
    mouseTargetStrength = 1;
  };
  const onPointerLeave = () => {
    mouseTargetStrength = 0;
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerleave", onPointerLeave);

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener("resize", resize);

  let inViewport = true;
  new IntersectionObserver((entries) => {
    inViewport = entries[0]?.isIntersecting ?? true;
  }).observe(canvas);

  let shown = false;
  const start = performance.now();
  const frame = (now: number) => {
    if (inViewport && !document.hidden) {
      // Slower ease (was 0.08) so the push fades in/out more gently — pairs with
      // the smaller/weaker shader push above to keep the whole effect subtle.
      mouseStrength += (mouseTargetStrength - mouseStrength) * 0.045;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouseX, 1 - mouseY);
      gl.uniform1f(uMouseStrength, mouseStrength);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        canvas.style.opacity = "1";
      }
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
