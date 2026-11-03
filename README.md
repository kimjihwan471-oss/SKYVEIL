# SKYVEIL 크루 면접 신청 사이트

첨부된 기존 HTML의 Firebase + Firestore 사용 방식을 바탕으로 새로 구성한 반응형 사이트입니다. 기존 플레이리스트 기능은 모집 사이트에 맞게 대체했습니다.

## 포함 파일
- `index.html` — 지원 페이지와 관리자 대시보드
- `firestore.rules` — 서버 측 Firestore 접근 제어 규칙
- `firebase.json` — Firebase Hosting 설정

## 1. Firebase 프로젝트 준비
1. Firebase Console에서 프로젝트를 만들거나 기존 프로젝트를 선택합니다.
2. **프로젝트 설정 → 내 앱 → 웹 앱**을 등록하고 웹 앱 설정값을 복사합니다.
3. `index.html`에서 `firebaseConfig`의 `YOUR_...` 값을 실제 값으로 교체합니다.
4. Firebase Console → **Authentication → Sign-in method**에서 이메일/비밀번호 로그인을 활성화합니다.
5. Authentication → Users에서 관리자 계정을 생성합니다. 이메일은 본인이 관리하는 주소로 정하고, 비밀번호는 요청한 `SKYVRIL2026`으로 설정할 수 있습니다. 실제 운영에서는 고유한 비밀번호를 권장합니다.
6. 생성한 관리자 계정의 **UID**를 복사합니다.
7. Firestore Database를 생성합니다.
8. `firestore.rules`의 `REPLACE_WITH_ADMIN_UID`를 관리자 UID로 교체합니다.

> 관리자 비밀번호를 HTML이나 JavaScript에 넣지 마세요. 비밀번호 인증은 Firebase Authentication에서 처리하고, 지원서 열람·수정·삭제 권한은 Firestore Rules가 서버 측에서 검사합니다. 관리자 UID를 규칙에 넣지 않으면 관리자도 지원서를 볼 수 없습니다.

## 2. 로컬에서 확인
브라우저에서 `index.html`을 직접 열기보다 간단한 로컬 서버를 사용하세요. VS Code의 Live Server 확장으로 폴더를 열고 `index.html`을 실행할 수 있습니다. Firebase 설정 및 Firestore Rules를 먼저 적용해야 제출과 로그인이 작동합니다.

## 3. Firebase CLI로 배포
Node.js가 설치된 PC에서 터미널을 열고 아래를 실행합니다.

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules,hosting
```

프로젝트 선택 과정에서 해당 Firebase 프로젝트를 연결합니다. 배포 후 터미널에 표시되는 Hosting URL로 접속합니다.

## 4. 보안 점검
- `firestore.rules`를 배포하기 전 관리자 UID를 실제 값으로 바꾸세요.
- 규칙을 바꾸면 `firebase deploy --only firestore:rules`로 다시 배포하세요.
- 지원서 조회는 로그인한 관리자 UID에만 허용됩니다. 일반 방문자는 새 지원서 생성만 가능하고, 기존 지원서 조회·수정·삭제는 거부됩니다.
- Firebase 웹 설정의 API 키는 브라우저에 노출되는 공개 식별자입니다. 보안 경계는 API 키가 아니라 Authentication과 Firestore Rules입니다.
- 스팸 방지가 필요하면 Firebase App Check 및 제출 제한을 추가로 설정하세요.
- 이 버전은 포트폴리오 URL을 저장하며 파일 업로드 기능은 포함하지 않습니다.
- 접수 완료 화면은 데이터가 Firestore에 저장된 후에만 표시됩니다.

## 5. 관리자 사용법
1. 사이트 하단 `ADMIN ACCESS`를 선택합니다.
2. Firebase Authentication에 만든 관리자 이메일과 비밀번호로 로그인합니다.
3. 지원자 검색, 상태 변경, 면접 일정 입력 후 `변경 저장`을 누릅니다.
4. 삭제는 되돌릴 수 없으므로 확인 창을 거친 후 실행됩니다.

## 참고
브라우저에서의 관리자 화면 숨김은 보안 기능이 아닙니다. 실제 접근 제어는 `firestore.rules`에서 적용합니다. 관리자 계정 UID가 규칙과 일치하지 않으면 조회·수정·삭제가 허용되지 않습니다.
