#!/usr/bin/env node

// Dynamic ACP flow test - 실제 세션 ID를 사용한 테스트

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, 'dist', 'cli.js');

console.log('=== Dynamic ACP Flow Test ===');

const child = spawn('node', [cliPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, ACP_DEBUG: 'true' }
});

let sessionId = null;

child.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('STDOUT:', output);
  
  // Extract session ID from output
  const sessionMatch = output.match(/"sessionId":"([^"]+)"/);
  if (sessionMatch && !sessionId) {
    sessionId = sessionMatch[1];
    console.log(`\n🎯 Session ID extracted: ${sessionId}`);
    
    // Now send prompt with the actual session ID
    setTimeout(() => {
      console.log('\n📤 Sending prompt with session ID...');
      const promptMessage = JSON.stringify({
        jsonrpc: "2.0",
        id: 3,
        method: "session/prompt",
        params: {
          sessionId: sessionId,
          prompt: [{ type: "text", text: "Hello from test!" }]
        }
      }) + '\n';
      
      child.stdin.write(promptMessage);
    }, 1000);
  }
});

child.stderr.on('data', (data) => {
  console.log('STDERR:', data.toString());
});

child.on('error', (error) => {
  console.error('Process error:', error);
});

// Send initial messages
console.log('📤 Sending initialize...');
child.stdin.write(JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: 20241105,
    clientCapabilities: { fs: { readTextFile: true, writeTextFile: true } }
  }
}) + '\n');

setTimeout(() => {
  console.log('📤 Sending session/new...');
  child.stdin.write(JSON.stringify({
    jsonrpc: "2.0",
    id: 2,
    method: "session/new",
    params: { cwd: "/tmp" }
  }) + '\n');
}, 1000);

// Cleanup after 10 seconds
setTimeout(() => {
  console.log('\n🛑 Ending test...');
  child.kill();
  process.exit(0);
}, 10000);
