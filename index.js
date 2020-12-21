const Discord = require('discord.js');
const Entities = require('html-entities').XmlEntities;
const client = new Discord.Client();
const axios = require('axios').default;
require('dotenv').config();

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
  if (message.content.toLowerCase().startsWith('!insult')) {
    let personToInsult;
    candidates.add(message.author);

    let candidatesArray = Array.from(candidates);

    if (message.content.trim().length === 7) {
      personToInsult = randomElement(candidatesArray);
    } else {
      personToInsult =
        message.mentions.members.first() ||
        message.content.slice(7).trim().split(/ +/).join(' ');
      if (typeof personToInsult === 'string') {
        candidates.add(personToInsult);
      }
    }

    const insultText = await generateInsult(personToInsult);

    await message.channel.send(insultText);
  } else if (message.content.toLowerCase().startsWith('!compliment')) {
    let personToCompliment;
    candidates.add(message.author);

    let candidatesArray = Array.from(candidates);

    if (message.content.trim().length === 11) {
      personToCompliment = randomElement(candidatesArray);
    } else {
      personToCompliment =
        message.mentions.members.first() ||
        message.content.slice(11).trim().split(/ +/).join(' ');
      if (typeof personToCompliment === 'string') {
        candidates.add(personToCompliment);
      }
    }

    const complimentText = await generateCompliment(personToCompliment);

    await message.channel.send(complimentText);
  }
});

client.login(process.env.DISCORD_BOT_LOGIN);
