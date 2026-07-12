import * as THREE from "three";

const SMOKE_TEXTURE_URL = "/textures/smoke-element.png";
const MOBILE_BREAKPOINT_PX = 640;
const MOBILE_SMOKE_PARTICLE_COUNT = 70;
const DESKTOP_SMOKE_PARTICLE_COUNT = 150;

type SmokeScene = {
  camera: THREE.PerspectiveCamera;
  clock: THREE.Clock;
  cubeSineDriver: number;
  delta: number;
  frameId: number | null;
  geometry: THREE.BoxGeometry;
  light: THREE.DirectionalLight;
  material: THREE.MeshLambertMaterial;
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial>;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  smokeGeo: THREE.PlaneGeometry;
  smokeMaterial: THREE.MeshLambertMaterial;
  smokeParticles: Array<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshLambertMaterial>>;
  smokeTexture: THREE.Texture;
};

export function mountCanvas(host: HTMLDivElement) {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin("");

  const sceneState = initScene(host, textureLoader.load(SMOKE_TEXTURE_URL));

  const animate = () => {
    sceneState.delta = sceneState.clock.getDelta();
    sceneState.frameId = requestAnimationFrame(animate);
    evolveSmoke(sceneState);
    renderScene(sceneState);
  };

  const onWindowResize = () => {
    const width = host.clientWidth || window.innerWidth;
    const height = host.clientHeight || window.innerHeight;

    sceneState.camera.aspect = width / height;
    sceneState.camera.updateProjectionMatrix();
    sceneState.renderer.setSize(width, height);
  };

  animate();
  window.addEventListener("resize", onWindowResize);

  return () => {
    if (sceneState.frameId !== null) {
      cancelAnimationFrame(sceneState.frameId);
    }

    window.removeEventListener("resize", onWindowResize);

    sceneState.geometry.dispose();
    sceneState.material.dispose();
    sceneState.smokeGeo.dispose();
    sceneState.smokeMaterial.dispose();
    sceneState.smokeTexture.dispose();
    sceneState.renderer.dispose();
    sceneState.renderer.domElement.remove();
  };
}

function initScene(
  host: HTMLDivElement,
  smokeTexture: THREE.Texture,
): SmokeScene {
  const width = host.clientWidth || window.innerWidth;
  const height = host.clientHeight || window.innerHeight;
  const clock = new THREE.Clock();
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(width, height);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
  camera.position.z = 1000;
  scene.add(camera);

  const geometry = new THREE.BoxGeometry(200, 200, 200);
  const material = new THREE.MeshLambertMaterial({
    color: 0xaa6666,
    wireframe: false,
  });
  const mesh = new THREE.Mesh(geometry, material);

  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(-1, 0, 1);
  scene.add(light);

  const smokeMaterial = new THREE.MeshLambertMaterial({
    color: 0x706065,
    map: smokeTexture,
    transparent: true,
  });
  const smokeGeo = new THREE.PlaneGeometry(300, 300);
  const smokeParticles = createSmokeParticles(
    scene,
    smokeGeo,
    smokeMaterial,
    width <= MOBILE_BREAKPOINT_PX
      ? MOBILE_SMOKE_PARTICLE_COUNT
      : DESKTOP_SMOKE_PARTICLE_COUNT,
  );

  host.appendChild(renderer.domElement);

  return {
    camera,
    clock,
    cubeSineDriver: 0,
    delta: 0,
    frameId: null,
    geometry,
    light,
    material,
    mesh,
    renderer,
    scene,
    smokeGeo,
    smokeMaterial,
    smokeParticles,
    smokeTexture,
  };
}

function createSmokeParticles(
  scene: THREE.Scene,
  smokeGeo: THREE.PlaneGeometry,
  smokeMaterial: THREE.MeshLambertMaterial,
  particleCount: number,
) {
  const smokeParticles: Array<
    THREE.Mesh<THREE.PlaneGeometry, THREE.MeshLambertMaterial>
  > = [];

  for (let index = 0; index < particleCount; index += 1) {
    const particle = new THREE.Mesh(smokeGeo, smokeMaterial);
    particle.position.set(
      Math.random() * 500 - 250,
      Math.random() * 500 - 250,
      Math.random() * 1000 - 100,
    );
    particle.rotation.z = Math.random() * 360;
    scene.add(particle);
    smokeParticles.push(particle);
  }

  return smokeParticles;
}

function evolveSmoke(sceneState: SmokeScene) {
  for (const particle of sceneState.smokeParticles) {
    particle.rotation.z += sceneState.delta * 0.2;
  }
}

function renderScene(sceneState: SmokeScene) {
  sceneState.mesh.rotation.x += 0.005;
  sceneState.mesh.rotation.y += 0.01;
  sceneState.cubeSineDriver += 0.01;
  sceneState.mesh.position.z = 100 + Math.sin(sceneState.cubeSineDriver) * 500;
  sceneState.renderer.render(sceneState.scene, sceneState.camera);
}
