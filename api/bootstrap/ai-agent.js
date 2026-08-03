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

      if (!adminizer.config.aiAssistant?.enabled) {
        sails.log.info('Bootstrap > AI Assistant disabled in config; skipping OpenHarness initialization.');
        return;
      }

      if (!adminizer.aiAssistantHandler) {
        sails.log.warn('Bootstrap > AI Assistant handler is unavailable; skipping OpenHarness initialization.');
        return;
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
