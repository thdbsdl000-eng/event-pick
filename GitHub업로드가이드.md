# GitHub에 코드 업로드 가이드

Railway 배포를 위해 먼저 GitHub에 코드를 업로드해야 합니다.

## 🎯 가장 쉬운 방법: GitHub Desktop 사용

### 1단계: GitHub Desktop 설치

1. **GitHub Desktop 다운로드**
   - https://desktop.github.com 접속
   - "Download for Windows" 클릭
   - 설치 파일 실행

2. **GitHub 계정 연결**
   - GitHub Desktop 실행
   - "Sign in to GitHub.com" 클릭
   - GitHub 계정으로 로그인

### 2단계: 저장소 연결

1. **로컬 저장소 추가**
   - GitHub Desktop에서 "File" → "Add Local Repository" 클릭
   - "Choose..." 버튼 클릭
   - 프로젝트 폴더 선택: `C:\Users\82109\Desktop\event pick`
   - "Add repository" 클릭

2. **변경사항 확인**
   - 왼쪽 패널에 모든 파일이 표시됩니다
   - "Summary"에 커밋 메시지 입력: "Initial commit"
   - "Commit to main" 버튼 클릭

3. **GitHub에 업로드**
   - 상단 메뉴에서 "Repository" → "Push origin" 클릭
   - 또는 "Publish repository" 버튼이 보이면 클릭
   - 저장소 이름: `event-pick` (이미 만들어진 저장소)
   - "Push" 또는 "Publish" 클릭

### 3단계: 확인

1. 브라우저에서 https://github.com/thdbsdl000-eng/event-pick 접속
2. 파일들이 업로드되었는지 확인

---

## 🔧 대안: Git 명령어 사용 (Git 설치 필요)

### Git 설치

1. **Git 다운로드**
   - https://git-scm.com/download/win 접속
   - "Download for Windows" 클릭
   - 설치 파일 실행 (기본 설정으로 설치)

2. **PowerShell 재시작**
   - Git 설치 후 PowerShell을 닫고 다시 열기

3. **Git 초기화 및 업로드**
   ```bash
   cd "C:\Users\82109\Desktop\event pick"
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/thdbsdl000-eng/event-pick.git
   git push -u origin main
   ```

---

## ⚠️ 주의사항

### .env.local 파일은 업로드하지 않기

`.env.local` 파일은 `.gitignore`에 포함되어 있어 자동으로 제외됩니다.
하지만 확인해보세요:
- GitHub에 업로드된 파일 목록에서 `.env.local`이 없는지 확인
- 만약 있다면 즉시 삭제하고 GitHub에서도 삭제하세요

### API 키 보안

- 절대 `.env.local` 파일을 GitHub에 업로드하지 마세요
- Railway에서는 환경 변수로 설정합니다

---

## ✅ 다음 단계

GitHub에 코드가 업로드되면:
1. `Railway배포가이드.md` 파일을 참고하여 Railway 배포 진행
2. Railway에서 환경 변수 `GEMINI_API_KEY` 설정
3. 배포 완료!

