export class ItemDetailComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getStatusBadgeClass(status) {
        if (status === 'Success') return 'badge-success-custom';
        if (status === 'Failure') return 'badge-failure-custom';
        return 'badge-partial-custom';
    }

    getHTML(data) {
        const statusClass = this.getStatusBadgeClass(data.status);
        return `
        <div class="card detail-card">
            <div class="row g-0">
                <div class="col-md-6">
                    <div class="detail-card__media-wrap">
                        <img
                            src="${data.src}"
                            class="detail-card__img img-fluid"
                            alt="${data.title}"
                            id="detail-img"
                        />
                        <div class="detail-card__model-viewer" id="three-container">
                            <div class="model-loader" id="model-loader">
                                <div class="model-loader__spinner"></div>
                                <span class="model-loader__text">Loading 3D Model…</span>
                            </div>
                            <canvas id="three-canvas"></canvas>
                            <div class="model-controls-hint">
                                <span>🖱 Drag to rotate · Scroll to zoom</span>
                            </div>
                        </div>
                        <div class="media-toggle-bar">
                            <button class="media-toggle-btn active" id="toggle-img">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                Photo
                            </button>
                            <button class="media-toggle-btn" id="toggle-3d">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                                3D Model
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card-body detail-card__body d-flex flex-column gap-3 h-100 p-4">
                        <div>
                            <span class="badge badge-category">${data.category}</span>
                        </div>
                        <h2 class="card-title detail-card__title">${data.title}</h2>

                        <div class="d-flex gap-4 flex-wrap">
                            <div class="detail-card__meta-item">
                                <span class="detail-card__meta-label">Year</span>
                                <strong class="detail-card__meta-value">${data.year}</strong>
                            </div>
                            <div class="detail-card__meta-item">
                                <span class="detail-card__meta-label">Status</span>
                                <span class="badge ${statusClass} mt-1" style="font-size:13px;padding:5px 12px;">${data.status}</span>
                            </div>
                            <div class="detail-card__meta-item">
                                <span class="detail-card__meta-label">Mission ID</span>
                                <strong class="detail-card__meta-value">#${String(data.id).padStart(3, '0')}</strong>
                            </div>
                        </div>

                        <hr class="border-secondary" />
                        <p class="card-text detail-card__text">${data.fullDescription}</p>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    initThreeJS() {
        const container = document.getElementById('three-container');
        const canvas = document.getElementById('three-canvas');
        const loader = document.getElementById('model-loader');
        if (!container || !canvas) return;

        const THREE = window.THREE;
        const { GLTFLoader } = window.THREE_GLTF;
        const { OrbitControls } = window.THREE_ORBIT;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a1a);

        // Stars background
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1200;
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i++) {
            starPositions[i] = (Math.random() - 0.5) * 200;
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 });
        scene.add(new THREE.Points(starGeometry, starMaterial));

        // Camera
        const w = container.clientWidth;
        const h = container.clientHeight;
        const camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 1000);
        camera.position.set(0, 1.5, 5);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x334466, 2);
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xfff0e0, 4);
        sunLight.position.set(5, 8, 3);
        scene.add(sunLight);

        const fillLight = new THREE.DirectionalLight(0x4488ff, 1.5);
        fillLight.position.set(-5, 2, -3);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xff8844, 1);
        rimLight.position.set(0, -3, -5);
        scene.add(rimLight);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
        controls.minDistance = 1;
        controls.maxDistance = 20;

        // Load GLB model (public SpaceX Falcon 9 from Sketchfab CDN via raw GitHub)
        const gltfLoader = new GLTFLoader();
        const modelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb';

        // Use a NASA/SpaceX-themed model — Sketchfab embed not feasible in vanilla,
        // so we procedurally create a Falcon 9-like rocket if no hosted GLB is available
        this._buildProceduralRocket(scene, THREE, loader);

        // Animate
        let animId;
        const animate = () => {
            animId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Resize
        const resizeObserver = new ResizeObserver(() => {
            const nw = container.clientWidth;
            const nh = container.clientHeight;
            camera.aspect = nw / nh;
            camera.updateProjectionMatrix();
            renderer.setSize(nw, nh);
        });
        resizeObserver.observe(container);

        // Cleanup on toggle away
        this._threeCleanup = () => {
            cancelAnimationFrame(animId);
            resizeObserver.disconnect();
            renderer.dispose();
        };
    }

    _buildProceduralRocket(scene, THREE, loaderEl) {
        const group = new THREE.Group();

        // Materials
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xdce8f0, metalness: 0.4, roughness: 0.3 });
        const darkMat  = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.6, roughness: 0.4 });
        const accentMat= new THREE.MeshStandardMaterial({ color: 0x0066cc, metalness: 0.5, roughness: 0.3 });
        const engineMat= new THREE.MeshStandardMaterial({ color: 0x888898, metalness: 0.8, roughness: 0.2 });
        const nozzleMat= new THREE.MeshStandardMaterial({ color: 0x333344, metalness: 0.9, roughness: 0.15 });
        const flameMat = new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff3300, emissiveIntensity: 2, transparent: true, opacity: 0.85 });

        // First stage body
        const bodyGeo = new THREE.CylinderGeometry(0.38, 0.38, 3.8, 32);
        const body = new THREE.Mesh(bodyGeo, whiteMat);
        group.add(body);

        // SpaceX stripe on first stage
        const stripeGeo = new THREE.CylinderGeometry(0.385, 0.385, 0.18, 32);
        const stripe1 = new THREE.Mesh(stripeGeo, accentMat);
        stripe1.position.y = 1.0;
        group.add(stripe1);
        const stripe2 = new THREE.Mesh(stripeGeo, darkMat);
        stripe2.position.y = -0.3;
        group.add(stripe2);

        // Interstage (dark ring)
        const interGeo = new THREE.CylinderGeometry(0.39, 0.39, 0.22, 32);
        const inter = new THREE.Mesh(interGeo, darkMat);
        inter.position.y = 1.95;
        group.add(inter);

        // Second stage body
        const s2Geo = new THREE.CylinderGeometry(0.38, 0.38, 1.6, 32);
        const s2 = new THREE.Mesh(s2Geo, whiteMat);
        s2.position.y = 2.87;
        group.add(s2);

        // Dragon capsule (cone + cylinder)
        const capsuleGeo = new THREE.CylinderGeometry(0.28, 0.38, 0.55, 32);
        const capsule = new THREE.Mesh(capsuleGeo, darkMat);
        capsule.position.y = 3.95;
        group.add(capsule);

        const noseGeo = new THREE.ConeGeometry(0.28, 0.65, 32);
        const nose = new THREE.Mesh(noseGeo, accentMat);
        nose.position.y = 4.55;
        group.add(nose);

        // Landing legs (4 fins)
        for (let i = 0; i < 4; i++) {
            const legGeo = new THREE.BoxGeometry(0.06, 0.9, 0.22);
            const leg = new THREE.Mesh(legGeo, darkMat);
            const angle = (i / 4) * Math.PI * 2;
            leg.position.set(Math.cos(angle) * 0.42, -2.15, Math.sin(angle) * 0.42);
            leg.rotation.y = angle;
            leg.rotation.z = Math.cos(angle) * 0.35;
            leg.rotation.x = Math.sin(angle) * 0.35;
            group.add(leg);
        }

        // Grid fins (4 top fins)
        for (let i = 0; i < 4; i++) {
            const finGeo = new THREE.BoxGeometry(0.28, 0.28, 0.04);
            const fin = new THREE.Mesh(finGeo, darkMat);
            const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
            fin.position.set(Math.cos(angle) * 0.44, 1.6, Math.sin(angle) * 0.44);
            fin.rotation.y = angle;
            group.add(fin);
        }

        // Engine cluster (9 Merlin engines, 3-3-3 pattern)
        const enginePositions = [
            [0, 0], [0.22, 0], [-0.22, 0],
            [0.11, 0.19], [-0.11, 0.19], [0.11, -0.19], [-0.11, -0.19],
            [0.22, 0.19], [-0.22, -0.19]
        ];
        enginePositions.slice(0, 9).forEach(([ex, ez]) => {
            const engGeo = new THREE.CylinderGeometry(0.06, 0.055, 0.2, 12);
            const eng = new THREE.Mesh(engGeo, engineMat);
            eng.position.set(ex, -2.12, ez);
            group.add(eng);

            const nozzleGeo = new THREE.ConeGeometry(0.07, 0.22, 12);
            const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
            nozzle.position.set(ex, -2.38, ez);
            nozzle.rotation.z = Math.PI;
            group.add(nozzle);
        });

        // Exhaust flame plumes
        enginePositions.slice(0, 9).forEach(([ex, ez]) => {
            const flameGeo = new THREE.ConeGeometry(0.06, 0.5, 12);
            const flame = new THREE.Mesh(flameGeo, flameMat);
            flame.position.set(ex, -2.85, ez);
            flame.rotation.z = Math.PI;
            group.add(flame);
        });

        // Flicker animation data on group
        group.userData.flames = group.children.filter(c => c.material === flameMat);

        // Center group
        group.position.y = -1.2;
        scene.add(group);

        // Animate flames flickering
        const originalAnimate = this._animateFlames;
        let t = 0;
        const flicker = () => {
            t += 0.08;
            group.userData.flames.forEach((f, i) => {
                f.scale.y = 0.85 + 0.3 * Math.sin(t + i * 0.9);
                f.material.opacity = 0.7 + 0.25 * Math.sin(t * 1.3 + i);
            });
            requestAnimationFrame(flicker);
        };
        flicker();

        // Hide loader
        if (loaderEl) loaderEl.style.display = 'none';
    }

    initToggle() {
        const imgEl  = document.getElementById('detail-img');
        const model  = document.getElementById('three-container');
        const btnImg = document.getElementById('toggle-img');
        const btn3d  = document.getElementById('toggle-3d');

        if (!imgEl || !model || !btnImg || !btn3d) return;

        let threeInited = false;

        btnImg.addEventListener('click', () => {
            imgEl.style.display = '';
            model.style.display = 'none';
            btnImg.classList.add('active');
            btn3d.classList.remove('active');
        });

        btn3d.addEventListener('click', () => {
            imgEl.style.display = 'none';
            model.style.display = 'block';
            btn3d.classList.add('active');
            btnImg.classList.remove('active');

            if (!threeInited) {
                threeInited = true;
                // Wait two frames so browser applies display:block and container
                // gets real clientWidth/clientHeight before WebGL renderer is created.
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    this._loadThreeDeps()
                        .then(() => this.initThreeJS())
                        .catch(err => {
                            console.error('[3D] Failed to load Three.js dependencies:', err);
                            const loader = document.getElementById('model-loader');
                            if (loader) loader.innerHTML = '<span style="color:#ff6666;padding:20px;display:block;text-align:center">⚠️ Could not load 3D engine. Check your internet connection.</span>';
                        });
                }));
            }
        });
    }

    _loadThreeDeps() {
        return new Promise((resolve, reject) => {
            if (window.THREE && window.THREE_GLTF && window.THREE_ORBIT) {
                resolve(); return;
            }

            const loadScript = (src) => new Promise((res, rej) => {
                const s = document.createElement('script');
                s.src = src;
                s.onload = res;
                s.onerror = () => rej(new Error('Failed to load: ' + src));
                document.head.appendChild(s);
            });

            // Use r134 — stable version where GLTFLoader and OrbitControls
            // correctly attach themselves to the THREE global after loading
            const BASE = 'https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js';
            const GLTF = 'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/loaders/GLTFLoader.js';
            const ORBIT = 'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/controls/OrbitControls.js';

            loadScript(BASE)
                .then(() => loadScript(GLTF))
                .then(() => loadScript(ORBIT))
                .then(() => {
                    window.THREE_GLTF  = { GLTFLoader:    window.THREE.GLTFLoader };
                    window.THREE_ORBIT = { OrbitControls: window.THREE.OrbitControls };

                    if (!window.THREE_GLTF.GLTFLoader) {
                        console.error('[3D] GLTFLoader not found on THREE global after load');
                    }
                    if (!window.THREE_ORBIT.OrbitControls) {
                        console.error('[3D] OrbitControls not found on THREE global after load');
                    }
                    resolve();
                })
                .catch(reject);
        });
    }

    render(data) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
        this.initToggle();
    }
}
