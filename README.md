# ACP-Qwen-Code Bridge

**Production-ready bridge connecting Qwen to Zed editor via the Agent Client Protocol (ACP)**

## Quick Start

### 1. Setup
```bash
# Check system compatibility & get Zed configuration
npx @softkr/acp-qwen-code --setup

# Test connection
npx @softkr/acp-qwen-code --test
```

### 2. Add to Zed settings.json
```json
{
  "agent_servers": {
    "qwen-code": {
      "command": "npx",
      "args": ["@softkr/acp-qwen-code"],
      "env": { "ACP_PERMISSION_MODE": "acceptEdits" }
    }
  }
}
```

## Features

- **🎯 Production Ready** - High-quality code with comprehensive testing
- **⚡ Enhanced ACP Compliance** - Full ACP specification implementation
- **📍 Real-time File Tracking** - Tool call locations enable "follow-along" in Zed editor  
- **📋 Execution Plans** - Dynamic task plans with progress tracking for complex operations
- **🔄 Rich Tool Output** - File diffs, enhanced titles, and contextual formatting
- **🧠 Agent Thoughts** - Streaming internal reasoning for transparency
- **🛡️ Advanced Permissions** - Smart auto-approval with full ACP permission integration
- **📊 Context Management** - 200K token window with intelligent monitoring and warnings
- **🔧 Enhanced UX** - Setup wizard, connection testing, comprehensive diagnostics

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

### Common Commands
```bash
# System diagnostics
npx @softkr/acp-qwen-code --diagnose

# Permission help
npx @softkr/acp-qwen-code --reset-permissions

# Debug mode
ACP_DEBUG=true npx @softkr/acp-qwen-code
```

### Common Issues

**Authentication Error**
```bash
# Ensure QWEN_API_KEY is set
export QWEN_API_KEY=your-api-key-here
```

**Non-TTY Environment**
```json
{ "env": { "ACP_PERMISSION_MODE": "acceptEdits" } }
```

**Context Window Warnings**
- **At 80%**: Consider shorter prompts or start new session
- **At 95%**: Create new session to avoid truncation  
- **Full context**: Session automatically cleaned up

## Architecture

```
Zed Editor ←→ ACP Protocol ←→ Bridge ←→ Qwen API
```

**Core Components:**
- **Agent** - Full ACP bridge with plans, locations, permissions
- **Diagnostics** - System health and compatibility checking
- **Performance Monitor** - Metrics collection and resource monitoring  
- **Error Handler** - Centralized error management
- **Types** - Extended ACP type definitions with validation
- **Logger** - Structured logging with buffer management

## License

MIT
