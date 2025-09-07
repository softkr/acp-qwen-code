# ACP-Qwen-Code Bridge

**Production-ready bridge connecting Qwen to Zed editor via the Agent Client Protocol (ACP)**

[![npm version](https://badge.fury.io/js/@softkr%2Facp-qwen-code.svg)](https://badge.fury.io/js/@softkr%2Facp-qwen-code)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start

### 1. Prerequisites

- **Qwen CLI**: Install and authenticate with [Qwen CLI](https://docs.qwen.com/cli)
- **Zed Editor**: Download from [zed.dev](https://zed.dev)
- **Node.js**: v18.0.0 or higher

### 2. Setup & Verification
```bash
# Verify system compatibility
npx @softkr/acp-qwen-code@latest --diagnose

# Test ACP connection  
npx @softkr/acp-qwen-code@latest --test

# Get Zed configuration help
npx @softkr/acp-qwen-code@latest --setup
```

### 3. Add to Zed settings.json
```json
{
  "agent_servers": {
    "qwen-code": {
      "command": "npx",
      "args": ["@softkr/acp-qwen-code@latest"],
      "env": { "ACP_PERMISSION_MODE": "acceptEdits" }
    }
  }
}
```

### 4. Open Zed Agent Panel
- Press `Cmd+?` (macOS) or `Ctrl+?` (Linux/Windows)
- Click the `+` button and select "qwen-code"
- Start chatting with Qwen in your Zed editor!

## Features

- **🎯 Production Ready** - High-quality code with comprehensive testing and error handling
- **⚡ Enhanced ACP Compliance** - Full ACP specification implementation with proper protocol handling
- **📍 Real-time File Tracking** - Tool call locations enable "follow-along" experience in Zed editor  
- **📋 Execution Plans** - Dynamic task plans with progress tracking for complex operations
- **🔄 Rich Tool Output** - File diffs, enhanced titles, and contextual formatting
- **🧠 Agent Thoughts** - Streaming internal reasoning for transparency and debugging
- **🛡️ Advanced Permissions** - Smart auto-approval with full ACP permission integration
- **📊 Context Management** - 200K token window with intelligent monitoring and warnings
- **🔧 Enhanced UX** - Setup wizard, connection testing, comprehensive diagnostics
- **🚀 Easy Installation** - Single command setup with automatic dependency management

## Configuration

### Permission Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `default` | Ask for every operation | Maximum safety |
| `acceptEdits` | Auto-accept file edits | Recommended workflow |  
| `bypassPermissions` | Allow all operations | Trusted environments |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ACP_PERMISSION_MODE` | `default` | Permission behavior |
| `ACP_MAX_TURNS` | `100` | Session limit (0 = unlimited) |
| `ACP_DEBUG` | `false` | Enable debug logging |
| `ACP_LOG_FILE` | none | Log to file |
| `QWEN_API_KEY` | none | Your Qwen API key |

### Runtime Permission Switching

Change permissions mid-conversation with markers:
```
[ACP:PERMISSION:ACCEPT_EDITS]
Please refactor the authentication module
```

## Troubleshooting

### Quick Diagnostics
```bash
# Run comprehensive system check
npx @softkr/acp-qwen-code@latest --diagnose

# Test ACP connection
npx @softkr/acp-qwen-code@latest --test
```

### Common Issues

#### "server shut down unexpectedly"
**Cause**: Usually authentication or permission issues
```bash
# 1. Check diagnostics
npx @softkr/acp-qwen-code@latest --diagnose

# 2. Ensure Qwen CLI is authenticated
qwen -p "hello" --yolo  # Should return a response

# 3. Use latest version in Zed settings
"args": ["@softkr/acp-qwen-code@latest"]
```

#### Authentication Errors
**Browser Authentication (Recommended)**:
- Qwen CLI uses browser-based authentication
- No API key required when properly authenticated via browser

**API Key Method**:
```bash
export QWEN_API_KEY=your-api-key-here
```

#### Compatibility Issues
**Node.js Version**: Requires Node.js ≥18.0.0
```bash
node --version  # Should be v18+ 
```

**Zed Version**: Requires Zed with ACP support
- Update to latest Zed version if experiencing issues

#### Permission Problems
```bash
# Reset permissions to defaults
npx @softkr/acp-qwen-code@latest --reset-permissions

# Check current permission mode
ACP_DEBUG=true npx @softkr/acp-qwen-code@latest
```

### Advanced Debugging

#### Enable Debug Logging
```json
{
  "agent_servers": {
    "qwen-code": {
      "command": "npx", 
      "args": ["@softkr/acp-qwen-code@latest"],
      "env": { 
        "ACP_DEBUG": "true",
        "ACP_PERMISSION_MODE": "acceptEdits" 
      }
    }
  }
}
```

#### Context Window Management
- **At 80%**: Consider shorter prompts or start new session
- **At 95%**: Create new session to avoid truncation  
- **Full context**: Session automatically cleaned up

#### View ACP Logs in Zed
1. Open Command Palette (`Cmd+Shift+P`)
2. Run `dev: open acp logs` 
3. Monitor real-time ACP communication

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Zed Editor  │◄──►│ ACP Bridge  │◄──►│ Qwen CLI    │◄──►│ Qwen API    │
│             │    │             │    │             │    │             │
│ - Agent UI  │    │ - Protocol  │    │ - Auth      │    │ - Models    │
│ - File Mgmt │    │ - Session   │    │ - Commands  │    │ - Responses │
│ - Logs      │    │ - Tools     │    │ - Config    │    │ - Streaming │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Core Components

#### 🔌 **ACP Bridge** (`src/agent.ts`)
- Full Agent Client Protocol implementation
- Session management and state tracking
- Real-time execution plans and progress updates
- Permission handling and user interaction

#### 🔍 **Diagnostics System** (`src/diagnostics.ts`)  
- Comprehensive system compatibility checking
- Qwen CLI authentication verification
- Performance metrics and resource monitoring
- Automated troubleshooting recommendations

#### ⚡ **Protocol Handler** (`src/protocol.ts`)
- JSON-RPC 2.0 message processing
- Bidirectional communication with Zed
- Error handling and response validation
- Stream management for real-time updates

#### 🛠️ **CLI Wrapper** (`src/cli-wrapper.ts`)
- Qwen CLI process management
- Command execution and output parsing
- Authentication state monitoring
- Error recovery and retry logic

#### 📊 **Context Monitor** (`src/context-monitor.ts`)
- 200K token limit tracking
- Memory usage optimization
- Automatic session cleanup
- Performance warnings and alerts

## Development

### Local Setup
```bash
# Clone repository
git clone https://github.com/softkr/acp-qwen-code.git
cd acp-qwen-code

# Install dependencies
npm install

# Build project
npm run build

# Run tests
npm test

# Start development mode
npm run dev
```

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 **Documentation**: [Zed External Agents Guide](https://zed.dev/docs/ai/external-agents)
- 🐛 **Issues**: [GitHub Issues](https://github.com/softkr/acp-qwen-code/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/softkr/acp-qwen-code/discussions)
- 📦 **npm Package**: [@softkr/acp-qwen-code](https://www.npmjs.com/package/@softkr/acp-qwen-code)
