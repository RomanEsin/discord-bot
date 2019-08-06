const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

 client.on('message', msg => {
     if (msg.content === '!правда') {
         msg.channel.send('Тот кто ест макароны с майонезом хуесос!!!11!')
     }
     if (msg.content === '!die') {
         msg.channel.send(`Сдохни, ${msg.author}! Сдохни!`);
     }
 })

client.login(process.env.BOT_TOKEN);
