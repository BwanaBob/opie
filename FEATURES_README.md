# Features System

The Features system provides a flexible, reusable way to create functionality that can be called from commands, events, jobs, or any other part of the bot.

## Overview

Features are modular pieces of functionality that:
- Are loaded automatically on bot startup
- Can be called from commands, events, jobs, or anywhere else
- Follow a consistent interface pattern
- Include proper error handling and logging
- Are easily testable and maintainable

## Structure

Features are located in the `/features` directory and follow this structure:

```javascript
module.exports = {
  name: 'featureName',
  description: 'Description of what this feature does',
  execute: async function(params) {
    // Feature implementation
    return result;
  }
};
```

## Available Features

### postMessage

Posts a message to a Discord channel.

**Parameters:**
- `client` (required): Discord client instance
- `channelId` (required): ID of the channel to post to
- `messageText` (required): Text content of the message
- `options` (optional): Additional options
  - `silent` (boolean): If true, suppress error logging

**Returns:** Promise<Message|null> - The sent message or null if failed

**Example:**
```javascript
const { postMessage } = require("../modules/featureHelper");

const sentMessage = await postMessage(
  client,
  "123456789012345678", // channel ID
  "Hello, world!"
);
```

## Using Features

### Method 1: Direct Access

```javascript
// Get the feature
const feature = client.features.get("postMessage");

// Execute it
const result = await feature.execute({
  client: client,
  channelId: "123456789012345678",
  messageText: "Hello from direct access!"
});
```

### Method 2: Helper Functions (Recommended)

```javascript
const { postMessage, executeFeature } = require("../modules/featureHelper");

// Using the specific helper
const result = await postMessage(client, channelId, messageText);

// Using the generic helper
const result = await executeFeature(client, "postMessage", {
  client: client,
  channelId: channelId,
  messageText: messageText
});
```

## Examples

### From a Command

```javascript
const { postMessage } = require("../modules/featureHelper");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Post an announcement"),
  
  async execute(interaction) {
    const result = await postMessage(
      interaction.client,
      interaction.channelId,
      "This is an announcement!"
    );
    
    if (result) {
      await interaction.reply("Announcement posted!");
    } else {
      await interaction.reply("Failed to post announcement.");
    }
  }
};
```

### From an Event

```javascript
const { postMessage } = require("../modules/featureHelper");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    await postMessage(
      member.client,
      "123456789012345678", // welcome channel ID
      `Welcome ${member.user}!`
    );
  }
};
```

### From a Job

```javascript
const { postMessage } = require("../modules/featureHelper");

module.exports = {
  execute(client) {
    var job = new CronJob('0 9 * * *', async () => {
      await postMessage(
        client,
        "123456789012345678", // daily channel ID
        "Good morning! Have a great day!"
      );
    });
    job.start();
  }
};
```

## Creating New Features

1. Create a new file in `/features/yourFeatureName.js`
2. Follow the standard structure:

```javascript
async function yourFeature({ param1, param2, options = {} }) {
  try {
    // Validate inputs
    if (!param1) {
      throw new Error('param1 is required');
    }
    
    // Do the work
    const result = await doSomething(param1, param2);
    
    // Log success (unless silent)
    if (!options.silent) {
      console.log(`✅ FEATURE | YourFeature completed successfully`);
    }
    
    return result;
    
  } catch (error) {
    if (!options.silent) {
      console.error(`❌ FEATURE | YourFeature failed: ${error.message}`);
    }
    return null;
  }
}

module.exports = {
  name: 'yourFeature',
  description: 'Description of your feature',
  execute: yourFeature
};
```

3. The feature will be automatically loaded on bot restart
4. Add helper functions to `featureHelper.js` if needed

## Helper Functions

The `featureHelper.js` module provides convenient functions:

- `getFeature(client, featureName)` - Get a feature by name
- `executeFeature(client, featureName, params)` - Execute any feature
- `postMessage(client, channelId, messageText, options)` - Post message helper
- `listFeatures(client)` - List all available features
- `hasFeature(client, featureName)` - Check if a feature exists

## Future Expansions

The postMessage feature is designed to be expanded with:
- Image attachment support
- AI-generated message text
- Rich embeds
- Message formatting options
- Reaction handling
- Thread creation

## Best Practices

1. Always validate input parameters
2. Use proper error handling
3. Provide meaningful logging
4. Support the `silent` option for logging
5. Return meaningful results or null on failure
6. Document your feature's parameters and return values
7. Use the helper functions when possible for cleaner code