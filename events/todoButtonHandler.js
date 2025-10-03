const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // Only handle button interactions for todo items
    if (!interaction.isButton()) return;
    
    const buttonName = interaction.customId;
    
    // Only handle todo buttons
    if (!buttonName.startsWith("todo_fri_") && !buttonName.startsWith("todo_sat_")) return;
    
    try {
      // Extract the day and item index from the button ID
      const parts = buttonName.split('_');
      const day = parts[1]; // 'fri' or 'sat'
      const itemIndex = parseInt(parts[2]);
      
      // Get the current message content
      let messageContent = interaction.message.content;
      
      // Parse the current state of todo items from the message
      const lines = messageContent.split('\n');
      let todoItemLines = [];
      let lineIndex = 0;
      
      // Find all lines that contain todo items (those starting with 🟩 or ✅)
      for (const line of lines) {
        if (line.includes('🟩') || line.includes('✅')) {
          todoItemLines.push({
            content: line,
            originalIndex: lineIndex,
            isComplete: line.includes('✅')
          });
        }
        lineIndex++;
      }
      
      // Toggle the specific todo item
      if (itemIndex < todoItemLines.length) {
        const todoItem = todoItemLines[itemIndex];
        const isCurrentlyComplete = todoItem.isComplete;
        
        // Get the username for tracking - prefer server nickname, fallback to username
        const username = interaction.member?.displayName || interaction.user.username;
        
        // First, toggle the emoji status
        if (isCurrentlyComplete) {
          // Change from complete to not complete
          todoItem.content = todoItem.content.replace('✅', '🟩');
        } else {
          // Change from not complete to complete
          todoItem.content = todoItem.content.replace('🟩', '✅');
        }
        
        // Then, handle username replacement separately
        // Remove any existing username in brackets from the end of the line
        // More specific regex that only matches [username] pattern at the very end
        todoItem.content = todoItem.content.replace(/\s+\[[^\[\]]+\]$/, '');
        
        // Add the current username
        todoItem.content = todoItem.content + ` [${username}]`;
        
        // Update the message content
        const updatedLines = lines.slice();
        updatedLines[todoItem.originalIndex] = todoItem.content;
        const updatedContent = updatedLines.join('\n');
        
        // Update button components to reflect the new state
        const components = interaction.message.components.map(actionRow => {
          const newActionRow = new ActionRowBuilder();
          
          actionRow.components.forEach(button => {
            const buttonId = button.customId;
            const buttonParts = buttonId.split('_');
            const buttonItemIndex = parseInt(buttonParts[2]);
            
            // Determine if this button should show as complete or not
            const correspondingTodoItem = todoItemLines.find((item, index) => index === buttonItemIndex);
            const isButtonComplete = correspondingTodoItem ? 
              (buttonItemIndex === itemIndex ? !isCurrentlyComplete : correspondingTodoItem.isComplete) : false;
            
            const newButton = new ButtonBuilder()
              .setCustomId(buttonId)
            //   .setLabel(button.label)
              .setStyle(isButtonComplete ? ButtonStyle.Success : ButtonStyle.Secondary)
              .setEmoji(button.emoji || '✅');
            newActionRow.addComponents(newButton);
          });
          
          return newActionRow;
        });
        
        // Update the message
        await interaction.update({
          content: updatedContent,
          components: components
        });
        
        // Log the interaction
        const logDate = new Date().toLocaleString();
        const action = isCurrentlyComplete ? 'Unchecked' : 'Checked';
        console.log(`[${logDate}] 🔘 TODO${day.toUpperCase()}| ${interaction.guild.name} | ${interaction.channel.name} | ${interaction.user.username} | ${action} item ${itemIndex + 1}`);
        
      } else {
        console.error(`[ERROR] Todo item index ${itemIndex} out of range for ${day} checklist`);
        await interaction.reply({ content: 'Error: Invalid todo item index.', ephemeral: true });
      }
      
    } catch (error) {
      console.error(`[ERROR] Handling todo button interaction:`, error);
      try {
        await interaction.reply({ content: 'Error updating todo item. Please try again.', ephemeral: true });
      } catch (replyError) {
        console.error(`[ERROR] Failed to send error reply:`, replyError);
      }
    }
  },
};