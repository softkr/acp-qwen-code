/**
 * Agent Client Protocol (ACP) schema definitions aligned with Zed spec
 */
import { z } from 'zod';
export declare const AGENT_METHODS: {
    readonly authenticate: "authenticate";
    readonly initialize: "initialize";
    readonly session_cancel: "session/cancel";
    readonly session_load: "session/load";
    readonly session_new: "session/new";
    readonly session_prompt: "session/prompt";
};
export declare const CLIENT_METHODS: {
    readonly fs_read_text_file: "fs/read_text_file";
    readonly fs_write_text_file: "fs/write_text_file";
    readonly session_request_permission: "session/request_permission";
    readonly session_update: "session/update";
};
export declare const PROTOCOL_VERSION = 1;
export type WriteTextFileRequest = z.infer<typeof writeTextFileRequestSchema>;
export type ReadTextFileRequest = z.infer<typeof readTextFileRequestSchema>;
export type PermissionOptionKind = z.infer<typeof permissionOptionKindSchema>;
export type Role = z.infer<typeof roleSchema>;
export type TextResourceContents = z.infer<typeof textResourceContentsSchema>;
export type BlobResourceContents = z.infer<typeof blobResourceContentsSchema>;
export type ToolKind = z.infer<typeof toolKindSchema>;
export type ToolCallStatus = z.infer<typeof toolCallStatusSchema>;
export type WriteTextFileResponse = z.infer<typeof writeTextFileResponseSchema>;
export type ReadTextFileResponse = z.infer<typeof readTextFileResponseSchema>;
export type RequestPermissionOutcome = z.infer<typeof requestPermissionOutcomeSchema>;
export type CancelNotification = z.infer<typeof cancelNotificationSchema>;
export type AuthenticateRequest = z.infer<typeof authenticateRequestSchema>;
export type AuthenticateResponse = z.infer<typeof authenticateResponseSchema>;
export type NewSessionResponse = z.infer<typeof newSessionResponseSchema>;
export type LoadSessionResponse = z.infer<typeof loadSessionResponseSchema>;
export type StopReason = z.infer<typeof stopReasonSchema>;
export type PromptResponse = z.infer<typeof promptResponseSchema>;
export type ToolCallLocation = z.infer<typeof toolCallLocationSchema>;
export type PlanEntry = z.infer<typeof planEntrySchema>;
export type PermissionOption = z.infer<typeof permissionOptionSchema>;
export type Annotations = z.infer<typeof annotationsSchema>;
export type RequestPermissionResponse = z.infer<typeof requestPermissionResponseSchema>;
export type FileSystemCapability = z.infer<typeof fileSystemCapabilitySchema>;
export type EnvVariable = z.infer<typeof envVariableSchema>;
export type McpServer = z.infer<typeof mcpServerSchema>;
export type AgentCapabilities = z.infer<typeof agentCapabilitiesSchema>;
export type AuthMethod = z.infer<typeof authMethodSchema>;
export type PromptCapabilities = z.infer<typeof promptCapabilitiesSchema>;
export type ClientResponse = z.infer<typeof clientResponseSchema>;
export type ClientNotification = z.infer<typeof clientNotificationSchema>;
export type EmbeddedResourceResource = z.infer<typeof embeddedResourceResourceSchema>;
export type NewSessionRequest = z.infer<typeof newSessionRequestSchema>;
export type LoadSessionRequest = z.infer<typeof loadSessionRequestSchema>;
export type InitializeResponse = z.infer<typeof initializeResponseSchema>;
export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type ToolCallContent = z.infer<typeof toolCallContentSchema>;
export type ToolCall = z.infer<typeof toolCallSchema>;
export type ClientCapabilities = z.infer<typeof clientCapabilitiesSchema>;
export type PromptRequest = z.infer<typeof promptRequestSchema>;
export type SessionUpdate = z.infer<typeof sessionUpdateSchema>;
export type AgentResponse = z.infer<typeof agentResponseSchema>;
export type RequestPermissionRequest = z.infer<typeof requestPermissionRequestSchema>;
export type InitializeRequest = z.infer<typeof initializeRequestSchema>;
export type SessionNotification = z.infer<typeof sessionNotificationSchema>;
export type ClientRequest = z.infer<typeof clientRequestSchema>;
export type AgentRequest = z.infer<typeof agentRequestSchema>;
export type AgentNotification = z.infer<typeof agentNotificationSchema>;
export declare const writeTextFileRequestSchema: z.ZodObject<{
    content: z.ZodString;
    path: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$strip>;
export declare const readTextFileRequestSchema: z.ZodObject<{
    limit: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    line: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    path: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$strip>;
export declare const permissionOptionKindSchema: z.ZodUnion<readonly [z.ZodLiteral<"allow_once">, z.ZodLiteral<"allow_always">, z.ZodLiteral<"reject_once">, z.ZodLiteral<"reject_always">]>;
export declare const roleSchema: z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>;
export declare const textResourceContentsSchema: z.ZodObject<{
    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    text: z.ZodString;
    uri: z.ZodString;
}, z.core.$strip>;
export declare const blobResourceContentsSchema: z.ZodObject<{
    blob: z.ZodString;
    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    uri: z.ZodString;
}, z.core.$strip>;
export declare const toolKindSchema: z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"other">]>;
export declare const toolCallStatusSchema: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>;
export declare const writeTextFileResponseSchema: z.ZodNull;
export declare const readTextFileResponseSchema: z.ZodObject<{
    content: z.ZodString;
}, z.core.$strip>;
export declare const requestPermissionOutcomeSchema: z.ZodUnion<readonly [z.ZodObject<{
    outcome: z.ZodLiteral<"cancelled">;
}, z.core.$strip>, z.ZodObject<{
    optionId: z.ZodString;
    outcome: z.ZodLiteral<"selected">;
}, z.core.$strip>]>;
export declare const cancelNotificationSchema: z.ZodObject<{
    sessionId: z.ZodString;
}, z.core.$strip>;
export declare const authenticateRequestSchema: z.ZodObject<{
    methodId: z.ZodString;
}, z.core.$strip>;
export declare const authenticateResponseSchema: z.ZodNull;
export declare const newSessionResponseSchema: z.ZodObject<{
    sessionId: z.ZodString;
}, z.core.$strip>;
export declare const loadSessionResponseSchema: z.ZodNull;
export declare const stopReasonSchema: z.ZodUnion<readonly [z.ZodLiteral<"end_turn">, z.ZodLiteral<"max_tokens">, z.ZodLiteral<"refusal">, z.ZodLiteral<"cancelled">]>;
export declare const promptResponseSchema: z.ZodObject<{
    stopReason: z.ZodUnion<readonly [z.ZodLiteral<"end_turn">, z.ZodLiteral<"max_tokens">, z.ZodLiteral<"refusal">, z.ZodLiteral<"cancelled">]>;
}, z.core.$strip>;
export declare const toolCallLocationSchema: z.ZodObject<{
    line: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    path: z.ZodString;
}, z.core.$strip>;
export declare const planEntrySchema: z.ZodObject<{
    content: z.ZodString;
    priority: z.ZodUnion<readonly [z.ZodLiteral<"high">, z.ZodLiteral<"medium">, z.ZodLiteral<"low">]>;
    status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">]>;
}, z.core.$strip>;
export declare const permissionOptionSchema: z.ZodObject<{
    kind: z.ZodUnion<readonly [z.ZodLiteral<"allow_once">, z.ZodLiteral<"allow_always">, z.ZodLiteral<"reject_once">, z.ZodLiteral<"reject_always">]>;
    name: z.ZodString;
    optionId: z.ZodString;
}, z.core.$strip>;
export declare const annotationsSchema: z.ZodObject<{
    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const requestPermissionResponseSchema: z.ZodObject<{
    outcome: z.ZodUnion<readonly [z.ZodObject<{
        outcome: z.ZodLiteral<"cancelled">;
    }, z.core.$strip>, z.ZodObject<{
        optionId: z.ZodString;
        outcome: z.ZodLiteral<"selected">;
    }, z.core.$strip>]>;
}, z.core.$strip>;
export declare const fileSystemCapabilitySchema: z.ZodObject<{
    readTextFile: z.ZodBoolean;
    writeTextFile: z.ZodBoolean;
}, z.core.$strip>;
export declare const envVariableSchema: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodString;
}, z.core.$strip>;
export declare const mcpServerSchema: z.ZodObject<{
    args: z.ZodArray<z.ZodString>;
    command: z.ZodString;
    env: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>;
    name: z.ZodString;
}, z.core.$strip>;
export declare const promptCapabilitiesSchema: z.ZodObject<{
    audio: z.ZodOptional<z.ZodBoolean>;
    embeddedContext: z.ZodOptional<z.ZodBoolean>;
    image: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const agentCapabilitiesSchema: z.ZodObject<{
    loadSession: z.ZodOptional<z.ZodBoolean>;
    promptCapabilities: z.ZodOptional<z.ZodObject<{
        audio: z.ZodOptional<z.ZodBoolean>;
        embeddedContext: z.ZodOptional<z.ZodBoolean>;
        image: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const authMethodSchema: z.ZodObject<{
    description: z.ZodNullable<z.ZodString>;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export declare const clientResponseSchema: z.ZodUnion<readonly [z.ZodNull, z.ZodObject<{
    content: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    outcome: z.ZodUnion<readonly [z.ZodObject<{
        outcome: z.ZodLiteral<"cancelled">;
    }, z.core.$strip>, z.ZodObject<{
        optionId: z.ZodString;
        outcome: z.ZodLiteral<"selected">;
    }, z.core.$strip>]>;
}, z.core.$strip>]>;
export declare const clientNotificationSchema: z.ZodObject<{
    sessionId: z.ZodString;
}, z.core.$strip>;
export declare const embeddedResourceResourceSchema: z.ZodUnion<readonly [z.ZodObject<{
    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    text: z.ZodString;
    uri: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    blob: z.ZodString;
    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    uri: z.ZodString;
}, z.core.$strip>]>;
export declare const newSessionRequestSchema: z.ZodObject<{
    cwd: z.ZodString;
    mcpServers: z.ZodArray<z.ZodObject<{
        args: z.ZodArray<z.ZodString>;
        command: z.ZodString;
        env: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const loadSessionRequestSchema: z.ZodObject<{
    cwd: z.ZodString;
    mcpServers: z.ZodArray<z.ZodObject<{
        args: z.ZodArray<z.ZodString>;
        command: z.ZodString;
        env: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
    }, z.core.$strip>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
export declare const initializeResponseSchema: z.ZodObject<{
    agentCapabilities: z.ZodObject<{
        loadSession: z.ZodOptional<z.ZodBoolean>;
        promptCapabilities: z.ZodOptional<z.ZodObject<{
            audio: z.ZodOptional<z.ZodBoolean>;
            embeddedContext: z.ZodOptional<z.ZodBoolean>;
            image: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    authMethods: z.ZodArray<z.ZodObject<{
        description: z.ZodNullable<z.ZodString>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>>;
    protocolVersion: z.ZodNumber;
}, z.core.$strip>;
export declare const contentBlockSchema: z.ZodUnion<readonly [z.ZodObject<{
    annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
        lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>>>;
    text: z.ZodString;
    type: z.ZodLiteral<"text">;
}, z.core.$strip>, z.ZodObject<{
    annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
        lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>>>;
    data: z.ZodString;
    mimeType: z.ZodString;
    type: z.ZodLiteral<"image">;
}, z.core.$strip>, z.ZodObject<{
    annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
        lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>>>;
    data: z.ZodString;
    mimeType: z.ZodString;
    type: z.ZodLiteral<"audio">;
}, z.core.$strip>, z.ZodObject<{
    annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
        lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>>>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    name: z.ZodString;
    size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    type: z.ZodLiteral<"resource_link">;
    uri: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
        lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>>>;
    resource: z.ZodUnion<readonly [z.ZodObject<{
        mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        text: z.ZodString;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        blob: z.ZodString;
        mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$strip>]>;
    type: z.ZodLiteral<"resource">;
}, z.core.$strip>]>;
export declare const toolCallContentSchema: z.ZodUnion<readonly [z.ZodObject<{
    content: z.ZodUnion<readonly [z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        text: z.ZodString;
        type: z.ZodLiteral<"text">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        type: z.ZodLiteral<"image">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        type: z.ZodLiteral<"audio">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        type: z.ZodLiteral<"resource_link">;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            blob: z.ZodString;
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>]>;
        type: z.ZodLiteral<"resource">;
    }, z.core.$strip>]>;
    type: z.ZodLiteral<"content">;
}, z.core.$strip>, z.ZodObject<{
    newText: z.ZodString;
    oldText: z.ZodNullable<z.ZodString>;
    path: z.ZodString;
    type: z.ZodLiteral<"diff">;
}, z.core.$strip>]>;
export declare const toolCallSchema: z.ZodObject<{
    content: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        content: z.ZodUnion<readonly [z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            text: z.ZodString;
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            type: z.ZodLiteral<"resource_link">;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                blob: z.ZodString;
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>]>;
        type: z.ZodLiteral<"content">;
    }, z.core.$strip>, z.ZodObject<{
        newText: z.ZodString;
        oldText: z.ZodNullable<z.ZodString>;
        path: z.ZodString;
        type: z.ZodLiteral<"diff">;
    }, z.core.$strip>]>>>;
    kind: z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"other">]>;
    locations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        line: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        path: z.ZodString;
    }, z.core.$strip>>>;
    rawInput: z.ZodOptional<z.ZodUnknown>;
    status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>;
    title: z.ZodString;
    toolCallId: z.ZodString;
}, z.core.$strip>;
export declare const clientCapabilitiesSchema: z.ZodObject<{
    fs: z.ZodObject<{
        readTextFile: z.ZodBoolean;
        writeTextFile: z.ZodBoolean;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const promptRequestSchema: z.ZodObject<{
    prompt: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        text: z.ZodString;
        type: z.ZodLiteral<"text">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        type: z.ZodLiteral<"image">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        type: z.ZodLiteral<"audio">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        type: z.ZodLiteral<"resource_link">;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            blob: z.ZodString;
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>]>;
        type: z.ZodLiteral<"resource">;
    }, z.core.$strip>]>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
export declare const sessionUpdateSchema: z.ZodUnion<readonly [z.ZodObject<{
    content: z.ZodUnion<readonly [z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        text: z.ZodString;
        type: z.ZodLiteral<"text">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        type: z.ZodLiteral<"image">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        type: z.ZodLiteral<"audio">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        type: z.ZodLiteral<"resource_link">;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            blob: z.ZodString;
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>]>;
        type: z.ZodLiteral<"resource">;
    }, z.core.$strip>]>;
    sessionUpdate: z.ZodLiteral<"user_message_chunk">;
}, z.core.$strip>, z.ZodObject<{
    content: z.ZodUnion<readonly [z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        text: z.ZodString;
        type: z.ZodLiteral<"text">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        type: z.ZodLiteral<"image">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        type: z.ZodLiteral<"audio">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        type: z.ZodLiteral<"resource_link">;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            blob: z.ZodString;
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>]>;
        type: z.ZodLiteral<"resource">;
    }, z.core.$strip>]>;
    sessionUpdate: z.ZodLiteral<"agent_message_chunk">;
}, z.core.$strip>, z.ZodObject<{
    content: z.ZodUnion<readonly [z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        text: z.ZodString;
        type: z.ZodLiteral<"text">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        type: z.ZodLiteral<"image">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        type: z.ZodLiteral<"audio">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        type: z.ZodLiteral<"resource_link">;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            blob: z.ZodString;
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>]>;
        type: z.ZodLiteral<"resource">;
    }, z.core.$strip>]>;
    sessionUpdate: z.ZodLiteral<"agent_thought_chunk">;
}, z.core.$strip>, z.ZodObject<{
    content: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        content: z.ZodUnion<readonly [z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            text: z.ZodString;
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            type: z.ZodLiteral<"resource_link">;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                blob: z.ZodString;
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>]>;
        type: z.ZodLiteral<"content">;
    }, z.core.$strip>, z.ZodObject<{
        newText: z.ZodString;
        oldText: z.ZodNullable<z.ZodString>;
        path: z.ZodString;
        type: z.ZodLiteral<"diff">;
    }, z.core.$strip>]>>>;
    kind: z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"other">]>;
    locations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        line: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        path: z.ZodString;
    }, z.core.$strip>>>;
    rawInput: z.ZodOptional<z.ZodUnknown>;
    sessionUpdate: z.ZodLiteral<"tool_call">;
    status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>;
    title: z.ZodString;
    toolCallId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    content: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        content: z.ZodUnion<readonly [z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            text: z.ZodString;
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            type: z.ZodLiteral<"resource_link">;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                blob: z.ZodString;
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>]>;
        type: z.ZodLiteral<"content">;
    }, z.core.$strip>, z.ZodObject<{
        newText: z.ZodString;
        oldText: z.ZodNullable<z.ZodString>;
        path: z.ZodString;
        type: z.ZodLiteral<"diff">;
    }, z.core.$strip>]>>>>;
    kind: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"other">]>>>;
    locations: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        line: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        path: z.ZodString;
    }, z.core.$strip>>>>;
    rawInput: z.ZodOptional<z.ZodUnknown>;
    sessionUpdate: z.ZodLiteral<"tool_call_update">;
    status: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>>;
    title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    toolCallId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    entries: z.ZodArray<z.ZodObject<{
        content: z.ZodString;
        priority: z.ZodUnion<readonly [z.ZodLiteral<"high">, z.ZodLiteral<"medium">, z.ZodLiteral<"low">]>;
        status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">]>;
    }, z.core.$strip>>;
    sessionUpdate: z.ZodLiteral<"plan">;
}, z.core.$strip>, z.ZodObject<{
    data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    operationId: z.ZodString;
    sessionUpdate: z.ZodLiteral<"streaming_update">;
    timestamp: z.ZodNumber;
    toolCallId: z.ZodString;
    type: z.ZodEnum<{
        status: "status";
        progress: "progress";
        step: "step";
        completion: "completion";
    }>;
}, z.core.$strip>]>;
export declare const agentResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    agentCapabilities: z.ZodObject<{
        loadSession: z.ZodOptional<z.ZodBoolean>;
        promptCapabilities: z.ZodOptional<z.ZodObject<{
            audio: z.ZodOptional<z.ZodBoolean>;
            embeddedContext: z.ZodOptional<z.ZodBoolean>;
            image: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    authMethods: z.ZodArray<z.ZodObject<{
        description: z.ZodNullable<z.ZodString>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>>;
    protocolVersion: z.ZodNumber;
}, z.core.$strip>, z.ZodNull, z.ZodObject<{
    sessionId: z.ZodString;
}, z.core.$strip>, z.ZodNull, z.ZodObject<{
    stopReason: z.ZodUnion<readonly [z.ZodLiteral<"end_turn">, z.ZodLiteral<"max_tokens">, z.ZodLiteral<"refusal">, z.ZodLiteral<"cancelled">]>;
}, z.core.$strip>]>;
export declare const requestPermissionRequestSchema: z.ZodObject<{
    options: z.ZodArray<z.ZodObject<{
        kind: z.ZodUnion<readonly [z.ZodLiteral<"allow_once">, z.ZodLiteral<"allow_always">, z.ZodLiteral<"reject_once">, z.ZodLiteral<"reject_always">]>;
        name: z.ZodString;
        optionId: z.ZodString;
    }, z.core.$strip>>;
    sessionId: z.ZodString;
    toolCall: z.ZodObject<{
        content: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            content: z.ZodUnion<readonly [z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                text: z.ZodString;
                type: z.ZodLiteral<"text">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                type: z.ZodLiteral<"image">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                type: z.ZodLiteral<"audio">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                type: z.ZodLiteral<"resource_link">;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    blob: z.ZodString;
                    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$strip>]>;
                type: z.ZodLiteral<"resource">;
            }, z.core.$strip>]>;
            type: z.ZodLiteral<"content">;
        }, z.core.$strip>, z.ZodObject<{
            newText: z.ZodString;
            oldText: z.ZodNullable<z.ZodString>;
            path: z.ZodString;
            type: z.ZodLiteral<"diff">;
        }, z.core.$strip>]>>>;
        kind: z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"other">]>;
        locations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            line: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            path: z.ZodString;
        }, z.core.$strip>>>;
        rawInput: z.ZodOptional<z.ZodUnknown>;
        status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>;
        title: z.ZodString;
        toolCallId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const initializeRequestSchema: z.ZodObject<{
    clientCapabilities: z.ZodObject<{
        fs: z.ZodObject<{
            readTextFile: z.ZodBoolean;
            writeTextFile: z.ZodBoolean;
        }, z.core.$strip>;
    }, z.core.$strip>;
    protocolVersion: z.ZodNumber;
}, z.core.$strip>;
export declare const sessionNotificationSchema: z.ZodObject<{
    sessionId: z.ZodString;
    update: z.ZodUnion<readonly [z.ZodObject<{
        content: z.ZodUnion<readonly [z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            text: z.ZodString;
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            type: z.ZodLiteral<"resource_link">;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                blob: z.ZodString;
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>]>;
        sessionUpdate: z.ZodLiteral<"user_message_chunk">;
    }, z.core.$strip>, z.ZodObject<{
        content: z.ZodUnion<readonly [z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            text: z.ZodString;
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            type: z.ZodLiteral<"resource_link">;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                blob: z.ZodString;
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>]>;
        sessionUpdate: z.ZodLiteral<"agent_message_chunk">;
    }, z.core.$strip>, z.ZodObject<{
        content: z.ZodUnion<readonly [z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            text: z.ZodString;
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            type: z.ZodLiteral<"resource_link">;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                blob: z.ZodString;
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>]>;
        sessionUpdate: z.ZodLiteral<"agent_thought_chunk">;
    }, z.core.$strip>, z.ZodObject<{
        content: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            content: z.ZodUnion<readonly [z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                text: z.ZodString;
                type: z.ZodLiteral<"text">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                type: z.ZodLiteral<"image">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                type: z.ZodLiteral<"audio">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                type: z.ZodLiteral<"resource_link">;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    blob: z.ZodString;
                    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$strip>]>;
                type: z.ZodLiteral<"resource">;
            }, z.core.$strip>]>;
            type: z.ZodLiteral<"content">;
        }, z.core.$strip>, z.ZodObject<{
            newText: z.ZodString;
            oldText: z.ZodNullable<z.ZodString>;
            path: z.ZodString;
            type: z.ZodLiteral<"diff">;
        }, z.core.$strip>]>>>;
        kind: z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"other">]>;
        locations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            line: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            path: z.ZodString;
        }, z.core.$strip>>>;
        rawInput: z.ZodOptional<z.ZodUnknown>;
        sessionUpdate: z.ZodLiteral<"tool_call">;
        status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>;
        title: z.ZodString;
        toolCallId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        content: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            content: z.ZodUnion<readonly [z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                text: z.ZodString;
                type: z.ZodLiteral<"text">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                type: z.ZodLiteral<"image">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                type: z.ZodLiteral<"audio">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                type: z.ZodLiteral<"resource_link">;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    blob: z.ZodString;
                    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$strip>]>;
                type: z.ZodLiteral<"resource">;
            }, z.core.$strip>]>;
            type: z.ZodLiteral<"content">;
        }, z.core.$strip>, z.ZodObject<{
            newText: z.ZodString;
            oldText: z.ZodNullable<z.ZodString>;
            path: z.ZodString;
            type: z.ZodLiteral<"diff">;
        }, z.core.$strip>]>>>>;
        kind: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"other">]>>>;
        locations: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
            line: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            path: z.ZodString;
        }, z.core.$strip>>>>;
        rawInput: z.ZodOptional<z.ZodUnknown>;
        sessionUpdate: z.ZodLiteral<"tool_call_update">;
        status: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>>;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        toolCallId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        entries: z.ZodArray<z.ZodObject<{
            content: z.ZodString;
            priority: z.ZodUnion<readonly [z.ZodLiteral<"high">, z.ZodLiteral<"medium">, z.ZodLiteral<"low">]>;
            status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">]>;
        }, z.core.$strip>>;
        sessionUpdate: z.ZodLiteral<"plan">;
    }, z.core.$strip>, z.ZodObject<{
        data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        operationId: z.ZodString;
        sessionUpdate: z.ZodLiteral<"streaming_update">;
        timestamp: z.ZodNumber;
        toolCallId: z.ZodString;
        type: z.ZodEnum<{
            status: "status";
            progress: "progress";
            step: "step";
            completion: "completion";
        }>;
    }, z.core.$strip>]>;
}, z.core.$strip>;
export declare const clientRequestSchema: z.ZodUnion<readonly [z.ZodObject<{
    content: z.ZodString;
    path: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    limit: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    line: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    path: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    options: z.ZodArray<z.ZodObject<{
        kind: z.ZodUnion<readonly [z.ZodLiteral<"allow_once">, z.ZodLiteral<"allow_always">, z.ZodLiteral<"reject_once">, z.ZodLiteral<"reject_always">]>;
        name: z.ZodString;
        optionId: z.ZodString;
    }, z.core.$strip>>;
    sessionId: z.ZodString;
    toolCall: z.ZodObject<{
        content: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            content: z.ZodUnion<readonly [z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                text: z.ZodString;
                type: z.ZodLiteral<"text">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                type: z.ZodLiteral<"image">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                type: z.ZodLiteral<"audio">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                type: z.ZodLiteral<"resource_link">;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    blob: z.ZodString;
                    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$strip>]>;
                type: z.ZodLiteral<"resource">;
            }, z.core.$strip>]>;
            type: z.ZodLiteral<"content">;
        }, z.core.$strip>, z.ZodObject<{
            newText: z.ZodString;
            oldText: z.ZodNullable<z.ZodString>;
            path: z.ZodString;
            type: z.ZodLiteral<"diff">;
        }, z.core.$strip>]>>>;
        kind: z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"other">]>;
        locations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            line: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            path: z.ZodString;
        }, z.core.$strip>>>;
        rawInput: z.ZodOptional<z.ZodUnknown>;
        status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>;
        title: z.ZodString;
        toolCallId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>]>;
