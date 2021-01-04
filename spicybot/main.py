import os
from dotenv import load_dotenv
import discord
from discord.ext import commands

import keep_alive
from commands.statements import insult, compliment, yomama

load_dotenv()


def main():
    bot = commands.Bot(command_prefix="!")

    bot.add_command(insult)
    bot.add_command(compliment)
    bot.add_command(yomama)

    try:
        keep_alive.keep_alive()
        bot.run(os.environ["DISCORD_BOT_LOGIN"])
    except KeyError:
        print("Error! DISCORD_BOT_LOGIN environment variable is missing!")


if __name__ == "__main__":
    main()
