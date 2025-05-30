/*
 * Copyright (c) 2025 Bytedance, Inc. and its affiliates.
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { AgentOptions } from './agent-options';
import {
  AgentStatus,
  LLMRequestHookPayload,
  LLMResponseHookPayload,
  LLMStreamingResponseHookPayload,
  SummaryRequest,
  SummaryResponse,
  LoopTerminationCheckResult,
} from './agent-instance';
import { AgentRunObjectOptions, AgentRunStreamingOptions } from './agent-run-options';
import {
  ChatCompletionMessageToolCall,
  OpenAI,
  ChatCompletionCreateParams,
  ChatCompletion,
  RequestOptions,
  ChatCompletionChunk,
} from '@multimodal/model-provider/types';
import { ToolCallResult } from './tool-call-engine';
import { ResolvedModel } from '@multimodal/model-provider';
import { AgentEventStream } from './agent-event-stream';

/**
 * Core Agent interface defining the essential methods and behaviors
 * that all agent implementations must support.
 */
<<<<<<< HEAD
export interface IAgent<T extends AgentOptions = AgentOptions> {
  /**
   * Initialize the agent, performing any required setup
   * This may be time-consuming operations that need to be completed before the agent can run
   */
  initialize(): void | Promise<void>;

  /**
   * Run the agent with the provided input
   *
   * @param input - String input for a basic text message
   * @returns The final response event from the agent
   */
  run(input: string): Promise<AgentEventStream.AssistantMessageEvent>;

  /**
   * Run the agent with additional configuration options
   *
   * @param options - Object with input and optional configuration
   * @returns The final response event from the agent
   */
  run(
    options: AgentRunObjectOptions & { stream?: false },
  ): Promise<AgentEventStream.AssistantMessageEvent>;

  /**
   * Run the agent in streaming mode
   *
   * @param options - Object with input and streaming enabled
   * @returns An async iterable of streaming events
   */
  run(options: AgentRunStreamingOptions): Promise<AsyncIterable<AgentEventStream.Event>>;

  /**
   * Abort the currently running agent task
   *
   * @returns True if an execution was aborted, false otherwise
   */
  abort(): boolean;

  /**
   * Get the current execution status of the agent
   *
   * @returns The current agent status
   */
  status(): AgentStatus;

  /**
   * Get the event stream associated with this agent
   *
   * @returns The event stream instance
   */
  getEventStream(): AgentEventStream.Processor;

  /**
   * Get the configured LLM client for making direct requests
   *
   * @returns The configured OpenAI-compatible LLM client instance or undefined if not available
   */
  getLLMClient(): OpenAI | undefined;

  /**
   * Generate a summary of conversation messages
   *
   * FIXME: remove it, high-level layout can use resolved model to implement it.
   *
   * @param request The summary request containing messages and optional model settings
   * @returns Promise resolving to the summary response
   */
  generateSummary(request: SummaryRequest): Promise<SummaryResponse>;

  /**
   * Get the current resolved model configuration
   *
   * @returns The current resolved model configuration or undefined if not set
   */
  getCurrentResolvedModel(): ResolvedModel | undefined;

  /**
   * Hook called before sending a request to the LLM
   *
   * @param id Session identifier for this conversation
   * @param payload The complete request payload
   */
  onLLMRequest(id: string, payload: LLMRequestHookPayload): void | Promise<void>;

  /**
   * Hook called after receiving a response from the LLM
   *
   * @param id Session identifier for this conversation
   * @param payload The complete response payload
   */
  onLLMResponse(id: string, payload: LLMResponseHookPayload): void | Promise<void>;

  /**
   * Hook called after receiving streaming responses from the LLM
   *
   * @param id Session identifier for this conversation
   * @param payload The streaming response payload
   */
  onLLMStreamingResponse(id: string, payload: LLMStreamingResponseHookPayload): void;

  /**
   * Hook called before a tool is executed
   *
   * @param id Session identifier for this conversation
   * @param toolCall Information about the tool being called
   * @param args The arguments for the tool call
   * @returns The possibly modified args for the tool call
   */
  onBeforeToolCall(
    id: string,
    toolCall: { toolCallId: string; name: string },
    args: any,
  ): Promise<any> | any;

