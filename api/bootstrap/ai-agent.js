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

      // Check if AI Assistant is enabled in config
      if (!adminizer.config.aiAssistant?.enabled) {
        sails.log.info('Bootstrap > AI Assistant is disabled in config. Skipping agent registration.');
        return;
      }

      sails.log.info('Bootstrap > Registering OpenAI Data Agent...');

      // Dynamic import to avoid loading OpenAI dependencies when AI assistant is disabled
      const {OpenAiDataAgentService} = await import('../../lib/ai/OpenAiDataAgentService.ts');
      const openAiAgent = new OpenAiDataAgentService(adminizer);

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
    } catch (error) {
      sails.log.error('Bootstrap > Failed to initialize AI Agent:', error);
    }
  });
};
