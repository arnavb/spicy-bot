const axios = require('axios').default;
const { randomElement } = require('./../utils');

async function generateYoMama(to) {
  try {
    let { joke } = (await axios.get('https://api.yomomma.info/', {})).data;

    return `${to}, ${joke[0].toLowerCase()}${joke.substring(1)}`;
  } catch (error) {
    console.log(`Error fetching result: ${error}`);
  }
}

async function execute(args, message, context) {
  let personToYoMama;
  context.candidates.add(message.author);

  let candidatesArray = Array.from(context.candidates);

  if (args.length === 0) {
    personToYoMama = randomElement(candidatesArray);
  } else {
    personToYoMama = args.join(' ');
  }

  const yoMamaText = await generateYoMama(personToYoMama);

  await message.channel.send(yoMamaText);
}

module.exports = {
  name: 'yomama',
  execute,
};
