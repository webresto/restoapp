'use strict';

/**
 * Bootstrap file for AI agent initialization.
 * This file is automatically loaded by Sails during bootstrap.
 */
module.exports.default = async function (sails) {
  sails.log.debug('Bootstrap > AI Agent initialization starting...');

  // Wait for Adminpanel to be loaded
  sails.on('Adminpanel:loaded', async () => {
    try {
      const adminizer = sails.hooks.adminpanel.adminizer;

      // OpenHarness is configured independently from the legacy OpenAI agent.
      // Do not let the legacy OpenAI toggle prevent Adminizer from creating
      // aiAssistantHandler for later model registration.
      if (!adminizer.config.aiAssistant?.enabled) {
        adminizer.config.aiAssistant = {
          ...(adminizer.config.aiAssistant ?? {}),
          enabled: true,
          models: adminizer.config.aiAssistant?.models ?? [],
          defaultModel: adminizer.config.aiAssistant?.defaultModel ?? 'openharness',
        };
        sails.log.info('Bootstrap > Enabling AI Assistant for OpenHarness model registration.');
      }

      // Connection manager: resolves setting/env keys or self-registers through
      // the LiteLLM frontend broker (with retries) when no key exists yet.
      const {OpenHarnessConnectionManager} = require('../../lib/ai/OpenHarnessConnectionManager');
      const {LlmLimitsService} = require('../../lib/ai/LlmLimitsService');
      const connectionManager = new OpenHarnessConnectionManager();
      adminizer.openHarnessConnectionManager = connectionManager;
      adminizer.openHarnessLimitsService = new LlmLimitsService();

      const {OpenHarnessDataAgentService} = require('../../lib/ai/OpenHarnessDataAgentService');
      const openHarnessAgent = new OpenHarnessDataAgentService(adminizer, connectionManager);

      // The agent is registered even before a key is available: the admin page
      // shows a registration loader (driven by /api/openharness/status) until
      // the manager reports ready.
      adminizer.aiAssistantHandler.registerModel(openHarnessAgent);
      adminizer.openHarnessAgentService = openHarnessAgent;
      const declaredModels = new Set(adminizer.config.aiAssistant.models ?? []);
      declaredModels.add(openHarnessAgent.id);
      adminizer.config.aiAssistant.models = Array.from(declaredModels);
      sails.log.debug(`Bootstrap > OpenHarness agent registered with ID: ${openHarnessAgent.id}`);

      await connectionManager.init();
      const status = connectionManager.getStatus();
      if (status.state === 'ready') {
        sails.log.info(`Bootstrap > OpenHarness connected (${status.source} key, ${status.provider} @ ${status.baseUrl})`);
      } else {
        sails.log.warn(`Bootstrap > OpenHarness is not connected yet (${status.state}${status.lastError ? `: ${status.lastError}` : ''}). Registration keeps retrying in the background.`);
      }
    } catch (error) {
      sails.log.error('Bootstrap > Failed to initialize AI Agent:', error);
    }
  });
};
