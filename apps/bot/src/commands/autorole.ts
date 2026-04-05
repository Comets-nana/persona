import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../types';
import { prisma } from '../lib/prisma';

export const autorole: Command = {
  data: new SlashCommandBuilder()
    .setName('자동역할')
    .setDescription('서버 입장 시 자동 부여할 역할 설정')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName('설정')
        .setDescription('자동 역할 추가')
        .addRoleOption((option) =>
          option.setName('역할').setDescription('부여할 역할').setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('해제')
        .setDescription('자동 역할 제거')
        .addRoleOption((option) =>
          option.setName('역할').setDescription('제거할 역할').setRequired(true)
        )
    ) as SlashCommandBuilder,

  async execute(interaction) {
    const guildId = interaction.guildId!;
    const subcommand = interaction.options.getSubcommand();
    const role = interaction.options.getRole('역할', true);

    // Guild 없으면 생성
    await prisma.guild.upsert({
      where: { id: guildId },
      update: {},
      create: { id: guildId, name: interaction.guild!.name },
    });

    if (subcommand === '설정') {
      await prisma.autoRole.create({
        data: { guildId, roleId: role.id },
      });
      await interaction.reply({
        content: `✅ <@&${role.id}> 역할이 자동 부여 목록에 추가됐어요!`,
        flags: ['Ephemeral'],
      });
    } else if (subcommand === '해제') {
      await prisma.autoRole.deleteMany({
        where: { guildId, roleId: role.id },
      });
      await interaction.reply({
        content: `✅ <@&${role.id}> 역할이 자동 부여 목록에서 제거됐어요!`,
        flags: ['Ephemeral'],
      });
    }
  },
};