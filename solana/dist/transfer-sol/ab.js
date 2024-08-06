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
exports.transferSol = void 0;
const web3_js_1 = require("@solana/web3.js");
const airdrop_1 = require("../airdrop");
const show_balance_1 = require("../show-balance");
const transferSol = (from, to, amount) => __awaiter(void 0, void 0, void 0, function* () {
    // Creating a connection to the localhost:8899
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'), "confirmed");
    // Creating an empty transaction
    const transaction = new web3_js_1.Transaction();
    // Creating instructions for the transaction
    const instruction = web3_js_1.SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: web3_js_1.LAMPORTS_PER_SOL * amount
    });
    // Adding instructions to the transactions
    transaction.add(instruction);
    // Complete transaction after confirmation
    yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [from]);
    console.log("Done");
});
exports.transferSol = transferSol;
// Account 1 (sends the SOL) 8wcKqzyS8jRsorkptP675S7wokurtDjKqCHWRM7Cy9PF
const secret = Uint8Array.from([32, 199, 150, 50, 229, 167, 138, 211, 158, 181, 118, 181, 65, 147, 190, 50, 4, 249, 13, 228, 194, 12, 109, 181, 227, 214, 34, 212, 49, 216, 20, 13, 117, 255, 29, 58, 203, 20, 22, 96, 230, 246, 124, 126, 76, 105, 59, 116, 13, 254, 240, 175, 7, 1, 239, 76, 238, 203, 244, 95, 201, 171, 26, 90]);
const fromKeyPair = web3_js_1.Keypair.fromSecretKey(secret);
// Account 2 (receives the SOL)
const topublicKey = new web3_js_1.PublicKey("J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4");
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, airdrop_1.airdrop)(fromKeyPair.publicKey, 1);
    const initialBalance = yield (0, show_balance_1.showBalance)(fromKeyPair.publicKey);
    console.log(`Initial balance of FROM wallet is ${initialBalance}`);
    const initialBalanceTo = yield (0, show_balance_1.showBalance)(topublicKey);
    console.log(`Initial balance of TO wallet is ${initialBalanceTo}`);
    yield (0, exports.transferSol)(fromKeyPair, topublicKey, 1);
    const initialBalance2 = yield (0, show_balance_1.showBalance)(fromKeyPair.publicKey);
    console.log(`Post transfer balance of FROM wallet is ${initialBalance2}`);
    const initialBalanceTo2 = yield (0, show_balance_1.showBalance)(topublicKey);
    console.log(`Post transfer balance of TO wallet is ${initialBalanceTo2}`);
}))();
//# sourceMappingURL=ab.js.map