  /**
   * Hook called after a tool is executed
   *
   * @param id Session identifier for this conversation
   * @param toolCall Information about the tool that was called
   * @param result The result of the tool call
   * @returns The possibly modified result of the tool call
   */
  onAfterToolCall(
    id: string,
    toolCall: { toolCallId: string; name: string },
    result: any,
  ): Promise<any> | any;

  /**
   * Hook called when a tool execution results in an error
   *
   * @param id Session identifier for this conversation
   * @param toolCall Information about the tool that was called
   * @param error The error that occurred
   * @returns A potentially modified error or recovery value
   */
  onToolCallError(
    id: string,
    toolCall: { toolCallId: string; name: string },
    error: any,
  ): Promise<any> | any;

  /**
   * Hook called at the beginning of each agent loop iteration
   *
   * @param sessionId The session identifier for this conversation
   * @returns A promise that resolves when pre-iteration setup is complete
   */
  onEachAgentLoopStart(sessionId: string): void | Promise<void>;

  /**
   * Hook called at the end of the agent's execution loop
   *
   * @param id Session identifier for the completed conversation
   */
  onAgentLoopEnd(id: string): void | Promise<void>;

  /**
   * Hook called before processing a batch of tool calls
   *
   * @param id Session identifier for this conversation
   * @param toolCalls Array of tool calls to be processed
   * @returns Either undefined (to execute tools normally) or an array of tool call results (to skip execution)
   */
  onProcessToolCalls(
    id: string,
    toolCalls: ChatCompletionMessageToolCall[],
  ): Promise<ToolCallResult[] | undefined> | ToolCallResult[] | undefined;

  /**
   * Hook called when the agent loop is about to terminate with a final answer
   *
   * @param id Session identifier for this conversation
   * @param finalEvent The final assistant message event that would end the loop
   * @returns Decision object indicating whether to finish or continue the loop
   */
  onBeforeLoopTermination(
    id: string,
    finalEvent: AgentEventStream.AssistantMessageEvent,
  ): Promise<LoopTerminationCheckResult> | LoopTerminationCheckResult;

  /**
   * Request to terminate the agent loop after the current iteration
   *
   * @returns True if the termination request was set, false if already terminating
   */
  requestLoopTermination(): boolean;

  /**
   * Check if loop termination has been requested
   *
   * @returns True if termination has been requested
   */
  isLoopTerminationRequested(): boolean;

  /**
   * Get the current iteration/loop number of the agent's reasoning process
   *
   * @returns The current loop iteration (1-based, 0 if not running)
   */
  getCurrentLoopIteration(): number;

  /**
   * Get the agent's configuration options
   *
   * @returns The agent configuration options used during initialization
   */
  getOptions(): T;

  /**
   * Convenient method to call the current selected LLM with chat completion api.
   *
   * @param params - ChatCompletion parameters (without model, supports stream parameter for type inference)
   * @param options - Optional request options (e.g., signal for abort)
   * @returns Promise resolving to ChatCompletion for non-streaming, or AsyncIterable<ChatCompletionChunk> for streaming
   */
  callLLM(
    params: Omit<ChatCompletionCreateParams, 'model'> & { stream?: false },
    options?: RequestOptions,
  ): Promise<ChatCompletion>;

  callLLM(
    params: Omit<ChatCompletionCreateParams, 'model'> & { stream: true },
    options?: RequestOptions,
  ): Promise<AsyncIterable<ChatCompletionChunk>>;

  callLLM(
    params: Omit<ChatCompletionCreateParams, 'model'>,
    options?: RequestOptions,
  ): Promise<ChatCompletion | AsyncIterable<ChatCompletionChunk>>;
=======
export enum AgentStatus {
  /** Agent is idle and ready to accept new tasks */
  IDLE = 'idle',
  /** Agent is currently executing a task */
  EXECUTING = 'executing',
  /** Agent execution has been aborted */
  ABORTED = 'aborted',
  /** Agent has encountered an error */
  ERROR = 'error',
}

/**
 * Some setting options used to instantiate an Agent.
 */
export interface AgentOptions {
  /**
   * Model settings.
   *
   * @defaultValue {undefined}
   */
  model?: ModelSetting;

