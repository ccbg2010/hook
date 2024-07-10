const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

async function sendMessageToDiscord(payload) {
  try {
    await client.login(payload.token);

    const channel = await client.channels.fetch(payload.channelId);
    if (!channel) {
      throw new Error("Invalid channel ID.");
    }

    if (payload.content) {
      await channel.send(payload.content);
    } else if (payload.embeds) {
      await channel.send({ embeds: payload.embeds });
    } else {
      throw new Error("Neither content nor embeds provided.");
    }

    await client.destroy();
  } catch (error) {
    throw error;
  }
}

module.exports = {
  sendMessageToDiscord,
};
