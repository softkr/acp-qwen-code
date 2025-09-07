#!/usr/bin/env node

// Extended ACP flow test - 더 긴 시간 동안 응답 대기

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, 'dist', 'cli.js');

console.log('=== Extended ACP Flow Test ===');

const child = spawn('node', [cliPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, ACP_DEBUG: 'true' }
});

let sessionId = null;
let promptSent = false;

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
      if (!promptSent) {
        promptSent = true;
        console.log('\n📤 Sending prompt with session ID...');
        const promptMessage = JSON.stringify({
          jsonrpc: "2.0",
          id: 3,
          method: "session/prompt",
          params: {
            sessionId: sessionId,
            prompt: [{ type: "text", text: "Hello, how are you?" }]
          }
        }) + '\n';
        
        child.stdin.write(promptMessage);
      }
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

// Cleanup after 20 seconds (더 긴 시간)
setTimeout(() => {
  console.log('\n🛑 Ending test after 20 seconds...');
  child.kill();
  process.exit(0);
}, 20000);
