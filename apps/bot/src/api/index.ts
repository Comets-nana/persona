import express from 'express';
import cors from 'cors';
import { Client, TextChannel } from 'discord.js';

export function startApiServer(discordClient: Client) {
  const app = express();
  app.use(cors({ origin: 'http://localhost:3000' }));
  app.use(express.json());

  app.post('/api/embed', async (req, res) => {
    const { channelId, embed, content } = req.body;

    try {
      const channel = await discordClient.channels.fetch(channelId);
      if (!channel || !(channel instanceof TextChannel)) {
        return res.status(404).json({ error: '채널을 찾을 수 없어요.' });
      }

      await channel.send({
        content: content || undefined,
        embeds: embed ? [embed] : [],
      });

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '메시지 전송에 실패했어요.' });
    }
  });

  app.listen(4000, () => {
    console.log('🚀 Bot API 서버 실행 중: http://localhost:4000');
  });
}