// const request = require('request');
const { Client, Attachment } = require('discord.js');
const client = new Client();
const fetch = require("node-fetch");
const fs = require('fs');

function randomElement(array) {
   return array[Math.floor(Math.random() * array.length)];
}

class CasinoMachine {
    static play(player, winningChance) {
        let rand = Math.floor(Math.random() * 100);
        var out = 0
        if (rand >= (100 - winningChance)) {
            out = player.bet * 2;
        } else {
            out = -player.bet;
        }
        let data = fs.readFileSync('data.json', 'utf8');
        let json = JSON.parse(data);
        let id = player.id;
        if (typeof json[`${id}`] !== 'undefined') {
            json[`${id}`] += out;
            fs.writeFileSync('data.json', JSON.stringify(json));
            return out
        }
    }
}

class CasinoPlayer {
    constructor(id, bet) {
        this.id = id;
        this.bet = bet;
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // console.log(client.channels);
});

client.on('message', msg => {
    if (!msg.author.bot) {
    if (msg.content.toLowerCase() === `!casino`) {
        msg.reply(`Пожалуйста, сделайте ставку с помощью команды \`!bet\``)
        return
    }
    if ((msg.content.toLowerCase().slice(0, 4) === `!bet`) && (msg.content.slice(5).length > 0)) {
        let amountTest = msg.content.slice(5);
        var amount = parseInt(amountTest);
        if (amount == 0) {
            msg.reply(`Не ну ты даун? Не ну ты реально даун? Нормальную ставку делай!`);
            return
        }
        let player = new CasinoPlayer(msg.author.id, amount);
        let out = CasinoMachine.play(player, 80)
        fs.readFile('data.json', 'utf8', function(err, data) {
            let json = JSON.parse(data);
            let id = player.id;
            let wallet = json[`${id}`];
            if (out > 0) {
                msg.reply(`Вы выиграли $${out}! Ваш баланс $${wallet}`);
            } else {
                msg.reply(`Вы проиграли $${out}! Ваш баланс $${wallet}`);
            }
        });
        return
    }
    if (msg.content.toLowerCase() === `!wallet`) {
        fs.readFile('data.json', 'utf8', function(err, data) {
            let json = JSON.parse(data);
            let id = msg.author.id;
            if (typeof json[`${id}`] === 'undefined') {
                json[`${id}`] = 100;
                fs.writeFile('data.json', JSON.stringify(json), 'utf8', (err) => {
                    // console.log(err);
                    msg.reply(`Кошелек создан!`);
                });
                return
            }
            msg.reply(`У вас на счету $${json[`${id}`]}`);
        });
        return
    }
    if ((msg.content.toLowerCase().slice(0, 5) === `!send`) && (msg.content.slice(6).length > 0)) {
        let amountTest = msg.content.slice(6);
        var amount = parseInt(amountTest);

        var index = 0;
        for (const letter of amountTest) {
            if (letter != " ") {
                index += 1;
            } else {
                break
            }
        }
        let sendFromId = msg.author.id;
        let sendToId = msg.content.slice(9 + index, -1);
        if (sendFromId == sendToId) {
            msg.reply("ты дебил?")
            return
        }
        // let sendToId = "testid"

        fs.readFile('data.json', 'utf8', function(err, data) {
            let json = JSON.parse(data);
            if (typeof json[`${sendFromId}`] !== 'undefined') {
                if (typeof json[`${sendToId}`] === 'undefined') {
                    msg.reply(`У <@${sendToId}> нету кошелька. Его можно создать командой \`!wallet\``)
                    return
                }
                if (json[`${sendFromId}`] < amount) {
                    msg.reply("У вас недостаточно средств!")
                    return
                }
                json[`${sendFromId}`] -= amount
                json[`${sendToId}`] += amount

                fs.writeFile('data.json', JSON.stringify(json), 'utf8', (err) => {
                    msg.reply(`Успешно переведено ${amount} на счет <@${sendToId}>. У вас осталось $${json[`${sendFromId}`]}`)
                });
            } else {
                msg.reply("Сначала вам необходимо создать кошелек. Это можно сделать командой \`!wallet\`")
            }
        });

        return
    }
    if ((msg.content.toLowerCase().slice(0, 2) === `!s`) && msg.content.slice(3).length > 0) {
        const search = msg.content.slice(3);
        msg.channel.send(`Одну секунду...`);
        // url (required), options (optional)
        const u = `https://api.qwant.com/api/search/images?count=10&q=${search}&t=images&safesearch=0&locale=en_US&uiv=4`
        fetch(u, {
            method: 'get'
        }).then(function(response) {
            return response.json();
        }).then(function(json) {
            const url = JSON.parse(JSON.stringify(json)).data.result.items[0].media_fullsize.slice(2);
            const attachment = new Attachment(`https://${url}.png`);
            msg.channel.send(`Наслаждайтесь, вот ${search}`, attachment);
        })
        return
    }
    if ((msg.content.toLowerCase().slice(0, 7) === `!search`) && msg.content.slice(8).length > 0) {
        const search = msg.content.slice(8);
        msg.channel.send(`Одну секунду...`);
        // url (required), options (optional)
        const u = `https://api.qwant.com/api/search/images?count=10&q=${search}&t=images&safesearch=0&locale=en_US&uiv=4`
        fetch(u, {
            method: 'get'
        }).then(function(response) {
            return response.json();
        }).then(function(json) {
            const url = JSON.parse(JSON.stringify(json)).data.result.items[0].media_fullsize.slice(2);
            const attachment = new Attachment(`https://${url}.png`);
            console.log(`https://${url}`);
            msg.channel.send(`Наслаждайтесь, вот ${search}`, attachment);
        })
        return
    }

    if ((msg.content.toLowerCase().includes("рома") ||
    msg.content.toLowerCase().includes("ром очка") ||
    msg.content.toLowerCase().includes("ром о4ка"))) {
        msg.channel.send(`Ты сосал тебя ебали, ${msg.author}!`);
    }
    if (msg.content.toLowerCase().includes("ясно")) {
        msg.channel.send(`Хуясно, ${msg.author}!`);
    }
    if (msg.content.toLowerCase() === '!правда') {
        msg.delete();
        msg.channel.send('Тот кто ест макароны с майонезом хуесос!!!11!');
    }

    // if (msg.content.toLowerCase() === '!присоеденись') {
    //     const channel = client.channels.get("590230128408395841");
    //     channel.join().then(connection => {
    //         // Yay, it worked!
    //         console.log("Successfully connected.");
    //     }).catch(e => {
    //         // Oh no, it errored! Let's log it to console :)
    //         console.error(e);
    //     });;
    // }

    if (msg.author.id === '581665007159214091') {
        let messageText = randomElement([
            'Ясно Влад умер',
            'Хватит писать, иди пиши треки в фл',
            'э эЭ Ээ ээ Э ЭЭ эЭ',
            `Сдохни ${msg.author}!`
        ])
        msg.channel.send(messageText);
    }
    if (msg.content.toLowerCase() === '!die') {
        msg.channel.send(`Сдохни, ${msg.author}! Сдохни!`);
    }
    if (msg.content.toLowerCase() === '!love') {
        msg.channel.send(`:heart: Егор Дудец :heart: поступил :tada:`);
    }
    if ((msg.content.toLowerCase() === '!сосать') || (msg.content.toLowerCase().includes("сос"))) {
        msg.channel.send(`Всем сосать!`);
    }
    if (msg.content.toLowerCase() === '!228') {
        msg.author.send(`Ты думал у тебя есть шансы выжить в этом мире? Если ты не за АУЕ то у тебя их нету! Вали отсюда пока теюя не убили!`);
    }
    }
})

client.on('guildMemberAdd', member => {
    const random = Math.floor(Math.random() * 7) + 1
    const attachment = new Attachment(`${random}.jpg`)
    member.guild.channels.get(`607935317537849371`).send(attachment)
})

// client.login(process.env.BOT_TOKEN);
client.login("NjA3OTM0MzYxMjgyODA1NzYx.XUl8OA.3Btp3oTcf4BmjILbO5_KexZiNok");
