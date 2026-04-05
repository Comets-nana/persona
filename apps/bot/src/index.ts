import {
    Client,
    GatewayIntentBits,
    Events,
    Interaction,
    GuildMember,
    MessageReaction,
    PartialMessageReaction,
    User,
    PartialUser,
    Partials,
  } from 'discord.js';
import * as dotenv from 'dotenv';
import { prisma } from './lib/prisma';
import { commands } from './commands';
import { onGuildMemberAdd } from './events/guildMemberAdd';
import { onReactionAdd } from './events/reactionAdd';
import { onReactionRemove } from './events/reactionRemove';

dotenv.config();

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
      Partials.Message,
      Partials.Channel,
      Partials.Reaction,
    ],
});

client.once(Events.ClientReady, async (c) => {
console.log(`✅ Persona 봇 준비 완료: ${c.user.tag}`);
const guildCount = await prisma.guild.count();
console.log(`📦 DB 연결 성공! 등록된 서버 수: ${guildCount}`);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
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
});

client.on(Events.GuildMemberAdd, (member: GuildMember) => {
onGuildMemberAdd(member);
});

client.on(
Events.MessageReactionAdd,
(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    onReactionAdd(reaction, user);
}
);

client.on(
Events.MessageReactionRemove,
(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    onReactionRemove(reaction, user);
}
);

client.login(process.env.DISCORD_TOKEN);