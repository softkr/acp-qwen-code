#!/usr/bin/env node

/**
 * CLI entry point for ACP bridge
 */

import { program } from 'commander';
import dotenv from 'dotenv';
import * as os from 'os';
import * as path from 'path';
import { Readable, Writable } from 'node:stream';
import { ReadableStream, WritableStream } from 'node:stream/web';
import { createLogger } from './logger.js';
import { AgentSideConnection } from './protocol.js';
import { DiagnosticSystem } from './diagnostics.js';
import { QwenAgent } from './agent.js';

// Load environment variables
dotenv.config();

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  // Configure CLI
  program
    .name('acp-qwen-code')
    .description('Qwen Code ACP bridge for Zed')
    .version(process.env.npm_package_version || '0.1.0')
    .option('--diagnose', 'Run diagnostics and report system status')
    .option('--setup', 'Run initial setup')
    .option('--test', 'Test ACP connection')
    .option('--reset-permissions', 'Reset permission settings')
    .option('--config <path>', 'Path to config file')
    .option('--debug', 'Enable debug logging')
    .parse(process.argv);

  const options = program.opts();

  // Handle diagnostics mode
  if (options.diagnose) {
    await runDiagnostics();
    return;
  }

  // Handle setup mode
  if (options.setup) {
    await runSetup();
    return;
  }

  // Handle test mode
  if (options.test) {
    await runTest();
    return;
  }

  // Handle reset permissions
  if (options.resetPermissions) {
    await resetPermissions();
    return;
  }

  // Initialize centralized logging
  const logger = createLogger('CLI');
  logger.writeStartupMessage();

  try {
    // Prevent accidental stdout writes
    console.log = console.error;
    console.info = console.error;

    logger.debug('Creating ACP connection via stdio...');

    // Convert Node.js streams to Web Streams
    // stdout for sending to client, stdin for receiving from client
    const outputStream = Writable.toWeb(
      process.stdout,
    ) as WritableStream<Uint8Array>;
    const inputStream = Readable.toWeb(
      process.stdin,
    ) as ReadableStream<Uint8Array>;

    // We're implementing an Agent, so use AgentSideConnection
    let agent: QwenAgent | null = null;
    new AgentSideConnection(
      (client) => {
        logger.debug('Creating QwenAgent with client');
        agent = new QwenAgent(client, {
          debug: options.debug,
          configPath: options.config,
        });
        return agent;
      },
      outputStream,
      inputStream,
    );

    logger.debug('ACP Connection created successfully');
    logger.info('Qwen Code ACP Bridge is running');

    // Keep process alive
    process.stdin.resume();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      logger.info('Received SIGINT, shutting down...');
      if (agent && typeof agent.destroy === 'function') {
        agent.destroy();
      }
      logger.destroy();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      logger.info('Received SIGTERM, shutting down...');
      if (agent && typeof agent.destroy === 'function') {
        agent.destroy();
      }
      logger.destroy();
      process.exit(0);
    });

    // Handle errors
    process.on('uncaughtException', (error) => {
      logger.error(`[FATAL] Uncaught exception: ${error.message}`, {
        stack: error.stack,
      });
      logger.destroy();
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('[FATAL] Unhandled rejection', {
        promise: String(promise),
        reason: String(reason),
      });
      logger.destroy();
      process.exit(1);
    });
  } catch (error) {
    logger.error(`[FATAL] Error starting ACP bridge: ${error}`);
    logger.destroy();
    process.exit(1);
  }
}

/**
 * Run diagnostics
 */
async function runDiagnostics(): Promise<void> {
  console.error('🔍 Running ACP-Qwen-Code Diagnostics...\\n');
  
  try {
    const report = await DiagnosticSystem.generateReport();
    const formattedReport = DiagnosticSystem.formatReport(report);
    
    console.error(formattedReport);
    
    // Exit with appropriate code
    process.exit(report.compatible ? 0 : 1);
  } catch (error) {
    console.error('ERROR: Failed to generate diagnostic report:', error);
    process.exit(1);
  }
}

/**
 * Run setup wizard
 */
async function runSetup(): Promise<void> {
  console.error('SETUP: ACP-Qwen-Code Setup Wizard\\n');
  
  try {
    const report = await DiagnosticSystem.generateReport();
    
    console.error('SUCCESS: System Check:');
    console.error(`   Platform: ${report.platform.platform} (${report.platform.arch})`);
    console.error(`   Node.js: ${report.platform.nodeVersion}`);
    console.error(`   Qwen CLI: ${report.qwen.available ? '✅ Found' : '❌ Missing'}`);
    console.error(`   Authentication: ${report.qwen.authenticated ? '✅ Ready' : '❌ Required'}`);
    console.error(`   Score: ${report.score}/100\n`);
    
    if (!report.qwen.available) {
      console.error('CLI: Qwen CLI not found:');
      console.error('   Install qwen CLI and ensure it is in PATH\\n');
    }
    
    if (report.qwen.available && !report.qwen.authenticated) {
      console.error('AUTH: Authentication required:');
      console.error('   Run `qwen auth login` and check network connectivity\\n');
    }
    
    console.error('CONFIG: Recommended Zed configuration:');
    console.error('{\\n  "agent_servers": {\\n    "qwen-code": {\\n      "command": "npx",');
    console.error('      "args": ["@softkr/acp-qwen-code"],\\n      "env": {');
    console.error('        "ACP_PERMISSION_MODE": "acceptEdits"\\n      }\\n    }\\n  }\\n}');
    
    process.exit(report.compatible ? 0 : 1);
  } catch (error) {
    console.error('ERROR: Setup failed:', error);
    process.exit(1);
  }
}

/**
 * Run connection test
 */
async function runTest(): Promise<void> {
  console.error('TEST: Testing ACP-Qwen-Code Connection\\n');
  
  try {
    const report = await DiagnosticSystem.generateReport();
    const metrics = DiagnosticSystem.getSystemMetrics();
    
    console.error('STATUS: System Status:');
    console.error(`   Memory: ${Math.round(metrics.memory.rss / 1024 / 1024)}MB used`);
    console.error(`   Uptime: ${Math.round(metrics.uptime)}s`);
    console.error(`   Compatible: ${report.compatible ? 'Yes' : 'No'}`);
    
    if (report.qwen.available && report.qwen.authenticated) {
      console.error('SUCCESS: Connection test passed');
      process.exit(0);
    } else {
      console.error('ERROR: Connection test failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('ERROR: Test failed:', error);
    process.exit(1);
  }
}

/**
 * Reset permissions
 */
async function resetPermissions(): Promise<void> {
  console.error('RESET: Resetting permission settings\\n');
  
  console.error('Permission modes available:');
  console.error('  • default - Ask for each operation');
  console.error('  • acceptEdits - Auto-accept file edits');
  console.error('  • bypassPermissions - Allow all operations');
  console.error('\\nSet via environment variable:');
  console.error('  ACP_PERMISSION_MODE=acceptEdits');
  console.error('\\nOr use runtime markers:');
  console.error('  [ACP:PERMISSION:ACCEPT_EDITS]');
  
  process.exit(0);
}

// Start CLI
main().catch((error) => {
  console.error('[FATAL] Unhandled error:', error);
  process.exit(1);
});
