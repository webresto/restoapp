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

      const {OpenHarnessDataAgentService} = require('../../lib/ai/OpenHarnessDataAgentService');
      const openHarnessAgent = new OpenHarnessDataAgentService(adminizer);

      if (openHarnessAgent.isEnabled()) {
        adminizer.aiAssistantHandler.registerModel(openHarnessAgent);
        adminizer.openHarnessAgentService = openHarnessAgent;
        const declaredModels = new Set(adminizer.config.aiAssistant.models ?? []);
        declaredModels.add(openHarnessAgent.id);
        adminizer.config.aiAssistant.models = Array.from(declaredModels);
        sails.log.debug(`Bootstrap > OpenHarness agent successfully registered with ID: ${openHarnessAgent.id}`);
      } else {
        sails.log.warn('Bootstrap > Skipping OpenHarness agent registration. Set OPENHARNESS_API_KEY, OPENHARNESS_MODEL, and OPENHARNESS_BASE_URL.');
      }
    } catch (error) {
      sails.log.error('Bootstrap > Failed to initialize AI Agent:', error);
    }
  });
};
