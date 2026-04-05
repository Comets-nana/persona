import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../types';

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('봇 응답 속도 확인'),

  async execute(interaction) {
    const latency = Date.now() - interaction.createdTimestamp;
    await interaction.reply(`🏓 Pong! 응답속도: ${latency}ms`);
  },
};