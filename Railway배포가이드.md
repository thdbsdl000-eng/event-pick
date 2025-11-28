# Railway 배포 가이드

Railway를 사용하여 EventBanner AI를 배포하는 방법입니다.

## 🚂 Railway란?

Railway는 개발자를 위한 클라우드 플랫폼으로, GitHub 저장소를 연결하면 자동으로 배포해줍니다.

## 📋 배포 전 준비사항

1. ✅ GitHub 저장소 생성 완료: https://github.com/thdbsdl000-eng/event-pick.git
2. ✅ 프로젝트 빌드 성공 확인
3. ✅ Google Gemini API 키 준비

## 🚀 배포 단계

### 1단계: GitHub에 코드 업로드

#### 방법 A: Git 명령어 사용 (터미널)

1. **Git 초기화** (아직 안 했다면)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **GitHub 저장소 연결**
   ```bash
   git remote add origin https://github.com/thdbsdl000-eng/event-pick.git
   git branch -M main
   git push -u origin main
   ```

#### 방법 B: GitHub Desktop 사용 (더 쉬움)

1. GitHub Desktop 다운로드: https://desktop.github.com
2. GitHub Desktop 실행
3. "File" → "Add Local Repository"
4. 프로젝트 폴더 선택: `C:\Users\82109\Desktop\event pick`
5. 왼쪽 하단에 변경사항 확인
6. "Commit to main" 클릭 (메시지 입력: "Initial commit")
7. "Publish repository" 클릭

### 2단계: Railway 계정 만들기

1. **Railway 접속**
   - https://railway.app 접속
   - "Start a New Project" 클릭

2. **로그인**
   - "Login with GitHub" 클릭
   - GitHub 계정으로 로그인

### 3단계: 프로젝트 배포

1. **새 프로젝트 생성**
   - Railway 대시보드에서 "New Project" 클릭
   - "Deploy from GitHub repo" 선택
   - `thdbsdl000-eng/event-pick` 저장소 선택

2. **자동 배포 시작**
   - Railway가 자동으로 프로젝트를 감지합니다
   - Next.js 프로젝트로 자동 설정됩니다

3. **환경 변수 설정** (중요!)
   - 프로젝트 대시보드에서 "Variables" 탭 클릭
   - "New Variable" 클릭
   - 다음 변수 추가:
     - **Variable**: `GEMINI_API_KEY`
     - **Value**: Google Gemini API 키 (`.env.local`에 있는 값)
   - "Add" 클릭

4. **도메인 설정** (선택사항)
   - "Settings" → "Generate Domain" 클릭
   - 자동으로 도메인이 생성됩니다 (예: `event-pick-production.up.railway.app`)
   - 또는 커스텀 도메인을 연결할 수 있습니다

5. **배포 완료 대기**
   - 배포가 진행되는 동안 로그를 확인할 수 있습니다
   - 보통 2-5분 정도 소요됩니다
   - "Deployments" 탭에서 배포 상태 확인

### 4단계: 배포 확인

1. Railway 대시보드에서 생성된 도메인 확인
2. 브라우저에서 해당 URL로 접속
3. 사이트가 정상적으로 작동하는지 확인

## ⚙️ Railway 설정

### 자동 빌드 설정

Railway는 자동으로 다음을 감지합니다:
- **Framework**: Next.js
- **Build Command**: `npm run build` (자동)
- **Start Command**: `npm start` (자동)
- **Output Directory**: `.next` (자동)

### 환경 변수 관리

Railway 대시보드에서 환경 변수를 쉽게 관리할 수 있습니다:
- 프로덕션, 스테이징, 개발 환경별로 설정 가능
- 변수 값은 암호화되어 안전하게 저장됩니다

## 🔧 문제 해결

### 빌드 실패 시

1. **로그 확인**
   - Railway 대시보드 → "Deployments" → 실패한 배포 클릭
   - 로그를 확인하여 오류 원인 파악

2. **일반적인 문제**
   - 환경 변수가 설정되지 않음 → Variables 탭에서 확인
   - 의존성 설치 실패 → `package.json` 확인
   - 빌드 오류 → 로컬에서 `npm run build` 실행하여 확인

### API 호출 실패 시

1. **환경 변수 확인**
   - `GEMINI_API_KEY`가 올바르게 설정되었는지 확인
   - 변수 이름이 정확한지 확인 (대소문자 구분)

2. **API 키 유효성 확인**
   - Google AI Studio에서 API 키가 활성화되어 있는지 확인
   - API 할당량이 충분한지 확인

### 배포가 느릴 때

- Railway는 무료 플랫폼이므로 처음 배포 시 시간이 걸릴 수 있습니다
- 보통 2-5분 정도 소요됩니다
- 배포가 완료되면 로그에 "Build successful" 메시지가 표시됩니다

## 💰 Railway 요금제

- **Hobby 플랜**: 무료 (월 $5 크레딧 제공)
- **Pro 플랜**: $20/월 (더 많은 리소스)

대부분의 경우 Hobby 플랜으로 충분합니다!

## 📝 추가 팁

### 자동 배포 설정

- GitHub에 코드를 푸시하면 자동으로 재배포됩니다
- Pull Request를 만들면 미리보기 배포가 생성됩니다

### 로그 확인

- Railway 대시보드 → "Deployments" → 배포 클릭
- 실시간 로그를 확인할 수 있습니다

### 커스텀 도메인

- "Settings" → "Domains"에서 커스텀 도메인 연결 가능
- 무료 SSL 인증서 자동 제공

## 🎉 배포 완료!

배포가 완료되면:
- ✅ HTTPS 자동 적용
- ✅ 전 세계 어디서나 접속 가능
- ✅ 자동 재배포 (GitHub 푸시 시)
- ✅ 무료 SSL 인증서

## 📞 도움이 필요하면

배포 중 문제가 발생하면:
1. Railway 로그 확인
2. 오류 메시지 확인
3. 필요하면 다시 질문해주세요!

