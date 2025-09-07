/**
 * Additional type definitions for ACP and Qwen integration
 */

// Local stream error type for tool calls
export interface StreamError {
  code: string;
  message: string;
  data?: unknown;
}

/** Qwen message type */
export interface QwenMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: QwenCitation[];
  toolCalls?: QwenToolCall[];
}

/** Qwen API citation */
export interface QwenCitation {
  documentType: string;
  documentId: string;
}

/** Qwen tool call information */
export interface QwenToolCall {
  name: string;
  arguments: Record<string, unknown>;
  location?: string[];
  result?: string;
  error?: StreamError;
}

/** Plan entry for complex operations */
export interface PlanEntry {
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  error?: string;
}

/** Tool call location information */
export interface ToolCallLocation {
  file: string;
  line?: number;
  range?: [number, number];
  symbol?: string;
}

/** Rich content for tool calls */
export interface ToolCallContent {
  type: 'text' | 'diff' | 'file' | 'plan';
  content: string;
  metadata?: Record<string, unknown>;
}

/** Permission options for tool calls */
export interface PermissionOption {
  id: string;
  name: string;
  description: string | null;
}

/** Enhanced tool context */
export interface ToolOperationContext {
  file?: string;
  range?: [number, number];
  before?: string;
  after?: string;
  diff?: string;
}

/** Enhanced session capabilities */
export interface EnhancedPromptCapabilities {
  audio: boolean;
  embeddedContext: boolean;
  image: boolean;
  plans: boolean;
  thoughtStreaming: boolean;
}

/** Qwen API client configuration */
export interface QwenConfig {
  apiKey: string;
  apiBaseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  maxRetries?: number;
  timeout?: number;
}

/** File context information */
export interface FileContext {
  path: string;
  content: string;
  language?: string;
  startLine?: number;
  endLine?: number;
  projectRoot?: string;
}

/** Context window management */
export interface ContextWindow {
  maxTokens: number;
  currentTokens: number;
  messages: QwenMessage[];
  toolCalls: QwenToolCall[];
}

/** Session state */
export interface SessionState {
  id: string;
  messages: QwenMessage[];
  activeFiles: Set<string>;
  contextWindow: ContextWindow;
  currentPlan?: PlanEntry[];
  createdAt: number;
  lastActivityAt: number;
  turnCount: number;
}