  /**
   * Optional unique identifier for this agent instance.
   * Useful for tracking and logging purposes.
   *
   * @defaultValue `"@multimodal/agent"`
   */
  id?: string;

  /**
   * Agent's name, useful for tracing.
   *
   * @defaultValue `"Anonymous"`
   */
  name?: string;

  /**
   * Used to define the Agent's system prompt.
   *
   * @defaultValue `undefined`
   */
  instructions?: string;

  /**
   * Maximum number of iterations of the agent.
   *
   * @defaultValue `50`
   */
  maxIterations?: number;

  /**
   * Maximum number of tokens allowed in the context window.
   *
   * @defaultValue `1000`
   */
  maxTokens?: number;

  /**
   * Temperature used for LLM sampling, controlling randomness.
   * Lower values make the output more deterministic (e.g., 0.1).
   * Higher values make the output more random/creative (e.g., 1.0).
   *
   * @defaultValue `0.7`
   */
  temperature?: number;

  /**
   * Agent tools definition
   *
   * @defaultValue `undefined`
   */
  tools?: ToolDefinition[];

  /**
   * An experimental API for the underlying engine of Tool Call.
   *
   * In some LLMs that do not natively support Function Call, or in scenarios without OpenAI Compatibility,
   * you can switch to Prompt Engineering Engine to drive your Tool Call without changing any code.
   *
   * @defaultValue `'native'`
   */
  toolCallEngine?: ToolCallEngineType;

  /**
   * Used to control the reasoning content.
   */
  thinking?: AgentReasoningOptions;

  /**
   * Event stream options to configure the event stream behavior
   */
  eventStreamOptions?: EventStreamOptions;

  /**
   * Log level setting for agent's logger. Controls verbosity of logs.
   *
   * @defaultValue `LogLevel.INFO` in development, `LogLevel.WARN` in production
   */
  logLevel?: LogLevel;

  /**
   * Agent context awareness options
   *
   * Controls how message history is managed and what context is included
   */
  context?: AgentContextAwarenessOptions;
}

/**
 * Options for configuring agent context behavior (e.g. message history)
 */
export interface AgentContextAwarenessOptions {
  /**
   * Maximum number of images to include in the conversation history.
   *
   * When specified, this limits the total number of images in the context
   * to prevent context window overflow in LLM requests. Images beyond this limit
   * will be replaced with text placeholders that retain context information.
   *
   * This helps optimize token usage while preserving important conversation context.
   */
  maxImagesCount?: number;
}

/**
 * Agent reasoning options
 */
export interface AgentReasoningOptions {
  /**
   * Whether to enable reasoning
   *
   * @defaultValue {'disabled'}.
   *
   * @compatibility Supported models: 'claude', 'doubao-1.5-thinking'
   */
  type?: 'disabled' | 'enabled';

