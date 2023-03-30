const { BotFrameworkAdapter, MemoryStorage, ConversationState } = require('botbuilder');
const { BotActivityHandler } = require('../bot/botActivityHandler');
// const {
//     CloudAdapter,
//     ConfigurationBotFrameworkAuthentication
// } = require('botbuilder');

// const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env);

// const adapter = new CloudAdapter(botFrameworkAuthentication);
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. server insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       serverlication insights.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug, please fix the bot source code.');
};

// Define state store for your bot.
// See https://aka.ms/about-bot-state to learn more about bot state.
const memoryStorage = new MemoryStorage();

// Create conversation and user state with in-memory storage provider.
const conversationState = new ConversationState(memoryStorage);

// Create bot handlers
const botActivityHandler = new BotActivityHandler(conversationState);
const botHandler = (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Process bot activity
        await botActivityHandler.run(context);
    });
};

module.exports = botHandler;