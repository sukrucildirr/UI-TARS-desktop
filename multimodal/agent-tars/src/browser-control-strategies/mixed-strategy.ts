/*
 * Copyright (c) 2025 Bytedance, Inc. and its affiliates.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToolDefinition } from '@multimodal/mcp-agent';
import { AbstractBrowserControlStrategy } from './base-strategy';

/**
 * MixedControlStrategy - Implements the 'default' browser control mode
 *
 * This strategy provides a hybrid approach that combines both GUI Agent (vision-based)
 * and MCP Browser (DOM-based) tools without handling conflicts between them.
 */
export class MixedControlStrategy extends AbstractBrowserControlStrategy {
  /**
   * Register both GUI Agent tools and complementary MCP Browser tools
   */
  async registerTools(registerToolFn: (tool: ToolDefinition) => void): Promise<string[]> {
    // Register GUI Agent tool if available
    if (this.guiAgent) {
      const guiAgentTool = this.guiAgent.getToolDefinition();
      registerToolFn(guiAgentTool);
      this.registeredTools.add(guiAgentTool.name);
    }

    // Register all browser tools from MCP Browser server
    if (this.browserClient) {
      // Register all browser tools except less useful content extraction tools
      // Prefer browser_get_markdown over other content extraction tools
      const browserTools = [
        // Navigation tools
        'browser_navigate',
        'browser_go_back',
        'browser_go_forward',

        // Content tools
        'browser_get_markdown',

        // Interaction tools
        'browser_click',
        'browser_form_input_fill',
        'browser_press_key',
        'browser_hover',
        'browser_scroll',
        'browser_select',

        // Status tools
        'browser_get_clickable_elements',
        'browser_read_links',

        // Visual tools
        'browser_screenshot',

        // Tab management
        'browser_tab_list',
        'browser_new_tab',
        'browser_close_tab',
        'browser_switch_tab',

        // Advanced tools
        'browser_evaluate',
      ];

      await this.registerMCPBrowserTools(registerToolFn, browserTools);
    }

    return Array.from(this.registeredTools);
  }
}
