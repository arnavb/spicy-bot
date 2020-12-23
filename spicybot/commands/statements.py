from discord.ext import commands
import html
import httpx
from random import choice

statement_candidates = set()


async def fetch_statement(url, data_loading_function):
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url)
            resp.raise_for_status()
            return data_loading_function(resp.json())
    except httpx.HTTPError as e:
        print(f"Unable to complete request to {url}! Got error:\n{e}")


async def general_statement_command(author, to, url, data_loading_function):
    statement_candidates.add(author)

    if len(to) == 0:
        target = choice(list(statement_candidates))
    else:
        target = " ".join(to)

    statement = await fetch_statement(url, data_loading_function)
    return f"{target}, {statement[0].lower()}{statement[1:]}"


@commands.command()
async def insult(ctx, *args):
    await ctx.send(
        await general_statement_command(
            ctx.author.mention,
            args,
            "https://evilinsult.com/generate_insult.php?lang=en&type=json",
            lambda resp: html.unescape(resp["insult"]),
        )
    )


@commands.command()
async def compliment(ctx, *args):
    await ctx.send(
        await general_statement_command(
            ctx.author.mention,
            args,
            "https://complimentr.com/api",
            lambda resp: resp["compliment"],
        )
    )


@commands.command()
async def yomama(ctx, *args):
    await ctx.send(
        await general_statement_command(
            ctx.author.mention,
            args,
            "https://api.yomomma.info/",
            lambda resp: resp["joke"],
        )
    )
