const Discord = require('discord.js');
const Entities = require('html-entities').XmlEntities;
const axios = require('axios').default;
const startServer = require('./server');
require('dotenv').config();

const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

const candidates = new Set();
const entities = new Entities();

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function generateInsult(to) {
  try {
    let { insult } = (
      await axios.get('https://evilinsult.com/generate_insult.php', {
        params: {
          lang: 'en',
          type: 'json',
        },
      })
    ).data;

    insult = entities.decode(insult);

    return `${to}, ${insult[0].toLowerCase()}${insult.substring(1)}`;
  } catch (error) {
    console.log(`Error fetching result: ${error}`);
  }
}

async function generateCompliment(to) {
  try {
    let { compliment } = (
      await axios.get('https://complimentr.com/api', {})
    ).data;

    return `${to}, ${compliment[0].toLowerCase()}${compliment.substring(1)}`;
  } catch (error) {
    console.log(`Error fetching result: ${error}`);
  }
}

client.on('message', async (message) => {
  if (message.author.id === client.user.id) {
    return;
  }

  let messageString = message.content;

  if (!messageString.startsWith('!')) {
    return;
  }

  messageString = messageString.substring(1);
  const [command, ...args] = messageString.split(' ');

  if (command === 'insult') {
    let personToInsult;
    candidates.add(message.author);

    let candidatesArray = Array.from(candidates);

    if (args.length === 0) {
      personToInsult = randomElement(candidatesArray);
    } else {
      personToInsult = args.join(' ');
    }

    const insultText = await generateInsult(personToInsult);

    await message.channel.send(insultText);
  } else if (command === 'compliment') {
    let personToCompliment;
    candidates.add(message.author);

    let candidatesArray = Array.from(candidates);

    if (args.length === 0) {
      personToCompliment = randomElement(candidatesArray);
    } else {
      personToCompliment = args.join(' ');
    }

    const complimentText = await generateCompliment(personToCompliment);

    await message.channel.send(complimentText);
  }
});

startServer();
client.login(process.env.DISCORD_BOT_LOGIN); // Loaded from either .env or environment variable
