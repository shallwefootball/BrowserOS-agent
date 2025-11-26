# BrowserOS Agent

> **⚠️ NOTE:** This is only a submodule for the browserOS agent, the main project is at -- https://github.com/browseros-ai/BrowserOS

## 설치 방법

1. [Releases](https://github.com/letsur-dev/BrowserOS-agent/releases) 페이지에서 최신 버전 다운로드
2. `browseros-agent-vX.X.X.zip` 압축 해제
3. BrowserOS를 개발 모드로 실행 (`browseros-dev` - 아래 참고)
4. `chrome://extensions` 접속
5. "개발자 모드" 활성화
6. "압축해제된 확장 프로그램 로드" 클릭
7. 압축 해제한 폴더 선택

## 🆕 새롭게 추가된 기능

### 커스텀 인스트럭션 (Custom Instructions)
AI 어시스턴트의 동작 방식을 사용자 정의할 수 있는 시스템 프롬프트 설정 기능입니다.

**주요 활용 사례:**
- **언어 설정**: 기본 영어 응답을 한글로 변경 (예: "항상 한글로 답변해주세요")
- **요약 스타일 커스터마이징**: "Summarize this page" 같은 기본 기능을 원하는 형식으로 조정

**설정 위치:** Chat Mode 설정 패널

### 멀티 모델 병렬 쿼리 (Multi-Model Parallel Queries)
여러 LLM 제공자에게 동시에 질문하고 탭 인터페이스로 응답을 비교할 수 있습니다.

**활용 사례:**
- 여러 모델의 출력 비교
- 동일한 질문에 대한 다양한 관점 확보
- 프롬프트 효과성 테스트

## ⚠️ 중요: 개발 모드 실행 방법

> **커스텀 확장 프로그램을 사용하려면 반드시 개발 모드로 실행해야 합니다!**
>
> 일반 모드로 실행 시 커스텀 확장이 자동으로 기본 확장으로 덮어씌워집니다.

```bash
# ~/.zshrc 또는 ~/.bashrc에 추가
alias browseros-dev='/Applications/BrowserOS.app/Contents/MacOS/BrowserOS --disable-browseros-extensions > /dev/null 2>&1 &'

# 변경사항 적용
source ~/.zshrc

# BrowserOS를 개발 모드로 실행
browseros-dev
```

**핵심:** `--disable-browseros-extensions` 플래그는 BrowserOS가 내장 확장 프로그램을 자동으로 업데이트하는 것을 방지합니다.

## 릴리즈

이 프로젝트는 GitHub Actions를 통한 자동화된 릴리즈를 사용합니다.
상세한 릴리즈 프로세스는 [RELEASE_GUIDE.md](./RELEASE_GUIDE.md)를 참고하세요.

## 문제 해결

### 확장 프로그램이 계속 초기화됨
`--disable-browseros-extensions` 플래그와 함께 BrowserOS를 실행하고 있는지 확인하세요:
```bash
browseros-dev
```

## Contributing

For information on how to contribute to this project and set up your development environment, please refer to the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE) file for details.
