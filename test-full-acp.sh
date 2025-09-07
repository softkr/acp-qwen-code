#!/bin/bash

# Real ACP flow test with dynamic session ID

cd /Volumes/work/zed-qwen_new/acp-qwen-code

echo "=== 전체 ACP 플로우 테스트 ==="

# 1. Initialize와 Session 생성
echo "1. Initialize + Session 생성..."
RESPONSE=$(echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":20241105,"clientCapabilities":{"fs":{"readTextFile":true,"writeTextFile":true}}}}
{"jsonrpc":"2.0","id":2,"method":"session/new","params":{"cwd":"/tmp"}}' | node dist/cli.js)

echo "응답:"
echo "$RESPONSE"

# 세션 ID 추출 (간단한 방법)
SESSION_ID=$(echo "$RESPONSE" | grep -o '"sessionId":"[^"]*"' | cut -d'"' -f4 | head -1)

if [ -n "$SESSION_ID" ]; then
    echo -e "\n2. 추출된 세션 ID: $SESSION_ID"
    
    echo -e "\n3. 해당 세션으로 프롬프트 테스트..."
    echo "{\"jsonrpc\":\"2.0\",\"id\":3,\"method\":\"session/prompt\",\"params\":{\"sessionId\":\"$SESSION_ID\",\"prompt\":[{\"type\":\"text\",\"text\":\"Hello\"}]}}" | node dist/cli.js
else
    echo "세션 ID를 찾을 수 없습니다."
fi

echo -e "\n=== 테스트 완료 ==="
