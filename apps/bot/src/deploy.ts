import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import { commands } from './commands';

dotenv.config();

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  console.log('🔄 슬래시 커맨드 등록 중...');

  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID!),
    { body: commands.map((cmd) => cmd.data.toJSON()) },
  );

  console.log('✅ 슬래시 커맨드 등록 완료!');
})();