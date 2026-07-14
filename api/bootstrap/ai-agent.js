'use strict';

/**
 * Bootstrap file for OpenAI Data Agent initialization
 * This file is automatically loaded by Sails during bootstrap
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

      sails.log.info('Bootstrap > Registering OpenAI Data Agent...');

      // Dynamic import to avoid loading OpenAI dependencies when AI assistant is disabled
      const {OpenAiDataAgentService} = require('../../lib/ai/OpenAiDataAgentService');
      const openAiAgent = new OpenAiDataAgentService(adminizer);
      const {OpenHarnessDataAgentService} = require('../../lib/ai/OpenHarnessDataAgentService');
      const openHarnessAgent = new OpenHarnessDataAgentService(adminizer);

      if (openAiAgent.isEnabled()) {
        adminizer.aiAssistantHandler.registerModel(openAiAgent);

        // Update config to include the agent
        if (adminizer.config.aiAssistant) {
          const declaredModels = new Set(adminizer.config.aiAssistant.models ?? []);
          declaredModels.add(openAiAgent.id);
          adminizer.config.aiAssistant.models = Array.from(declaredModels);

          // Set as default model if no default is set or if default is 'dummy'
          if (!adminizer.config.aiAssistant.defaultModel || adminizer.config.aiAssistant.defaultModel === 'dummy') {
            adminizer.config.aiAssistant.defaultModel = openAiAgent.id;
          }
        }

        sails.log.debug(`Bootstrap > OpenAI data agent successfully registered with ID: ${openAiAgent.id}`);
      } else {
        sails.log.warn('Bootstrap > Skipping OpenAI data agent registration because OPENAI_API_KEY is missing.');
        sails.log.warn('Bootstrap > Please set OPENAI_API_KEY environment variable to enable the agent.');
      }

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
