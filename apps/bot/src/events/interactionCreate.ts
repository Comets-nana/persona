import { Events, Interaction } from 'discord.js';
import { commands } from '../commands';

export const interactionCreate = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '❌ 오류가 발생했습니다.',
        ephemeral: true,
      });
    }
  },
};