  /**
   * The `budgetTokens` parameter determines the maximum number of tokens
   * Model is allowed to use for its internal reasoning process.
   *
   * @compatibility Supported models: 'claude'.
   */
  budgetTokens?: number;
}

/**
 * Base options for running an agent without specifying streaming mode
 */
export interface AgentRunBaseOptions {
  /**
   * Multimodal message.
   */
  input: string | ChatCompletionContentPart[];
  /**
   * Model id used to run the agent.
   *
   * @defaultValue "model.use" or the first configured "model.providers."
   */
  model?: string;
  /**
   * Model provider used to run the agent.
   *
   * @defaultValue "model.use" or the first configured "model.providers."
   */
  provider?: ModelProviderName;
  /**
   * Optional session identifier to track the agent loop conversation
   * If not provided, a random ID will be generated
   */
  sessionId?: string;
  /**
   * An experimental API for the underlying engine of Tool Call.
   *
   * @defaultValue "toolCallEngine" in agent options
   */
  toolCallEngine?: ToolCallEngineType;
  /**
   * Abort signal for canceling the execution
   * @internal This is set internally by the Agent class
   */
  abortSignal?: AbortSignal;
}

/**
 * Object options for running agent in non-streaming mode
 */
export type AgentRunNonStreamingOptions = AgentRunBaseOptions & { stream?: false };

/**
 * Object options for running agent in streaming mode
 */
export interface AgentRunStreamingOptions extends AgentRunBaseOptions {
  /**
   * Enable streaming mode to receive incremental responses
   */
  stream: true;
}

/**
 * Combined type for all object-based run options
 */
export type AgentRunObjectOptions = AgentRunNonStreamingOptions | AgentRunStreamingOptions;

/**
 * Agent run options - either a string or an options object
 */
export type AgentRunOptions = string /* text prompt */ | AgentRunObjectOptions;

/**
 * Type guard function to check if an AgentRunOptions is an AgentRunObjectOptions
 * @param options - The options to check
 * @returns True if the options is an AgentRunObjectOptions, false otherwise
 */
export function isAgentRunObjectOptions(
  options: AgentRunOptions,
): options is AgentRunObjectOptions {
  return typeof options !== 'string' && 'input' in options;
}

/**
 * Type guard to check if options specify streaming mode
 * @param options - The options to check
 * @returns True if streaming mode is enabled
 */
export function isStreamingOptions(
  options: AgentRunObjectOptions,
): options is AgentRunStreamingOptions {
  return options.stream === true;
}

/**
 * An interface used to describe the output of a single run of the Agent.
 */
export interface AgentSingleLoopReponse {
  /**
   * Assistent's response
   *
   * FIXME: Support multimodal output.
   */
  content: string;
  /**
   * Tool calls.
   */
  toolCalls?: ChatCompletionMessageToolCall[];
}

/**
 * Merged llm request, including reasoning parameters.
 */
export type LLMRequest = ChatCompletionMessageParam & {
  /**
   * Agent reasoning options
   */
  thinking?: AgentReasoningOptions;
};

/**
 * Type for LLM request hook payload - containing all information about the request
 */
export interface LLMRequestHookPayload {
  /**
   * The model provider name
   */
  provider: string;
  /**
   * The complete request parameters
   */
  request: LLMRequest;
  /**
   * The requested base url
   */
  baseURL?: string;
}

/**
 * Type for LLM response hook payload
 */
export interface LLMResponseHookPayload {
  /**
   * The model provider name
   */
  provider: string;
  /**
   * The complete model response
   */
  response: ChatCompletion;
}

/**
 * Type for LLM response hook payload - streaming version
 */
export interface LLMStreamingResponseHookPayload {
  /**
   * The model provider name
   */
  provider: string;
  /**
   * The complete stream of chunks
   */
  chunks: ChatCompletionChunk[];
}

/**
 * LLM request for summary generation
 */
export interface SummaryRequest {
  /**
   * The conversation messages to summarize
   */
  messages: ChatCompletionMessageParam[];

  /**
   * The model to use for summarization (optional)
   */
  model?: string;

  /**
   * The provider to use for summarization (optional)
   */
  provider?: ModelProviderName;

  /**
   * Abort signal for canceling the request
   */
  abortSignal?: AbortSignal;
}

/**
 * Summary response from LLM
 */
export interface SummaryResponse {
  /**
   * The generated summary text
   */
  summary: string;

  /**
   * The model used for generating the summary
   */
  model: string;

  /**
   * The provider used for generating the summary
   */
  provider: string;
}

/**
 * Result of loop termination check in onBeforeLoopTermination hook
 * Used to decide whether to finish or continue the agent loop
 */
export interface LoopTerminationCheckResult {
  /**
   * Whether the loop should finish (true) or continue (false)
   */
  finished: boolean;

  /**
   * Optional message explaining why the loop should continue
   * Only used when finished is false
   */
  message?: string;
>>>>>>> b4afad11 (Update agent.ts)
}
