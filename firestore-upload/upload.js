const admin = require("firebase-admin");
const fs = require("fs");

// 서비스 계정 키
const serviceAccount = "./serviceAccountKey.json";

// Firebase 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// JSON 파일 읽기
const data = JSON.parse(fs.readFileSync("./projects.json", "utf-8"));

// 컬렉션 이름
const collectionName = "projects";

async function uploadAndVerifyProjects() {
  // 업로드
  for (const project of data) {
    await db.collection(collectionName).doc(project.id.toString()).set(project);
    console.log(`Uploaded project ${project.id}`);
  }

  console.log("All projects uploaded!");

  // 업로드 확인
  const snapshot = await db.collection(collectionName).get();
  console.log(`--- Uploaded Documents in "${collectionName}" Collection ---`);
  snapshot.forEach(doc => {
    console.log(doc.id, "=>", doc.data());
  });
}

uploadAndVerifyProjects().catch(err => console.error(err));