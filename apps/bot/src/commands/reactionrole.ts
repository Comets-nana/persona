import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../types';
import { prisma } from '../lib/prisma';

export const reactionrole: Command = {
  data: new SlashCommandBuilder()
    .setName('반응역할')
    .setDescription('이모지 클릭 시 역할 부여 설정')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName('설정')
        .setDescription('반응 역할 추가')
        .addStringOption((o) =>
          o.setName('메시지id').setDescription('대상 메시지 ID').setRequired(true)
        )
        .addStringOption((o) =>
          o.setName('이모지').setDescription('사용할 이모지').setRequired(true)
        )
        .addRoleOption((o) =>
          o.setName('역할').setDescription('부여할 역할').setRequired(true)
        )
        .addRoleOption((o) =>
          o.setName('제거역할').setDescription('제거할 역할 (역할 교체용)').setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('해제')
        .setDescription('반응 역할 제거')
        .addStringOption((o) =>
          o.setName('메시지id').setDescription('대상 메시지 ID').setRequired(true)
        )
        .addStringOption((o) =>
          o.setName('이모지').setDescription('제거할 이모지').setRequired(true)
        )
    ) as SlashCommandBuilder,

  async execute(interaction) {
    const guildId = interaction.guildId!;
    const subcommand = interaction.options.getSubcommand();
    const messageId = interaction.options.getString('메시지id', true);
    const emoji = interaction.options.getString('이모지', true);

    await prisma.guild.upsert({
      where: { id: guildId },
      update: {},
      create: { id: guildId, name: interaction.guild!.name },
    });

    if (subcommand === '설정') {
      const role = interaction.options.getRole('역할', true);
      const removeRole = interaction.options.getRole('제거역할');

      await prisma.reactionRole.create({
        data: {
          guildId,
          channelId: interaction.channelId,
          messageId,
          emoji,
          roleId: role.id,
          removeRoleId: removeRole?.id ?? null,
        },
      });

      await interaction.reply({
        content: `✅ 반응 역할 설정 완료!\n메시지 ID: \`${messageId}\`\n이모지: ${emoji}\n역할: <@&${role.id}>`,
        flags: ['Ephemeral'],
      });
    } else if (subcommand === '해제') {
      await prisma.reactionRole.deleteMany({
        where: { guildId, messageId, emoji },
      });

      await interaction.reply({
        content: `✅ 반응 역할이 해제됐어요!`,
        flags: ['Ephemeral'],
      });
    }
  },
};