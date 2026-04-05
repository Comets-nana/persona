import { MessageReaction, User, PartialMessageReaction, PartialUser } from 'discord.js';
import { prisma } from '../lib/prisma';

export async function onReactionRemove(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) {
  if (user.bot) return;

  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();

  const emoji = reaction.emoji.id ?? reaction.emoji.name;
  if (!emoji) return;

  const guildId = reaction.message.guildId;
  if (!guildId) return;

  const config = await prisma.reactionRole.findFirst({
    where: {
      guildId,
      messageId: reaction.message.id,
      emoji,
    },
  });

  if (!config) return;

  const guild = reaction.message.guild!;
  const member = await guild.members.fetch(user.id);

  // 역할 제거
  const role = guild.roles.cache.get(config.roleId);
  if (role) {
    await member.roles.remove(role);
    console.log(`✅ ${user.tag} 에게서 ${role.name} 역할 제거`);
  }
}