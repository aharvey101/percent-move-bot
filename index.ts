require("dotenv").config();
import { Market, Ticker, binance, bitget } from "ccxt";
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const bot = new TelegramBot(token);

process.env.NTBA_FIX_319 = "1";

const Binance = new binance();
const Bitget = new bitget();

let reportPairs: Market[] = [];
async function loop() {
  setInterval(
    async () => {
      const binanceTickers = Object.values(
        (await Binance.fetchTickers()) as any,
      ).filter(
        (ticker: any) =>
          ticker.symbol.includes("/USDT") &&
          ticker.quoteVolume > 100_000_000 &&
          ticker.percentage.toFixed(4) > 5,
      );
      const bitgetPairs = (await Bitget.fetchMarkets()) as Market[];

      const umcblPairs = bitgetPairs.filter((pair: any) =>
        pair.id.includes("UMCBL"),
      );

      const matchingPairs = umcblPairs.filter((pair: any) => {
        return binanceTickers.some((binancePair: any) => {
          const binanceCoin = binancePair.symbol.split("/")[0];
          const bitgetCoin = pair.id.split("USDT")[0];
          return bitgetCoin === binanceCoin;
        });
      });

      let difference = matchingPairs.filter(
        (pair) => !reportPairs.some((prevPair) => prevPair.id === pair.id),
      );

      reportPairs = [];
      reportPairs = matchingPairs;

      bot.sendMessage(
        chatId,
        difference.map((pair: any) => pair.id).join("\n"),
      );
    },
    1000 * 60 * 10,
  );
}

loop();
