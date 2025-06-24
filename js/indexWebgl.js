gsap.registerPlugin(ScrollTrigger, SplitText);

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
  75, //시야각
  window.innerWidth / window.innerHeight,
  0.1, //near
  1000 //far
);

// 캔버스 생성
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  // 투명배경
  alpha: true,
});

// 배경 초기화, 투명도
renderer.setClearColor(0x000000, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// 그림자 촬성화
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
// 물리적 조명 보정
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// 밝기 보정
renderer.toneMappingExposure = 2.5;
document.querySelector(".model").appendChild(renderer.domElement);

// 조명
// 씬을 균일하게 밝히는 환경광
const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(ambientLight);

// 태양광같은 한 방향 주광
const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(5, 10, 7.5);
scene.add(mainLight);

// 보조광(그림자 어두움 조절)
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(-5, 0, -5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 하늘과 땅에서 동시에 오는 반구광(자연광 느낌)
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
hemiLight.position.set(0, 0, 0);
scene.add(hemiLight);

// 임시 루프
function basicAnimate() {
  renderer.render(scene, camera);
  requestAnimationFrame(basicAnimate);
}
basicAnimate();

// GLB 모델 로드
let model,
  modelGroup = new THREE.Group();
const loader = new THREE.GLTFLoader();
loader.load("./assets/glb/keyboard2.glb", function (gltf) {
  model = gltf.scene;

  model.traverse((node) => {
    if (node.isMesh) {
      if (node.material) {
        node.material.metalness = 0.3;
        node.material.roughness = 0.4;
        node.material.envMapIntensity = 1.5;
      }
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
  // 재질, 거칠기, 그림자 설정

  // 중심 맞추기 (바운딩 박스 계산)
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);

  // 그룹에 모델 넣기
  modelGroup.add(model);
  modelGroup.scale.set(0, 0, 0); // 그룹에 scale 애니메이션 적용
  //  90/Math.PI / 2, 45/Math.PI / 4, 30/Math.PI / 6
  modelGroup.rotation.set(Math.PI / 3, Math.PI / 6, 0);
  scene.add(modelGroup);

  // 모델 크기를 기반으로 카메라 z축 거리 자동 조절
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  camera.position.set(0, 0, maxDim * 2);
  camera.lookAt(0, 0, 0);

  // basicAnimate종료 메인 루프 전환
  cancelAnimationFrame(basicAnimate);
  animate();
});

// 현재 스코롤 위치 업데이트
lenis.on("scroll", (e) => {
  currentScroll = e.scroll;
});

// 둥둥 떠다니는 최대 높이(진폭)
const floatAmplitude = 0.1;
const floatSpeed = 1;
let isEasedOut = false;
let currentScroll = 0;
let isFloating = true;
// 고정 섹션
const footer = document.querySelector(".footer");
// 스코롤 기준점
const destination = footer.offsetTop;

function introAnimation() {
  gsap.to(modelGroup.scale, {
    x: 2,
    y: 2,
    z: 2,
    duration: 3,
    ease: "power2.out",
  });
}

// 왼 트리거 오 뷰포트
function outAnimation() {
  gsap.to(modelGroup.scale, {
    x: 0,
    y: 0,
    z: 0,
    duration: 1,
    ease: "power2.out",
  });
}

// 위아래 둥둥 애니메이션 루프
function animate() {
  if (modelGroup) {
    if (isFloating) {
      const floatOffset =
        // 부드러운 곡선 형태 값 -0.1 ~ +0.1
        Math.sin(Date.now() * 0.001 * floatSpeed) * floatAmplitude;
      // 포지션 계속 바꾸며 y축 위아래로
      modelGroup.position.y = floatOffset;
    }

    // 스코롤 진행도(현재 스코롤 위치 기준으로 바닥 위치까지 스코롤 진행률 0~1(%) 계산)
    const scrollProgress = Math.min(currentScroll / destination, 1);
    // 스코롤 진행도 100%이하 x축 1바퀴
    if (scrollProgress < 1) {
      // 초기 회전값을 리셋
      modelGroup.setRotationFromEuler(
        new THREE.Euler(Math.PI / 3, Math.PI / 6, 0)
      );
      // 화면상 X축 기준으로 회전 (상하)
      modelGroup.rotateOnWorldAxis(
        new THREE.Vector3(1, 0, 0),
        scrollProgress * Math.PI * 8
      );
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
