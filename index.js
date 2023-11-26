"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ccxt_1 = require("ccxt");
const path = 'exchangeInfo';
const baseUrl = 'wss://fstream.binance.com/';
const Binance = new ccxt_1.binance();
const Bitget = new ccxt_1.bitget();
function loop() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                const binanceTickers = Object.values((yield Binance.fetchTickers())).filter((ticker) => ticker.symbol.includes('/USDT') &&
                    ticker.quoteVolume > 100000 &&
                    ticker.percentage.toFixed(4) > 3);
                const bitgetPairs = Object.values((yield Bitget.fetchMarkets())).filter((ticker) => ticker.id.includes('UMCBL') && ticker.settle === 'USDT');
                const matchingParis = bitgetPairs.filter((pair) => {
                    return binanceTickers.some((binancePair) => {
                        const binanceCoin = binancePair.symbol.split('/')[0];
                        const bitgetCoin = pair.id.split('USDT')[0];
                        return bitgetCoin === binanceCoin;
                    });
                });
                console.log(matchingParis);
            }), 100);
            // }, 900_000)
        }
    });
}
loop();
