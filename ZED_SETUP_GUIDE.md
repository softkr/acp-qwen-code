# Zed에서 로컬 ACP Agent 설정 방법

## 1. Zed 설정 열기
- `Cmd + ,` (macOS) 또는 `Ctrl + ,` (Windows/Linux)
- 또는 메뉴: Zed → Settings

## 2. settings.json에 다음 추가:

```json
{
  "agents": [
    {
      "name": "qwen-local",
      "command": "node",
      "args": ["/Volumes/work/zed-qwen_new/acp-qwen-code/dist/cli.js"]
    }
  ]
}
```

## 3. Agent 패널 열기
- `Cmd + Shift + A` (macOS) 또는 `Ctrl + Shift + A` (Windows/Linux)
- 또는 메뉴: View → Agent

## 4. qwen-local 선택
- Agent 패널에서 "qwen-local" 선택
- "Loading..." 대신 정상적으로 채팅 인터페이스가 나타나야 함

## 5. 테스트
- 간단한 질문 입력: "Hello, can you help me?"

## 문제 해결

### A. "server shut down unexpectedly" 에러
- dist/cli.js 파일 존재 확인
- 실행 권한 확인: `chmod +x dist/cli.js`

### B. "Loading..." 에서 멈춤
- 터미널에서 직접 테스트:
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":20241105,"clientCapabilities":{"fs":{"readTextFile":true,"writeTextFile":true}}}}' | node dist/cli.js
```

### C. Method not found 에러
- 최신 빌드 확인: `npm run build`
