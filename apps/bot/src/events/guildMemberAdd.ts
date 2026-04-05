import { GuildMember } from 'discord.js';
import { prisma } from '../lib/prisma';

export async function onGuildMemberAdd(member: GuildMember) {
  // DB에서 해당 서버 자동 역할 조회
  const autoRoles = await prisma.autoRole.findMany({
    where: { guildId: member.guild.id },
  });

  if (autoRoles.length === 0) return;

  for (const autoRole of autoRoles) {
    const role = member.guild.roles.cache.get(autoRole.roleId);
    if (!role) continue;

    try {
      await member.roles.add(role);
      console.log(`✅ ${member.user.tag} 에게 ${role.name} 역할 부여`);
    } catch (error) {
      console.error(`❌ 역할 부여 실패: ${error}`);
    }
  }
}