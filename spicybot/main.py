import os
from pathlib import Path
from discord.ext import commands
import yaml


import keep_alive
from commands.statements import insult, compliment, yomama


def load_config():
    with open(Path(__file__).parents[1] / "config.yaml") as f:
        try:
            config = yaml.load(f, Loader=yaml.FullLoader)
            return config["bot_token"]
        except yaml.YAMLError as e:
            print("bot_token was not loaded from config.yaml")
            print(f"Error: {e}")
            return ""


def main():
    bot = commands.Bot(command_prefix="!")

    bot.add_command(insult)
    bot.add_command(compliment)
    bot.add_command(yomama)

    keep_alive.keep_alive()
    bot.run(load_config())


if __name__ == "__main__":
    main()
