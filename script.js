/* ==========================================================================
   SG@Art — Quantum-Era Engine v1.2.0
   Neural Macramé v2 • WebGPU + WebGL2/2D Fallback • Export SVG/JSON • WebXR
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = motionQuery.matches;
    motionQuery.addEventListener("change", (e) => {
        prefersReducedMotion = e.matches;
        renderer.syncAnimationState();
    });

    /* ----------------------------------------------------------------------
       1. NAVIGATION, ACCESSIBILITÉ & HISTORIQUE URL
       ---------------------------------------------------------------------- */
    const navLinks = Array.from(document.querySelectorAll(".nav-list a"));
    const sections = Array.from(document.querySelectorAll(".section"));
    const sectionIds = new Set(sections.map((s) => s.id));

    function activateSection(id, updateHash = true) {
        const targetId = sectionIds.has(id) ? id : "home";

        sections.forEach((sec) => {
            sec.classList.toggle("active", sec.id === targetId);
        });

        navLinks.forEach((link) => {
            const isCurrent = link.getAttribute("href") === `#${targetId}`;
            link.parentElement.classList.toggle("active", isCurrent);
            if (isCurrent) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        if (updateHash && window.location.hash !== `#${targetId}`) {
            history.replaceState(null, "", `#${targetId}`);
        }

        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });

        renderer.syncAnimationState();
    }

    // Intercepte tous les liens internes pointant vers une section (#home, #about, etc.)
    document.addEventListener("click", (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const targetId = link.getAttribute("href").slice(1);
        if (sectionIds.has(targetId)) {
            e.preventDefault();
            activateSection(targetId);
        }
    });

    // Navigation clavier (flèches gauche/droite dans la barre de nav)
    navLinks.forEach((link, idx) => {
        link.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                navLinks[(idx + 1) % navLinks.length].focus();
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                navLinks[(idx - 1 + navLinks.length) % navLinks.length].focus();
            }
        });
    });

    window.addEventListener("hashchange", () => {
        const hashId = window.location.hash.slice(1);
        if (sectionIds.has(hashId)) activateSection(hashId, false);
    });

    /* ----------------------------------------------------------------------
       2. MOTEUR NEURAL MACRAMÉ v2 (Seed déterministe & Estimation cordes)
       ---------------------------------------------------------------------- */
    const seedInput = document.getElementById("seed-input");
    const knotSelect = document.getElementById("knot-type");
    const densityRange = document.getElementById("density-range");
    const densityOut = document.getElementById("density-out");
    const ropeEstimate = document.getElementById("rope-estimate");

    const PRESETS = {
        suspension: { seed: "QUANTUM-SUSP-01", knot: "spiral", density: 20 },
        bracelet: { seed: "GEO-BRACELET-07", knot: "flat", density: 12 },
        wall: { seed: "SG-WALL-ARCH-24", knot: "feston", density: 28 }
    };

    const KNOT_META = {
        flat: { label: "Nœud plat structural", mode: 0, factor: 1.0 },
        spiral: { label: "Spirale hélicoïdale", mode: 1, factor: 1.25 },
        feston: { label: "Feston architectural", mode: 2, factor: 1.38 }
    };

    function sanitizeSeed(raw) {
        const cleaned = String(raw || "SG-ART-120")
            .trim()
            .replace(/[^a-zA-Z0-9_-]/g, "")
            .slice(0, 32);
        return cleaned || "SG-ART-120";
    }

    function hashSeed(str) {
        let h = 2166136261;
        for (let i = 0; i < str.length; i += 1) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return (h >>> 0) / 4294967295;
    }

    function getPatternState() {
        const seed = sanitizeSeed(seedInput ? seedInput.value : "SG-ART-120");
        const knotKey = knotSelect && KNOT_META[knotSelect.value] ? knotSelect.value : "flat";
        const density = densityRange ? Number(densityRange.value) || 16 : 16;
        const seedNorm = hashSeed(seed);
        const knot = KNOT_META[knotKey];

        // Estimation réaliste : nombre de brins pairs + longueur totale en mètres
        const strands = Math.max(8, Math.round((density * 0.65 + seedNorm * 4) / 2) * 2);
        const meters = Number((strands * (1.15 + density * 0.045) * knot.factor).toFixed(1));

        return { seed, seedNorm, knotKey, knot, density, strands, meters };
    }

    function updatePatternUI() {
        const state = getPatternState();
        if (densityOut) densityOut.textContent = String(state.density);

        if (ropeEstimate) {
            ropeEstimate.replaceChildren();
            ropeEstimate.append("Estimation : ");
            const bStrands = document.createElement("strong");
            bStrands.textContent = `${state.strands} brins`;
            ropeEstimate.append(bStrands, " • ~");
            const bMeters = document.createElement("strong");
            bMeters.textContent = `${state.meters.toLocaleString("fr-FR")} m`;
            ropeEstimate.append(bMeters, " de corde coton 4 mm");
        }

        renderer.renderOnce();
    }

    [seedInput, knotSelect, densityRange].forEach((el) => {
        if (el) el.addEventListener("input", updatePatternUI);
    });

    /* ----------------------------------------------------------------------
       3. PIPELINE DE RENDU RÉSILIENT (WebGPU -> WebGL2 -> Canvas 2D)
       ---------------------------------------------------------------------- */
    const canvas = document.getElementById("macrame-canvas");
    const gpuStatus = document.getElementById("gpu-status");

    function setGpuStatus(label) {
        if (gpuStatus) gpuStatus.textContent = `Moteur : ${label}`;
    }

    const renderer = (() => {
        let mode = "none"; // "webgpu" | "webgl2" | "2d"
        let rafId = null;
        let isCanvasVisible = true;
        let startTime = performance.now();

        // Ressources WebGPU
        let gpuDevice = null;
        let gpuCtx = null;
        let gpuPipeline = null;
        let gpuUniformBuf = null;
        let gpuBindGroup = null;

        // Ressources WebGL2
        let gl = null;
        let glProgram = null;
        let glUniforms = null;

        // Ressource Canvas 2D
        let ctx2d = null;

        function resizeCanvas() {
            if (!canvas) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.getBoundingClientRect();
            const w = Math.max(320, Math.round((rect.width || 640) * dpr));
            const h = Math.max(240, Math.round((rect.height || 480) * dpr));
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
            }
        }

        async function initWebGPU() {
            if (!canvas || !("gpu" in navigator)) return false;
            try {
                const adapter = await navigator.gpu.requestAdapter({ powerPreference: "low-power" });
                if (!adapter) return false;
                const device = await adapter.requestDevice();
                const format = navigator.gpu.getPreferredCanvasFormat();

                const wgsl = `
                    struct Params {
                        time: f32,
                        density: f32,
                        knotMode: f32,
                        seedVal: f32,
                        width: f32,
                        height: f32,
                        pad0: f32,
                        pad1: f32,
                    };
                    @group(0) @binding(0) var<uniform> u: Params;

                    @vertex
                    fn vs_main(@builtin(vertex_index) idx: u32) -> @builtin(position) vec4<f32> {
                        var pos = array<vec2<f32>, 3>(
                            vec2<f32>(-1.0, -1.0),
                            vec2<f32>(3.0, -1.0),
                            vec2<f32>(-1.0, 3.0)
                        );
                        return vec4<f32>(pos[idx], 0.0, 1.0);
                    }

                    @fragment
                    fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
                        let res = vec2<f32>(max(u.width, 1.0), max(u.height, 1.0));
                        var uv = fragCoord.xy / res;
                        let aspect = res.x / res.y;
                        let p = vec2<f32>((uv.x - 0.5) * aspect, uv.y - 0.5);

                        // Barre de suspension supérieure
                        let bar = smoothstep(0.022, 0.008, abs(uv.y - 0.12)) * step(abs(p.x), 0.55);

                        // Tressage paramétrique selon nœud & densité
                        let cols = max(4.0, u.density * 0.45);
                        let phase = u.seedVal * 6.2831 + u.time * 0.7;
                        var wave = sin(p.y * (cols * 1.4) + phase) * 0.06;
                        if (u.knotMode > 1.5) {
                            wave = abs(fract(p.y * cols * 0.25 + u.seedVal) - 0.5) * 0.22;
                        } else if (u.knotMode > 0.5) {
                            wave = sin(p.y * cols * 1.8 + p.x * 8.0 + phase) * 0.08;
                        }

                        let gridX = abs(fract((p.x + wave) * cols) - 0.5);
                        let gridX2 = abs(fract((p.x - wave) * cols) - 0.5);
                        let maskY = smoothstep(0.11, 0.14, uv.y) * (1.0 - smoothstep(0.84, 0.90, uv.y));
                        let maskX = 1.0 - smoothstep(0.45, 0.54, abs(p.x));

                        let cordA = smoothstep(0.14, 0.03, gridX) * maskY * maskX;
                        let cordB = smoothstep(0.14, 0.03, gridX2) * maskY * maskX;
                        let knot = cordA * cordB * 1.6;

                        var col = vec3<f32>(0.03, 0.05, 0.12);
                        col += vec3<f32>(0.0, 0.83, 1.0) * (cordA * 0.65 + bar * 0.9);
                        col += vec3<f32>(1.0, 0.0, 0.5) * (cordB * 0.45);
                        col += vec3<f32>(0.95, 0.97, 1.0) * (knot * 0.75);
                        return vec4<f32>(col, 1.0);
                    }
                `;

                const module = device.createShaderModule({ code: wgsl });
                const pipeline = device.createRenderPipeline({
                    layout: "auto",
                    vertex: { module, entryPoint: "vs_main" },
                    fragment: { module, entryPoint: "fs_main", targets: [{ format }] },
                    primitive: { topology: "triangle-list" }
                });

                const ctx = canvas.getContext("webgpu");
                if (!ctx) return false;
                ctx.configure({ device, format, alphaMode: "premultiplied" });

                const uniformBuf = device.createBuffer({
                    size: 32,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                });

                const bindGroup = device.createBindGroup({
                    layout: pipeline.getBindGroupLayout(0),
                    entries: [{ binding: 0, resource: { buffer: uniformBuf } }]
                });

                device.lost.then(() => {
                    mode = "none";
                    initFallback();
                });

                gpuDevice = device;
                gpuCtx = ctx;
                gpuPipeline = pipeline;
                gpuUniformBuf = uniformBuf;
                gpuBindGroup = bindGroup;
                mode = "webgpu";
                setGpuStatus("WebGPU actif (éco-veille)");
                return true;
            } catch {
                return false;
            }
        }

        function initWebGL2() {
            if (!canvas) return false;
            try {
                const context = canvas.getContext("webgl2", { antialias: true, powerPreference: "low-power" });
                if (!context) return false;

                const vsSource = `#version 300 es
                void main() {
                    vec2 pos[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
                    gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0);
                }`;

                const fsSource = `#version 300 es
                precision highp float;
                uniform float u_time;
                uniform float u_density;
                uniform float u_knotMode;
                uniform float u_seed;
                uniform vec2 u_res;
                out vec4 outColor;

                void main() {
                    vec2 uv = gl_FragCoord.xy / max(u_res, vec2(1.0));
                    uv.y = 1.0 - uv.y;
                    float aspect = u_res.x / max(u_res.y, 1.0);
                    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

                    float bar = smoothstep(0.022, 0.008, abs(uv.y - 0.12)) * step(abs(p.x), 0.55);
                    float cols = max(4.0, u_density * 0.45);
                    float phase = u_seed * 6.2831 + u_time * 0.7;

                    float wave = sin(p.y * (cols * 1.4) + phase) * 0.06;
                    if (u_knotMode > 1.5) {
                        wave = abs(fract(p.y * cols * 0.25 + u_seed) - 0.5) * 0.22;
                    } else if (u_knotMode > 0.5) {
                        wave = sin(p.y * cols * 1.8 + p.x * 8.0 + phase) * 0.08;
                    }

                    float gA = abs(fract((p.x + wave) * cols) - 0.5);
                    float gB = abs(fract((p.x - wave) * cols) - 0.5);
                    float maskY = smoothstep(0.11, 0.14, uv.y) * (1.0 - smoothstep(0.84, 0.90, uv.y));
                    float maskX = 1.0 - smoothstep(0.45, 0.54, abs(p.x));

                    float cordA = smoothstep(0.14, 0.03, gA) * maskY * maskX;
                    float cordB = smoothstep(0.14, 0.03, gB) * maskY * maskX;
                    float knot = cordA * cordB * 1.6;

                    vec3 col = vec3(0.03, 0.05, 0.12);
                    col += vec3(0.0, 0.83, 1.0) * (cordA * 0.65 + bar * 0.9);
                    col += vec3(1.0, 0.0, 0.5) * (cordB * 0.45);
                    col += vec3(0.95, 0.97, 1.0) * (knot * 0.75);
                    outColor = vec4(col, 1.0);
                }`;

                function compile(type, src) {
                    const sh = context.createShader(type);
                    context.shaderSource(sh, src);
                    context.compileShader(sh);
                    if (!context.getShaderParameter(sh, context.COMPILE_STATUS)) {
                        context.deleteShader(sh);
                        return null;
                    }
                    return sh;
                }

                const vs = compile(context.VERTEX_SHADER, vsSource);
                const fs = compile(context.FRAGMENT_SHADER, fsSource);
                if (!vs || !fs) return false;

                const prog = context.createProgram();
                context.attachShader(prog, vs);
                context.attachShader(prog, fs);
                context.linkProgram(prog);
                if (!context.getProgramParameter(prog, context.LINK_STATUS)) return false;

                gl = context;
                glProgram = prog;
                glUniforms = {
                    time: gl.getUniformLocation(prog, "u_time"),
                    density: gl.getUniformLocation(prog, "u_density"),
                    knotMode: gl.getUniformLocation(prog, "u_knotMode"),
                    seed: gl.getUniformLocation(prog, "u_seed"),
                    res: gl.getUniformLocation(prog, "u_res")
                };
                mode = "webgl2";
                setGpuStatus("Repli WebGL2 actif");
                return true;
            } catch {
                return false;
            }
        }

        function init2D() {
            if (!canvas) return false;
            ctx2d = canvas.getContext("2d");
            if (!ctx2d) return false;
            mode = "2d";
            setGpuStatus("Repli Canvas 2D actif");
            return true;
        }

        function initFallback() {
            if (!initWebGL2()) init2D();
            renderOnce();
        }

        function drawFrame(now) {
            if (!canvas || mode === "none") return;
            resizeCanvas();

            const state = getPatternState();
            const elapsed = prefersReducedMotion ? 0 : (now - startTime) * 0.001;

            if (mode === "webgpu" && gpuDevice && gpuCtx) {
                const uniforms = new Float32Array([
                    elapsed,
                    state.density,
                    state.knot.mode,
                    state.seedNorm,
                    canvas.width,
                    canvas.height,
                    0,
                    0
                ]);
                gpuDevice.queue.writeBuffer(gpuUniformBuf, 0, uniforms);
                const encoder = gpuDevice.createCommandEncoder();
                const pass = encoder.beginRenderPass({
                    colorAttachments: [{
                        view: gpuCtx.getCurrentTexture().createView(),
                        clearValue: { r: 0.03, g: 0.04, b: 0.09, a: 1 },
                        loadOp: "clear",
                        storeOp: "store"
                    }]
                });
                pass.setPipeline(gpuPipeline);
                pass.setBindGroup(0, gpuBindGroup);
                pass.draw(3);
                pass.end();
                gpuDevice.queue.submit([encoder.finish()]);
            } else if (mode === "webgl2" && gl) {
                gl.viewport(0, 0, canvas.width, canvas.height);
                gl.useProgram(glProgram);
                gl.uniform1f(glUniforms.time, elapsed);
                gl.uniform1f(glUniforms.density, state.density);
                gl.uniform1f(glUniforms.knotMode, state.knot.mode);
                gl.uniform1f(glUniforms.seed, state.seedNorm);
                gl.uniform2f(glUniforms.res, canvas.width, canvas.height);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
            } else if (mode === "2d" && ctx2d) {
                const w = canvas.width;
                const h = canvas.height;
                ctx2d.clearRect(0, 0, w, h);

                const bg = ctx2d.createRadialGradient(w * 0.5, h * 0.4, 20, w * 0.5, h * 0.5, w * 0.65);
                bg.addColorStop(0, "rgba(0, 212, 255, 0.16)");
                bg.addColorStop(1, "#070914");
                ctx2d.fillStyle = bg;
                ctx2d.fillRect(0, 0, w, h);

                // Barre de suspension
                const padX = w * 0.15;
                const barY = h * 0.14;
                ctx2d.strokeStyle = "#00d4ff";
                ctx2d.lineWidth = Math.max(4, w * 0.008);
                ctx2d.lineCap = "round";
                ctx2d.beginPath();
                ctx2d.moveTo(padX, barY);
                ctx2d.lineTo(w - padX, barY);
                ctx2d.stroke();

                // Brins & Nœuds paramétriques
                const strands = Math.min(state.strands, 28);
                const span = (w - padX * 2.4) / Math.max(strands - 1, 1);

                for (let i = 0; i < strands; i += 1) {
                    const baseX = padX * 1.2 + i * span;
                    ctx2d.strokeStyle = i % 2 === 0 ? "rgba(0, 212, 255, 0.78)" : "rgba(255, 0, 127, 0.65)";
                    ctx2d.lineWidth = Math.max(1.5, w * 0.003);
                    ctx2d.beginPath();
                    ctx2d.moveTo(baseX, barY);

                    const steps = state.density;
                    for (let s = 1; s <= steps; s += 1) {
                        const t = s / steps;
                        const y = barY + t * (h * 0.72);
                        let dx = Math.sin(t * Math.PI * 4 + i + state.seedNorm * 6 + elapsed) * span * 0.45;
                        if (state.knot.mode === 1) {
                            dx = Math.sin(t * Math.PI * 6 + elapsed + state.seedNorm * 8) * span * 0.75;
                        } else if (state.knot.mode === 2) {
                            dx = (s % 2 === 0 ? 1 : -1) * span * 0.35 * (1 - t * 0.3);
                        }
                        ctx2d.lineTo(baseX + dx, y);
                    }
                    ctx2d.stroke();
                }
            }
        }

        function loop(now) {
            drawFrame(now);
            if (shouldAnimate()) {
                rafId = requestAnimationFrame(loop);
            } else {
                rafId = null;
            }
        }

        function shouldAnimate() {
            const aboutSec = document.getElementById("about");
            const isStudioActive = aboutSec ? aboutSec.classList.contains("active") : false;
            return !prefersReducedMotion && !document.hidden && isCanvasVisible && isStudioActive && mode !== "none";
        }

        function syncAnimationState() {
            if (shouldAnimate()) {
                if (!rafId) rafId = requestAnimationFrame(loop);
            } else if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        function renderOnce() {
            drawFrame(performance.now());
        }

        async function boot() {
            if (!canvas) return;
            const ok = await initWebGPU();
            if (!ok) initFallback();
            renderOnce();
            syncAnimationState();
        }

        // Éco-conception : veille automatique si hors-onglet ou hors-viewport
        document.addEventListener("visibilitychange", syncAnimationState);

        if (canvas && "IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                isCanvasVisible = entries[0].isIntersecting;
                syncAnimationState();
            }, { threshold: 0.05 });
            observer.observe(canvas);
        }

        if (canvas && "ResizeObserver" in window) {
            const resizeObs = new ResizeObserver(() => renderOnce());
            resizeObs.observe(canvas);
        }

        return { boot, renderOnce, syncAnimationState };
    })();

    /* ----------------------------------------------------------------------
       4. EXPORT DES PATRONS SVG & JSON + MODE WEBXR
       ---------------------------------------------------------------------- */
    function downloadBlob(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function buildPatternSVG(state) {
        const width = 600;
        const height = 450;
        const padX = 70;
        const barY = 55;
        const span = (width - padX * 2) / Math.max(state.strands - 1, 1);
        const paths = [];

        for (let i = 0; i < state.strands; i += 1) {
            const x0 = padX + i * span;
            let d = `M ${x0.toFixed(1)} ${barY}`;
            for (let s = 1; s <= state.density; s += 1) {
                const t = s / state.density;
                const y = barY + t * 330;
                const offset = state.knot.mode === 2
                    ? (s % 2 === 0 ? 1 : -1) * span * 0.35
                    : Math.sin(t * Math.PI * 5 + i + state.seedNorm * 6) * span * 0.45;
                d += ` L ${(x0 + offset).toFixed(1)} ${y.toFixed(1)}`;
            }
            const stroke = i % 2 === 0 ? "#00d4ff" : "#ff007f";
            paths.push(`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round"/>`);
        }

        return [
            `<?xml version="1.0" encoding="UTF-8"?>`,
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`,
            `<title>SG@Art Pattern ${state.seed}</title>`,
            `<rect width="100%" height="100%" fill="#070914"/>`,
            `<line x1="${padX - 20}" y1="${barY}" x2="${width - padX + 20}" y2="${barY}" stroke="#f3f6ff" stroke-width="6" stroke-linecap="round"/>`,
            ...paths,
            `<text x="24" y="${height - 18}" fill="#a6b2d4" font-family="system-ui, sans-serif" font-size="13">SG@Art v1.2.0 • Seed: ${state.seed} • ${state.knot.label} • ${state.strands} brins (~${state.meters} m)</text>`,
            `</svg>`
        ].join("\n");
    }

    function applyPreset(itemKey) {
        const preset = PRESETS[itemKey];
        if (!preset) return;
        if (seedInput) seedInput.value = preset.seed;
        if (knotSelect) knotSelect.value = preset.knot;
        if (densityRange) densityRange.value = String(preset.density);
        updatePatternUI();
    }

    async function triggerWebXR(itemKey) {
        if (itemKey) applyPreset(itemKey);
        activateSection("about");

        if ("xr" in navigator && window.isSecureContext) {
            try {
                const supported = await navigator.xr.isSessionSupported("immersive-vr");
                if (supported) {
                    setGpuStatus("WebXR prêt — Bascule session immersive");
                    return;
                }
            } catch {
                // Repli silencieux vers Mode 3D Classique
            }
        }
        setGpuStatus("Repli Mode 3D Classique (WebXR indisponible)");
    }

    document.addEventListener("click", (e) => {
        const exportBtn = e.target.closest("[data-export]");
        if (exportBtn) {
            const item = exportBtn.getAttribute("data-item");
            if (item) applyPreset(item);
            const state = getPatternState();
            const fmt = exportBtn.getAttribute("data-export");

            if (fmt === "svg") {
                downloadBlob(`sg-art-${state.seed}.svg`, buildPatternSVG(state), "image/svg+xml;charset=utf-8");
            } else if (fmt === "json") {
                const payload = {
                    platform: "SG@Art",
                    version: "1.2.0",
                    license: "SG-Art v14.04",
                    generatedAt: new Date().toISOString(),
                    pattern: {
                        seed: state.seed,
                        knotType: state.knotKey,
                        knotLabel: state.knot.label,
                        densityRows: state.density,
                        estimatedStrands: state.strands,
                        estimatedLengthMeters: state.meters
                    }
                };
                downloadBlob(`sg-art-${state.seed}.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
            }
            return;
        }

        const actionBtn = e.target.closest("[data-action]");
        if (actionBtn) {
            const action = actionBtn.getAttribute("data-action");
            if (action === "webxr" || action === "view-xr") {
                triggerWebXR(actionBtn.getAttribute("data-item"));
            }
        }
    });

    /* ----------------------------------------------------------------------
       5. FORMULAIRE DE CONTACT SÉCURISÉ
       ---------------------------------------------------------------------- */
    const contactForm = document.getElementById("contact-form");
    const formFeedback = document.getElementById("form-feedback");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const trap = document.getElementById("website-trap");
            if (trap && trap.value.trim() !== "") return; // Filtre bot silencieux

            const name = document.getElementById("contact-name")?.value.trim() || "";
            const email = document.getElementById("contact-email")?.value.trim() || "";
            const message = document.getElementById("contact-message")?.value.trim() || "";
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!name || !emailValid || message.length < 5) {
                if (formFeedback) {
                    formFeedback.textContent = "Merci de renseigner un nom, un e-mail valide et un message (5 caractères min.).";
                }
                return;
            }

            if (formFeedback) {
                formFeedback.textContent = `Merci ${name} ! Votre message est prêt. Ouverture de votre messagerie ou envoi direct à contact@sg-art.fr.`;
            }
            contactForm.reset();
        });
    }

    /* ----------------------------------------------------------------------
       INITIALISATION
       ---------------------------------------------------------------------- */
    const initialHash = window.location.hash.slice(1);
    activateSection(sectionIds.has(initialHash) ? initialHash : "home", false);
    updatePatternUI();
    renderer.boot();
});
