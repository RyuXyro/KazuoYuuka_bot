const { Bot } = require("grammy");
const { token } = require('./config.json');
const { bot_developer } = require('./config.json'); // bot developer id
const { bot_dev_username } = require('./config.json'); // bot developer username
const { bot_channel_log } = require('./config.json'); // channel log
const { bot_channel_official_link } = require('./config.json') // official channel
const { set_command_message } = require('./config.json'); // some badword
const { badword } = require('./data.json'); // some badword
const client = new Bot(token);
if (!token) throw new Error("BOT_TOKEN is unset");

client.use(async (ctx, next) => {
    ctx.config = {
        botDeveloper: bot_developer,
        isDeveloper: ctx.from?.id === bot_developer
    };
    await next();
});
client.api.setMyCommands([
    { command: "start", description: "start the bot" },
    { command: "help", description: "show help message" },
    { command: "ping", description: "ping the bot" },
    { command: "info", description: "see info about your self" },
    { command: "groupinfo", description: "see info about the group" },
    { command: "aboutbot", description: "see information about the bot" }
]).then(() => {
    console.log(set_command_message);
}).catch((err) => console.error("Failed to upload commands to bot", err));

// reply some message
client.hears(badword, async (ctx) => {
    const au = ctx.getAuthor();
    const c = ctx.getChat();
    const ci = ctx.msg.chat.id;
    const message = await client.api.sendMessage(bot_channel_log, `BadWord:\n\nChatID: ${ci}\nfrom UserName: @${(await (au)).user.username}\nUserID: ${(await (au)).user.id}\nLink: ${(await c).invite_link}`);
    console.log(message)
})
client.hears("p", async (ctx) => {
    if (ctx.config.isDeveloper) {
        await ctx.reply("Hello Master!", {
            reply_parameters: {
                message_id: ctx.msg.message_id
            }
        })
    }
});
client.hears("?" || "hello" || "yes?", async (ctx) => {
    if (ctx.config.isDeveloper) {
        await ctx.reply("Do You need help Master?", {
            reply_parameters: {
                message_id: ctx.msg.message_id
            }
        })
    }
})
client.hears('no', async (ctx) => {
    if (ctx.config.isDeveloper) {
        await ctx.reply('Okk', {
            reply_parameters: {
                message_id: ctx.msg.message_id
            }
        })
    } else {
        await ctx.reply('What do you mean?', {
            reply_parameters: {
                message_id: ctx.msg.message_id
            }
        })
    }
})
client.hears('nothing', async (ctx) => {
    if (ctx.config.isDeveloper) {
        await ctx.reply('Okk..')
    } else {
        await ctx.reply('ok..', {
            reply_parameters: {
                message_id: ctx.msg.message_id
            }
        })
    }
})


client.command("start", async (ctx) => {
    const au = ctx.getAuthor();
    await ctx.reply(`Welcome Back @${(await (au)).user.username}!!\n\n\nType:\n/help - to see more information\n\nOfficial Server: ${bot_channel_official_link}`, {
        reply_parameters: { message_id: ctx.msg.message_id },
        parse_mode: "HTML",
        disable_web_page_preview: true,
    })
});

client.command("help", async (ctx) => {
    await ctx.reply(`
    Available Command:\n\n/start - start the bot\n/help - show this message\n/ping - ping the bot\n/info - see info about your self\n/groupinfo - see info about the group\n/aboutbot - see information about the bot
    `, {
        reply_parameters: { message_id: ctx.msg.message_id },
    })
});

client.command('info', async (ctx) => {
    const au = ctx.getAuthor();
    await ctx.reply(`=== Info ===\nID: ${(await (au)).user.id}\nUsername: @${(await (au)).user.username}\nFirst Name: ${(await (au)).user.first_name}\nLast Name: ${(await (au)).user.last_name}\nIs Bot: ${(await (au)).user.is_bot}\nStatus: ${(await (au)).status}\nIs Anonymous: ${(await (au)).is_anonymous}
  `)
    console.log(au)
});

client.command('aboutbot', async (ctx) => {
    const meu = ctx.me.username;
    const mei = ctx.me.id;
    const mef = ctx.me.first_name;
    const mejg = ctx.me.can_join_groups;
    const merlg = ctx.me.can_read_all_group_messages;
    const meq = ctx.me.supports_inline_queries;
    const au = ctx.getAuthor();
    await ctx.reply(`Hello...\nHere's some information about meee\n\nUserName: @${meu}\nID: ${mei}\nName: ${mef}\n\n--Setting--\nCan Join Group: ${mejg}\nCan Read All Message: ${merlg}\nSupport Inline Queries: ${meq}\nBot Owner: ${bot_dev_username}\n\nNice to Meet you @${(await au).user.username}
  `)
})

client.command('groupinfo', async (ctx) => {
    const c = ctx.getChat();
    try {
        await ctx.reply(`About The Channel\n\nName: ${(await c).title}\nID: ${(await c).id}\nBio: ${(await c).description}\nLink: ${(await c).invite_link}
    `)
    } catch (err) {
        await ctx.reply('This command only used in channel')
    }
});

client.command("ping", async (ctx) => {
    const c = ctx.getChat();
    await ctx.reply(`Pong...`);
});

exports.client = client;
