#!/bin/bash

# Zed ACP Flow Test - 실제 Zed가 보내는 메시지 시뮬레이션

cd /Volumes/work/zed-qwen_new/acp-qwen-code

echo "=== Zed 스타일 ACP 플로우 테스트 ==="

# 입력 파일 생성
cat > test_input.json << 'EOF'
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":20241105,"clientCapabilities":{"fs":{"readTextFile":true,"writeTextFile":true}}}}
{"jsonrpc":"2.0","id":2,"method":"session/new","params":{"cwd":"/tmp"}}
EOF

echo "1. 연속 메시지 테스트..."
cat test_input.json | node dist/cli.js &
PID=$!
sleep 3
kill $PID 2>/dev/null

echo -e "\n\n2. 개별 메시지 확인..."
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":20241105,"clientCapabilities":{"fs":{"readTextFile":true,"writeTextFile":true}}}}' | node dist/cli.js &
PID=$!
sleep 1
kill $PID 2>/dev/null

rm -f test_input.json
echo -e "\n=== 테스트 완료 ==="
