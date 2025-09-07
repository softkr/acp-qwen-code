/**
 * Diagnostic system for ACP bridge setup and troubleshooting
 */
import * as os from 'os';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { globalResourceManager } from './resource-manager.js';
/** Check minimum Node.js version */
const MIN_NODE_VERSION = 18;
/** Diagnostic system class */
export class DiagnosticSystem {
    /**
     * Generate diagnostic report
     */
    static async generateReport() {
        const issues = [];
        // Platform info
        const platform = await this.getPlatformInfo();
        const metrics = this.getSystemMetrics();
        // Check Node.js version
        const nodeVersion = parseInt(process.version.slice(1));
        if (nodeVersion < MIN_NODE_VERSION) {
            issues.push({
                code: 'NODE_VERSION',
                level: 'error',
                message: `Node.js ${process.version} is too old. Minimum version required: ${MIN_NODE_VERSION}`,
                solution: 'Please upgrade Node.js to a newer version',
            });
        }
        // Check Qwen CLI
        const qwen = await this.checkQwenCli();
        if (!qwen.available) {
            issues.push({
                code: 'QWEN_CLI_NOT_FOUND',
                level: 'error',
                message: 'Qwen CLI not found in system PATH',
                solution: 'Install Qwen CLI using npm or yarn',
            });
        }
        else if (!qwen.authenticated) {
            issues.push({
                code: 'QWEN_CLI_AUTH',
                level: 'error',
                message: 'Not authenticated with Qwen CLI',
                solution: 'Run Qwen CLI and complete browser authentication',
            });
        }
        // Check environment variables
        const envIssues = this.checkEnvironmentVariables();
        issues.push(...envIssues);
        // Check file system access
        const fsIssues = await this.checkFileSystemAccess();
        issues.push(...fsIssues);
        // Check system resources
        const resourceIssues = this.checkSystemResources();
        issues.push(...resourceIssues);
        // Calculate compatibility score
        const score = this.calculateScore(issues);
        // Determine overall compatibility
        const compatible = !issues.some(i => i.level === 'error');
        return {
            compatible,
            score,
            platform,
            qwen,
            issues,
            metrics,
        };
    }
    /**
     * Get platform information
     */
    static async getPlatformInfo() {
        const cpus = os.cpus();
        return {
            platform: process.platform,
            arch: process.arch,
            nodeVersion: process.version,
            cpuModel: cpus[0]?.model || 'Unknown',
            cpuCount: cpus.length,
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
        };
    }
    /**
     * Get system metrics
     */
    static getSystemMetrics() {
        const stats = globalResourceManager.getCurrentStats();
        return {
            memory: {
                heapUsed: stats.memory.heapUsed,
                heapTotal: stats.memory.heapTotal,
                rss: stats.memory.rss,
            },
            cpu: {
                usage: stats.cpu.usage,
                loadAvg: stats.cpu.loadAvg,
            },
            uptime: stats.uptime,
        };
    }
    /**
     * Check API configuration and connectivity
     */
    static async checkQwenCli() {
        try {
            // First check if qwen command exists
            const checkResult = await this.runCommand('qwen --version');
            if (!checkResult.success) {
                return {
                    available: false,
                    authenticated: false,
                };
            }
            const version = checkResult.output.trim();
            // Check authentication status by testing actual functionality
            const authCheckResult = await this.runCommand('echo "test" | qwen -p "respond with OK" --yolo');
            const authenticated = authCheckResult.success &&
                (authCheckResult.output.toLowerCase().includes('ok') ||
                    authCheckResult.output.toLowerCase().includes('yes') ||
                    authCheckResult.output.trim().length > 0);
            // Get default model if available
            let defaultModel;
            try {
                const configResult = await this.runCommand('qwen config get model');
                if (configResult.success) {
                    defaultModel = configResult.output.trim();
                }
            }
            catch { }
            return {
                available: true,
                authenticated,
                version,
                defaultModel,
            };
        }
        catch (error) {
            return {
                available: false,
                authenticated: false,
            };
        }
    }
    /**
     * Run command and return result
     */
    static async runCommand(command) {
        return new Promise((resolve) => {
            exec(command, (error, stdout, stderr) => {
                resolve({
                    success: !error,
                    output: stdout || stderr,
                });
            });
        });
    }
    /**
     * Check environment variables
     */
    static checkEnvironmentVariables() {
        const issues = [];
        // Check permission mode
        const permissionMode = process.env.ACP_PERMISSION_MODE;
        if (permissionMode &&
            !['default', 'acceptEdits', 'bypassPermissions'].includes(permissionMode)) {
            issues.push({
                code: 'ENVIRONMENT_VARS',
                level: 'warning',
                message: `Invalid ACP_PERMISSION_MODE: "${permissionMode}"`,
                solution: 'Use "default", "acceptEdits", or "bypassPermissions"',
            });
        }
        // Check max turns
        const maxTurns = process.env.ACP_MAX_TURNS;
        if (maxTurns && !/^\\d+$/.test(maxTurns)) {
            issues.push({
                code: 'ENVIRONMENT_VARS',
                level: 'warning',
                message: `Invalid ACP_MAX_TURNS: "${maxTurns}"`,
                solution: 'Must be a positive integer',
            });
        }
        return issues;
    }
    /**
     * Check file system access
     */
    static async checkFileSystemAccess() {
        const issues = [];
        const testDir = path.join(os.tmpdir(), 'acp-qwen-test');
        try {
            // Test directory creation
            await fs.mkdir(testDir, { recursive: true });
            // Test file creation
            const testFile = path.join(testDir, 'test.txt');
            await fs.writeFile(testFile, 'test');
            // Test file reading
            await fs.readFile(testFile, 'utf8');
            // Clean up
            await fs.rm(testDir, { recursive: true, force: true });
        }
        catch (error) {
            issues.push({
                code: 'FILE_PERMISSIONS',
                level: 'error',
                message: 'Insufficient file system permissions',
                solution: 'Check file system permissions',
                data: { error: String(error) },
            });
        }
        return issues;
    }
    /**
     * Check system resources
     */
    static checkSystemResources() {
        const issues = [];
        const metrics = this.getSystemMetrics();
        // Check memory usage
        const usedMemoryPercent = (metrics.memory.rss / os.totalmem()) * 100;
        if (usedMemoryPercent > 80) {
            issues.push({
                code: 'MEMORY_LOW',
                level: 'warning',
                message: 'High memory usage detected',
                solution: 'Free up system memory',
                data: { usedPercent: usedMemoryPercent },
            });
        }
        // Check CPU load
        const cpuCount = os.cpus().length;
        if (metrics.cpu.loadAvg[0] / cpuCount > 0.8) {
            issues.push({
                code: 'CPU_HIGH',
                level: 'warning',
                message: 'High CPU usage detected',
                solution: 'Reduce system load',
                data: { loadAvg: metrics.cpu.loadAvg },
            });
        }
        return issues;
    }
    /**
     * Calculate compatibility score
     */
    static calculateScore(issues) {
        let score = 100;
        for (const issue of issues) {
            switch (issue.level) {
                case 'error':
                    score -= 20;
                    break;
                case 'warning':
                    score -= 10;
                    break;
                case 'info':
                    score -= 5;
                    break;
            }
        }
        return Math.max(0, score);
    }
    /**
     * Format diagnostic report for display
     */
    static formatReport(report) {
        const lines = [];
        lines.push('=== ACP-Qwen-Code Diagnostic Report ===\\n');
        // Overall status
        lines.push(`Status: ${report.compatible ? '✅ Compatible' : '❌ Not Compatible'}`);
        lines.push(`Score: ${report.score}/100\n`);
        // Platform information
        lines.push('System Information:');
        lines.push(`  Platform: ${report.platform.platform} (${report.platform.arch})`);
        lines.push(`  Node.js: ${report.platform.nodeVersion}`);
        lines.push(`  CPU: ${report.platform.cpuModel} (${report.platform.cpuCount} cores)`);
        lines.push(`  Memory: ${Math.round(report.platform.totalMemory / 1024 / 1024)}MB total`);
        lines.push('');
        // Qwen CLI status
        lines.push('Qwen CLI Status:');
        lines.push(`  CLI: ${report.qwen.available ? '✅ Found' : '❌ Not Found'}${report.qwen.version ? ` (v${report.qwen.version})` : ''}`);
        lines.push(`  Auth Status: ${report.qwen.authenticated ? '✅ Authenticated' : '❌ Not Authenticated'}`);
        if (report.qwen.defaultModel) {
            lines.push(`  Default Model: ${report.qwen.defaultModel}`);
        }
        lines.push('');
        // Resource metrics
        lines.push('System Resources:');
        lines.push(`  Memory Usage: ${Math.round(report.metrics.memory.rss / 1024 / 1024)}MB`);
        lines.push(`  CPU Load: ${Math.round(report.metrics.cpu.usage)}%`);
        lines.push(`  Uptime: ${Math.round(report.metrics.uptime / 60)} minutes`);
        lines.push('');
        // Issues
        if (report.issues.length > 0) {
            lines.push('Issues:');
            for (const issue of report.issues) {
                lines.push(`  [${this.formatIssueSeverity(issue.level)}] ${issue.message}`);
                if (issue.solution) {
                    lines.push(`    Solution: ${issue.solution}`);
                }
            }
        }
        else {
            lines.push('✅ No issues detected');
        }
        return lines.join('\\n');
    }
    /**
     * Format issue severity for display
     */
    static formatIssueSeverity(level) {
        switch (level) {
            case 'error':
                return 'ERROR';
            case 'warning':
                return 'WARN';
            case 'info':
                return 'INFO';
        }
    }
}
//# sourceMappingURL=diagnostics.js.map