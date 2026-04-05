import { MessageReaction, User, PartialMessageReaction, PartialUser } from 'discord.js';
import { prisma } from '../lib/prisma';

export async function onReactionAdd(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
) {
try {
    if (user.bot) return;

    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    const emoji = reaction.emoji.id ?? reaction.emoji.name;
    if (!emoji) return;

    const guildId = reaction.message.guildId;
    if (!guildId) return;

    console.log(`🔍 반응 감지: ${emoji} / 메시지ID: ${reaction.message.id} / 서버ID: ${guildId}`);

    const config = await prisma.reactionRole.findFirst({
    where: { guildId, messageId: reaction.message.id, emoji },
    });

    console.log(`🔍 DB 조회 결과:`, config);

    if (!config) return;

    const guild = reaction.message.guild!;
    const member = await guild.members.fetch(user.id);

    if (config.removeRoleId) {
    const removeRole = guild.roles.cache.get(config.removeRoleId);
    if (removeRole) await member.roles.remove(removeRole);
    }

    const role = guild.roles.cache.get(config.roleId);
    if (role) {
    await member.roles.add(role);
    console.log(`✅ ${user.tag} 에게 ${role.name} 역할 부여`);
    }
} catch (error) {
    console.error('❌ reactionAdd 에러:', error);
}
}