export declare const agentRequestSchema: z.ZodUnion<readonly [z.ZodObject<{
    clientCapabilities: z.ZodObject<{
        fs: z.ZodObject<{
            readTextFile: z.ZodBoolean;
            writeTextFile: z.ZodBoolean;
        }, z.core.$strip>;
    }, z.core.$strip>;
    protocolVersion: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    methodId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    cwd: z.ZodString;
    mcpServers: z.ZodArray<z.ZodObject<{
        args: z.ZodArray<z.ZodString>;
        command: z.ZodString;
        env: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    cwd: z.ZodString;
    mcpServers: z.ZodArray<z.ZodObject<{
        args: z.ZodArray<z.ZodString>;
        command: z.ZodString;
        env: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
    }, z.core.$strip>>;
    sessionId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    prompt: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        text: z.ZodString;
        type: z.ZodLiteral<"text">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        type: z.ZodLiteral<"image">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        type: z.ZodLiteral<"audio">;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        type: z.ZodLiteral<"resource_link">;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
            lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            blob: z.ZodString;
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>]>;
        type: z.ZodLiteral<"resource">;
    }, z.core.$strip>]>>;
    sessionId: z.ZodString;
}, z.core.$strip>]>;
export declare const agentNotificationSchema: z.ZodObject<{
    sessionId: z.ZodString;
    update: z.ZodUnion<readonly [z.ZodObject<{
        content: z.ZodUnion<readonly [z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            text: z.ZodString;
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            type: z.ZodLiteral<"resource_link">;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                blob: z.ZodString;
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>]>;
        sessionUpdate: z.ZodLiteral<"user_message_chunk">;
    }, z.core.$strip>, z.ZodObject<{
        content: z.ZodUnion<readonly [z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            text: z.ZodString;
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            type: z.ZodLiteral<"resource_link">;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                blob: z.ZodString;
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>]>;
        sessionUpdate: z.ZodLiteral<"agent_message_chunk">;
    }, z.core.$strip>, z.ZodObject<{
        content: z.ZodUnion<readonly [z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            text: z.ZodString;
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            type: z.ZodLiteral<"resource_link">;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                blob: z.ZodString;
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>]>;
        sessionUpdate: z.ZodLiteral<"agent_thought_chunk">;
    }, z.core.$strip>, z.ZodObject<{
        content: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            content: z.ZodUnion<readonly [z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                text: z.ZodString;
                type: z.ZodLiteral<"text">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                type: z.ZodLiteral<"image">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                type: z.ZodLiteral<"audio">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                type: z.ZodLiteral<"resource_link">;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    blob: z.ZodString;
                    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$strip>]>;
                type: z.ZodLiteral<"resource">;
            }, z.core.$strip>]>;
            type: z.ZodLiteral<"content">;
        }, z.core.$strip>, z.ZodObject<{
            newText: z.ZodString;
            oldText: z.ZodNullable<z.ZodString>;
            path: z.ZodString;
            type: z.ZodLiteral<"diff">;
        }, z.core.$strip>]>>>;
        kind: z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"other">]>;
        locations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            line: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            path: z.ZodString;
        }, z.core.$strip>>>;
        rawInput: z.ZodOptional<z.ZodUnknown>;
        sessionUpdate: z.ZodLiteral<"tool_call">;
        status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>;
        title: z.ZodString;
        toolCallId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        content: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            content: z.ZodUnion<readonly [z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                text: z.ZodString;
                type: z.ZodLiteral<"text">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                type: z.ZodLiteral<"image">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                type: z.ZodLiteral<"audio">;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                type: z.ZodLiteral<"resource_link">;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                annotations: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                    audience: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>>>;
                    lastModified: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
                }, z.core.$strip>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    blob: z.ZodString;
                    mimeType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$strip>]>;
                type: z.ZodLiteral<"resource">;
            }, z.core.$strip>]>;
            type: z.ZodLiteral<"content">;
        }, z.core.$strip>, z.ZodObject<{
            newText: z.ZodString;
            oldText: z.ZodNullable<z.ZodString>;
            path: z.ZodString;
            type: z.ZodLiteral<"diff">;
        }, z.core.$strip>]>>>>;
        kind: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"other">]>>>;
        locations: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
            line: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            path: z.ZodString;
        }, z.core.$strip>>>>;
        rawInput: z.ZodOptional<z.ZodUnknown>;
        sessionUpdate: z.ZodLiteral<"tool_call_update">;
        status: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>>;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        toolCallId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        entries: z.ZodArray<z.ZodObject<{
            content: z.ZodString;
            priority: z.ZodUnion<readonly [z.ZodLiteral<"high">, z.ZodLiteral<"medium">, z.ZodLiteral<"low">]>;
            status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">]>;
        }, z.core.$strip>>;
        sessionUpdate: z.ZodLiteral<"plan">;
    }, z.core.$strip>, z.ZodObject<{
        data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        operationId: z.ZodString;
        sessionUpdate: z.ZodLiteral<"streaming_update">;
        timestamp: z.ZodNumber;
        toolCallId: z.ZodString;
        type: z.ZodEnum<{
            status: "status";
            progress: "progress";
            step: "step";
            completion: "completion";
        }>;
    }, z.core.$strip>]>;
}, z.core.$strip>;
//# sourceMappingURL=schema.d.ts.map