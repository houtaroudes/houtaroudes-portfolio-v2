import { useEffect, useRef } from "react";

/* Animated topographic contour background.
   A 3D simplex-noise field is contoured into hairline bands; the third
   noise dimension is time so the lines morph forever, a second low
   frequency layer warps the field, and the cursor bends it locally. */

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uCursor;   // cursor in aspect-corrected UV space
uniform float uDark;     // 0 = light theme, 1 = dark theme

// ---- Simplex noise 3D (standard public-domain implementation) ----
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// ---- Field tuning ----
const float NOISE_DETAIL      = 3.0;  // contour bands per noise cell
const float DISTORT_SCALE     = 0.55; // size of the slow warp layer
const float DISTORT_INTENSITY = 0.50; // how far the warp pushes the field
const float SCALE             = 2.2;  // base frequency of contour field
const float CURSOR_INTENSITY  = 0.18; // cursor influence on the field
const float TIME_SCALE        = 0.07; // global morph speed

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.y; // aspect-corrected UV

  // Layer 1: slow large-scale noise that warps the contour field.
  float noiseDistort = 0.5 + snoise(vec3(uv * DISTORT_SCALE, uTime * 0.1 * TIME_SCALE * 10.0)) * 0.5;

  // Layer 2: the contoured field, warped by layer 1 and the cursor.
  vec2 warpedUv = (uv + uCursor * CURSOR_INTENSITY + noiseDistort * DISTORT_INTENSITY) * SCALE;
  float n = snoise(vec3(warpedUv, uTime * TIME_SCALE));

  // Topographic trick: fract() wraps the field into discrete bands.
  float bands = (n * 0.5 + 0.5) * NOISE_DETAIL;
  float d = abs(fract(bands) - 0.5);

  // Hairline antialiased contour lines. (LINE_WIDTH_TOKEN is swapped at
  // runtime: fwidth() when derivatives are available, analytic otherwise.)
  float w = LINE_WIDTH_TOKEN;
  float line = 1.0 - smoothstep(0.0, w * 1.6, d);

  // Theme palettes: cream bg with navy lines / deep navy bg with pale lines.
  vec3 bgLight   = vec3(0.957, 0.957, 0.929); // #F4F4ED
  vec3 lineLight = vec3(0.075, 0.137, 0.247); // #13233F
  vec3 bgDark    = vec3(0.024, 0.047, 0.102); // #060C1A
  vec3 lineDark  = vec3(0.914, 0.929, 0.961); // #E9EDF5

  vec3 bg   = mix(bgLight,   bgDark,   uDark);
  vec3 lineCol = mix(lineLight, lineDark, uDark);
  float lineAlpha = line * mix(0.14, 0.09, uDark);

  vec3 color = mix(bg, lineCol, lineAlpha);
  gl_FragColor = vec4(color, 1.0);
}
`;

function compile(gl, type, src) {
  const shader = gl.createShader(type);
  if (!shader) return null; // context lost or invalid
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("ContourBackground shader error:", gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

export default function ContourBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl || gl.isContextLost()) return; // flat background remains as fallback

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const hasDerivatives = !!gl.getExtension("OES_standard_derivatives");
    const fragSrc = (hasDerivatives ? "#extension GL_OES_standard_derivatives : enable\n" : "") +
      FRAG.replace(/LINE_WIDTH_TOKEN/g, hasDerivatives ? "fwidth(bands)" : "6.0 / uRes.y");
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uCursor = gl.getUniformLocation(program, "uCursor");
    const uDark = gl.getUniformLocation(program, "uDark");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // Cursor eases toward the pointer so the field bends, never snaps.
    const cursor = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e) => {
      cursor.tx = (e.clientX / window.innerHeight) - 0.5;
      cursor.ty = 0.5 - (e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onPointer);

    // Theme: ease uDark toward the current data-theme value.
    let darkTarget = 0;
    const readTheme = () => {
      darkTarget = document.documentElement.getAttribute("data-theme") === "dark" ? 1 : 0;
    };
    readTheme();
    let dark = darkTarget; // start on the visitor's actual theme — no light flash for dark mode
    const themeObserver = new MutationObserver(readTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = !reducedMotion;

    const draw = (t) => {
      cursor.x += (cursor.tx - cursor.x) * 0.04;
      cursor.y += (cursor.ty - cursor.y) * 0.04;
      dark += (darkTarget - dark) * 0.08;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t * 0.001);
      gl.uniform2f(uCursor, cursor.x, cursor.y);
      gl.uniform1f(uDark, dark);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (t) => {
      if (running) draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      running = !document.hidden;
    };

    if (reducedMotion) {
      draw(0); // one static frame — the pattern still shows, nothing animates
    } else {
      raf = requestAnimationFrame(loop);
      // Save battery: stop drawing while the tab is hidden.
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="bg-contour" aria-hidden="true" />;
}
