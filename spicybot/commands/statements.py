from discord.ext import commands


@commands.command()
async def insult(ctx):
    await ctx.send("Hi!")


@commands.command()
async def compliment(ctx):
    await ctx.send("Compliment!")


@commands.command()
async def yomama(ctx):
    await ctx.send("Yomama joke!")
