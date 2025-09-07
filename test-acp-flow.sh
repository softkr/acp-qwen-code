#!/bin/bash

# Test ACP flow: initialize → session/new

cd /Volumes/work/zed-qwen_new/acp-qwen-code

echo "=== Testing ACP Flow ==="

# 1. Initialize
echo "1. Testing initialize..."
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":20241105,"clientCapabilities":{"fs":{"readTextFile":true,"writeTextFile":true}}}}' | node dist/cli.js &
PID1=$!
sleep 2
kill $PID1 2>/dev/null

echo -e "\n\n2. Testing session/new..."
echo '{"jsonrpc":"2.0","id":2,"method":"session/new","params":{"cwd":"/tmp"}}' | node dist/cli.js &
PID2=$!
sleep 2
kill $PID2 2>/dev/null

echo -e "\n\n=== ACP Flow Test Complete ==="
