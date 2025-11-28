# Git 설치 및 GitHub 업로드

## Git 설치 방법

1. **Git 다운로드**
   - https://git-scm.com/download/win 접속
   - "Download for Windows" 클릭
   - 다운로드된 파일 실행

2. **설치 과정**
   - "Next" 버튼을 계속 클릭 (기본 설정으로 설치)
   - "Git from the command line and also from 3rd-party software" 선택
   - 나머지는 기본 설정 유지
   - 설치 완료

3. **PowerShell 재시작**
   - 현재 PowerShell 창을 닫고 새로 열기
   - 또는 컴퓨터 재시작

## 설치 확인

PowerShell에서 다음 명령어 실행:
```bash
git --version
```

버전 번호가 나오면 설치 완료!

## GitHub 업로드 명령어

Git 설치 후 다음 명령어를 순서대로 실행하세요:

```bash
cd "C:\Users\82109\Desktop\event pick"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/thdbsdl000-eng/event-pick.git
git push -u origin main
```

## 대안: GitHub Desktop 사용

Git 설치가 어렵다면 GitHub Desktop을 사용하세요:
- https://desktop.github.com
- 더 쉬운 GUI 인터페이스
- 자세한 방법은 `GitHub업로드가이드.md` 참고

