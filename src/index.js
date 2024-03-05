const { client } = require('./app')
const { bot_channel_log } = require('./config.json');
const { set_command_message } = require('./config.json');


const log_1 = `
| ======== [Bot Is Ready] ======== |
|                                  |
|          KazuoYuuka_Bot          |
|                                  |
|                                  |
| type /help - to see all command  |
| -------------------------------- |
|                                  |
|                                  |
| v1.0.0 Beta                      |
|                                  |
| by KazuoYuuka                    |
|                                  |
| ================================ |
`

client.start(
  console.log(log_1),
  client.api.sendMessage(bot_channel_log, `${log_1}\n\n${set_command_message}`,
    { parse_mode: "HTML" })
);