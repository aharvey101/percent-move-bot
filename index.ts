require('dotenv').config()
import { Market, Ticker, binance, bitget } from 'ccxt'
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELEGRAM_TOKEN
const chatId = process.env.TELEGRAM_CHAT_ID
const bot = new TelegramBot(token)

process.env.NTBA_FIX_319 = '1'

const Binance = new binance()
const Bitget = new bitget()

async function loop() {
  let pairs: Market[] = []
  setInterval(async () => {
    const binanceTickers = Object.values(
      (await Binance.fetchTickers()) as any
    ).filter(
      (ticker: any) =>
        ticker.symbol.includes('/USDT') &&
        ticker.quoteVolume > 100_000 &&
        ticker.percentage.toFixed(4) > 5
    )
    console.log(binanceTickers)
    const bitgetPairs = Object.values(
      (await Bitget.fetchMarkets()) as any
    ).filter(
      (ticker: any) => ticker.id.includes('UMCBL') && ticker.settle === 'USDT'
    ) as Market[]

    const matchingPairs = bitgetPairs.filter((pair: any) => {
      return binanceTickers.some((binancePair: any) => {
        const binanceCoin = binancePair.symbol.split('/')[0]
        const bitgetCoin = pair.id.split('USDT')[0]
        return bitgetCoin === binanceCoin
      })
    })
    // TODO: check if there are new pairs that were not in the previous loop
    const nextPairs = matchingPairs.filter(
      (pair: any) => !pairs.some((p: any) => p.id === pair.id)
    )
    pairs.push(...nextPairs.sort((a: any, b: any) => a.id.localeCompare(b.id)))

    if (nextPairs.length > 0) {
      bot.sendMessage(chatId, nextPairs.map((pair: any) => pair.id).join('\n'))
    }
  }, 5000)
  // }, 1000 * 60)
}

loop()

module.exports = bot
