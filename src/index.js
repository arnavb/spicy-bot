const Discord = require('discord.js');
const util = require('util');
const fs = require('fs');
const Entities = require('html-entities').XmlEntities;
const axios = require('axios').default;
const startServer = require('./server');
const { randomElement } = require('./utils');

require('dotenv').config();
const readdir = util.promisify(fs.readdir);

const client = new Discord.Client();
let commands = null;

const context = {
  candidates: new Set(),
  entities: new Entities(),
};

async function loadCommands() {
  const result = new Discord.Collection();

  const allCommandFiles = (
    await readdir(`${__dirname}/commands`)
  ).filter((file) => file.endsWith('.js'));

  for (const file of allCommandFiles) {
    const command = require(`${__dirname}/commands/${file}`);
    result.set(command.name, command);
  }
  return result;
}

client.once('ready', async () => {
  commands = await loadCommands();
  console.log('Loaded all commands');

  console.log('Ready!');
});

client.on('message', async (message) => {
  if (message.author.id === client.user.id) {
    return;
  }

  let messageString = message.content;

  if (!messageString.startsWith('!')) {
    return;
  }

  messageString = messageString.substring(1);
  const [commandName, ...args] = messageString.split(' ');

  const command = commands.find((cmd) => cmd.name == commandName);

  if (!command) {
    return;
  }

  command.execute(args, message, context);
});

startServer();
client.login(process.env.DISCORD_BOT_LOGIN); // Loaded from either .env or environment variable
