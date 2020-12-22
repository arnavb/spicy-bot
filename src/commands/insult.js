const axios = require('axios').default;
const { randomElement } = require('./../utils');

async function generateInsult(to, entities) {
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

async function execute(args, message, context) {
  let personToInsult;
  context.candidates.add(message.author);

  let candidatesArray = Array.from(context.candidates);

  if (args.length === 0) {
    personToInsult = randomElement(candidatesArray);
  } else {
    personToInsult = args.join(' ');
  }

  const insultText = await generateInsult(personToInsult, context.entities);

  await message.channel.send(insultText);
}

module.exports = {
  name: 'insult',
  execute,
};
