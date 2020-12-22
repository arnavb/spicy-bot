const axios = require('axios').default;
const { randomElement } = require('./../utils');

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

async function execute(args, message, context) {
  let personToCompliment;
  context.candidates.add(message.author);

  let candidatesArray = Array.from(context.candidates);

  if (args.length === 0) {
    personToCompliment = randomElement(candidatesArray);
  } else {
    personToCompliment = args.join(' ');
  }

  const complimentText = await generateCompliment(personToCompliment);

  await message.channel.send(complimentText);
}

module.exports = {
  name: 'compliment',
  execute,
};
