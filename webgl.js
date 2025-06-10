// Lenis + ScrollTrigger 연동
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
// gsap 타이밍 lenis frame(raf) 동기화
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
// 더 정밀한 렌더링
gsap.ticker.lagSmoothing(0);

// Scene, Camera, Renderer 기본 셋업
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 초기 카메라 위치
camera.position.set(0, 1, 5);
scene.add(camera);

// 캔버스 생성
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

// 배경 초기화
renderer.setClearColor(0xffffff, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// 그림자 촬성화
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
// 물리적 조명 보정
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.querySelector(".vdu").appendChild(renderer.domElement);
document.querySelector(".keyboard").appendChild(renderer.domElement);
document.querySelector(".mouse").appendChild(renderer.domElement);

// 조명
// 씬을 균일하게 밝히는 환경광
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
ambientLight.position.set(5, 10, 7.5);
scene.add(ambientLight);

// 태양광같은 한 방향 주광
const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(5, 10, 7.5);
scene.add(mainLight);

// 보조광
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(-5, 0, -5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 하늘과 땅에서 동시에 오는 반구광(자연광 느낌)
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
hemiLight.position.set(0, 25, 0);
scene.add(hemiLight);

// 바닥 (그림자 확인용)
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.ShadowMaterial({ opacity: 0.3 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// GLB 모델 로드
const loader = new THREE.GLTFLoader();
let vdu;
loader.load("./assets/glb/vdu.glb", (gltf) => {
  vdu = gltf.scene;
  vdu.traverse((child) => {
    if (child.isMesh) {
      if (child.material) {
        child.material.metalness = 0.3;
        child.material.roughness = 0.4;
        child.material.envMapIntensity = 1.5;
      }
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  // 재질, 거칠기, 그림자 설정

  // 크기 설정
  vdu.scale.set(0.5, 0.5, 0.5);

  // 바운딩 박스 계산 모델 중심 배치
  const box = new THREE.Box3().setFromObject(vdu);
  const center = box.getCenter(new THREE.Vector3());
  vdu.position.sub(center);
  //   vdu.rotation.set(0.2, Math.PI, 0);
  scene.add(vdu);

  // 모델 크기를 기반으로 카메라 z축 거리 자동 조절
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  camera.position.z = maxDim * 1.5;

  // 모니터 GSAP 등장 애니메이션
  gsap.to(vdu.scale, {
    x: 0.5,
    y: 0.5,
    z: 0.5,
    duration: 1,
    ease: "power2.out",
  });

  // 둥둥 애니메이션
  animate();
});

// 현재 스코롤 위치 업데이트
lenis.on("scroll", (e) => {
  currentScroll = e.scroll;
});

const floatAmplitude = 0.2;
const floatSpeed = 1.5;
const rotationSpeed = 0.3;
let isFloating = true;
let currentScroll = 0;

const stickyHeight = window.innerHeight;
const footer = document.querySelector(".footer");
const Destination = footer.offsetTop;

// 위아래 둥둥 애니메이션 루프
function animate() {
  if (vdu) {
    if (isFloating) {
      const floatOffset =
        // 부드러운 곡선 형태 값 -0.2 ~ +0.2
        Math.sin(Date.now() * 0.001 * floatSpeed) * floatAmplitude;
      // 포지션 계속 바꾸며 y축 위아래로
      vdu.position.y = floatOffset;
    }

    // 스코롤 진행도(현재 스코롤 위치 기준으로 섹션 시작 위치까지 스코롤 진행률 0~1(%) 계산)
    const scrollProgress = Math.min(currentScroll / Destination, 1);

    // 스코롤 진행도 100%이하 x축 1바퀴
    if (scrollProgress < 1) {
      vdu.rotation.x = scrollProgress * Math.PI * 2;
    }

    // 푸터까지 오른쪽 방향으로 조금씩 회전
    if (scrollProgress < 1) {
      vdu.rotation.y += 0.001 * rotationSpeed;
    }
  }

  // 장면 렌더링 업데이트 매끄러운 실시간 애니메이션
  renderer.render(scene, camera);
  // 다음 프레임 예약
  requestAnimationFrame(animate);
}

// 반응형
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
