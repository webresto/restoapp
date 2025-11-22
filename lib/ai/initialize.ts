/**
 * AI Agent Initialization for WebResto
 *
 * This file demonstrates how to initialize and configure the OpenAI Data Agent
 * for WebResto Core. It should be called from your bootstrap or configuration file.
 */

import { OpenAiDataAgentService } from './OpenAiDataAgentService';

// Global AI agent instance
let aiAgent: OpenAiDataAgentService | null = null;

/**
 * Initialize AI agent with custom configuration
 */
export async function initializeAiAgent(): Promise<void> {
  try {
    // Check if AI is enabled
    const aiEnabled = process.env.AI_ENABLED === 'true' || process.env.OPENAI_API_KEY;

    if (!aiEnabled) {
      sails.log.info('[AI Agent] Skipped: AI_ENABLED is not true or OPENAI_API_KEY is missing');
      return;
    }

    // Check if adminpanel is loaded
    if (!sails.hooks.adminpanel?.adminizer) {
      sails.log.info('[AI Agent] Skipped: Adminpanel not loaded yet');
      return;
    }

    sails.log.info('[AI Agent] Initializing OpenAI Data Agent...');

    // Create AI agent instance
    aiAgent = new OpenAiDataAgentService(sails.hooks.adminpanel.adminizer);

    if (!aiAgent.isEnabled()) {
      sails.log.warn('[AI Agent] Not configured: OPENAI_API_KEY is missing');
      return;
    }

    // Make agent globally available
    // @ts-ignore
    global.aiAgent = aiAgent;

    sails.log.info('[AI Agent] Successfully initialized and ready');

  } catch (error) {
    sails.log.error('[AI Agent] Initialization error:', error);
  }
}

/**
 * Get the global AI agent instance
 */
export function getAiAgent(): OpenAiDataAgentService | null {
  return aiAgent || (global as any).aiAgent || null;
}

/**
 * Check if AI agent is available and ready
 */
export function isAiAgentReady(): boolean {
  const agent = getAiAgent();
  return agent !== null && agent.isEnabled();
}

/**
 * Helper function to query AI with user context
 */
export async function queryAiAgent(
  prompt: string,
  user: any,
  history: any[] = []
): Promise<string> {
  const agent = getAiAgent();

  if (!agent) {
    throw new Error('AI Agent is not initialized');
  }

  if (!agent.isEnabled()) {
    throw new Error('AI Agent is not configured');
  }

  return await agent.generateReply(prompt, history, user);
}

/**
 * Example: Custom permission check function
 */
export function createCustomPermissionCheck() {
  return (user: any, modelName: string, action: string): boolean => {
    // Admins have full access
    if (user?.isAdmin) {
      return true;
    }

    // Managers can read orders and dishes
    if (user?.role === 'manager') {
      return action === 'read' && ['order', 'dish', 'group'].includes(modelName);
    }

    // Regular users can only read dishes and groups
    if (user?.role === 'user') {
      return action === 'read' && ['dish', 'group'].includes(modelName);
    }

    // Default: deny
    return false;
  };
}

/**
 * Example: Custom criteria filter
 */
export function createCustomCriteriaFilter() {
  return (user: any, modelName: string, criteria: any): any => {
    // Non-admin users can only see their own orders
    if (modelName === 'order' && !user?.isAdmin) {
      return {
        ...criteria,
        user: user.id
      };
    }

    return criteria;
  };
}
