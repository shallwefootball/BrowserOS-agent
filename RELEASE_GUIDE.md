# Release Guide

이 프로젝트는 GitHub Actions를 통해 자동으로 빌드 및 릴리즈를 생성합니다.

## 새 버전 릴리즈 방법

### 1. 코드 변경사항 커밋

```bash
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin main
```

### 2. 버전 태그 생성 및 푸시

```bash
# 버전 태그 생성 (예: v0.2.0)
git tag v0.2.0

# 태그 푸시
git push origin v0.2.0
```

### 3. 자동 빌드 및 릴리즈 생성

태그를 푸시하면 자동으로:
1. GitHub Actions가 실행됩니다
2. `yarn build`로 프로젝트를 빌드합니다
3. `dist` 폴더를 zip으로 압축합니다
4. GitHub Release를 생성하고 zip 파일을 첨부합니다

### 4. 릴리즈 확인

https://github.com/shallwefootball/BrowserOS-agent/releases 에서 확인할 수 있습니다.

## 버전 번호 규칙

[Semantic Versioning](https://semver.org/) 사용:
- **v1.0.0** - Major 버전 (Breaking changes)
- **v0.2.0** - Minor 버전 (새로운 기능)
- **v0.1.1** - Patch 버전 (버그 수정)

## 사용자 설치 방법

릴리즈 페이지에서:

1. 최신 릴리즈의 `browseros-agent-vX.X.X.zip` 다운로드
2. 압축 해제
3. BrowserOS를 `browseros-dev`로 실행
4. `chrome://extensions` 접속
5. "개발자 모드" 활성화
6. "압축해제된 확장 프로그램 로드" 클릭
7. 압축 해제한 폴더 선택

## 수동 릴리즈 (옵션)

GitHub Actions 페이지에서:
1. "Build and Release" 워크플로우 선택
2. "Run workflow" 클릭
3. 브랜치 선택 후 실행

## Workflows

### 1. Build and Release (`release.yml`)
- **트리거**: `v*` 태그 푸시
- **동작**: 빌드 → zip 생성 → Release 업로드

### 2. Build Test (`build-test.yml`)
- **트리거**: PR, main 브랜치 push
- **동작**: 빌드 테스트만 수행 (Release 생성 안 함)
