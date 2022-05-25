const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, again} = require('./option')
const token = '5148867475:AAGlt257mYY38vAKvkcAds_S84K0j0ePkEE'

const bot = new TelegramApi(token,{polling: true})

const chats = {}

const gameStart = async(chatId) => {
            await bot.sendMessage(chatId, 'Я тебе загадаю цифру, а ты угадывай, понеслась!')
            const randomNumber = Math.floor(Math.random()*10)
            chats[chatId] = randomNumber;
            await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/palantir', description: 'Напомнить имя'},
        {command: '/game', description: 'Угадай число'},
    ])
    
    bot.on('message', async msg=> {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text=== '/start') {
            await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/ecf/677/ecf677bc-ce3a-3fde-9d5c-63217a32bcd8/12.webp')
            return bot.sendMessage(chatId, `Доброго времени суток! Я - тапок. Как бот, только тапок, смекаешь? Ладно, мы тут не ради шуток, что ты хочешь узнать?`)
        }
    
        if(text=== '/palantir') {
            return bot.sendMessage(chatId, `Вижу... вижу... пишет мне ${msg.from.username}, или, в простонародии, ${msg.from.first_name} ${msg.from.last_name}`)
        }
    
        if(text==='/game') {
            return gameStart(chatId)
        }

        return bot.sendMessage(chatId, `Вот ты гришь ${text}, а я грю электрификация!`)  
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return gameStart(chatId)
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Еее, ты угадал, это цифра ${chats[chatId]}!`, again)
        }
        if (data !== chats[chatId]) {
            return bot.sendMessage(chatId, `Не то, я загадал цифру ${chats[chatId]}`, again)
        }
    })
}

start()
