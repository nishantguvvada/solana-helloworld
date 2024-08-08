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
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const transfer_sol_1 = require("../transfer-sol");
const mint = (mintWallet) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'), 'confirmed');
    const creatorToken = yield (0, spl_token_1.createMint)(connection, mintWallet, null, null, 8, mintWallet, null, spl_token_1.TOKEN_PROGRAM_ID);
    return creatorToken; // public key of the mint
});
const transferTokens = (tokenAddress, mintWallet, receiver) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'), 'confirmed');
    const mintTokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, // connection
    mintWallet, // payer
    tokenAddress, // mint
    mintWallet.publicKey // owner
    ); // account will hold a balance of the mint
    yield (0, spl_token_1.mintTo)(connection, // connection
    mintWallet, // payer
    tokenAddress, // mint
    mintTokenAccount.address, // mint to the account created to hold the balance of mint
    null, // authority
    100000000 // amount
    );
    const receiverTokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, // connection
    receiver, // payer
    tokenAddress, // mint
    receiver.publicKey // an account for the receiver to hold the transferred tokens
    );
    console.log(`RecevierTokenAccount Address: ${receiverTokenAccount.address}`);
    // const transaction = new Transaction().add(
    //     createTransferInstruction(
    //         mintTokenAccount.address,
    //         receiverTokenAccount.address,
    //         mintWallet.publicKey,
    //         100000000,
    //         [],
    //         TOKEN_PROGRAM_ID
    //     )
    // );
    // await sendAndConfirmTransaction(connection, transaction, [mintWallet], {commitment: "confirmed"});
    const signature = yield (0, spl_token_1.transfer)(connection, // connection
    mintWallet, // payer
    mintTokenAccount.address, // source
    receiverTokenAccount.address, // destination
    mintWallet.publicKey, // owner
    100000000 // amount
    );
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    // creating a keypair for the receiver account
    const secret = Uint8Array.from([165, 42, 199, 205, 78, 55, 242, 61, 14, 88, 108, 28, 52, 187, 168, 33, 35, 171, 224, 162, 22, 149, 218, 109, 132, 102, 164, 120, 209, 86, 207, 51, 252, 228, 105, 69, 216, 13, 127, 79, 116, 209, 63, 188, 255, 99, 30, 178, 29, 231, 255, 200, 191, 242, 60, 36, 193, 65, 101, 232, 198, 162, 110, 169]);
    const receiverKeypair = web3_js_1.Keypair.fromSecretKey(secret);
    const mintWallet = yield web3_js_1.Keypair.generate(); // wallet address
    yield (0, transfer_sol_1.transferSol)(receiverKeypair, mintWallet.publicKey, 1);
    // await airdrop(mintWallet.publicKey, 1); // airdrop 1 sol to the wallet
    const creatorTokenAddress = yield mint(mintWallet); // use the wallet address to create a mint
    // mint() returns a public key of the mint
    yield transferTokens(creatorTokenAddress, mintWallet, receiverKeypair);
    console.log(`Creator Token Address: ${creatorTokenAddress}`);
    console.log(`mintWallet Address : ${mintWallet.publicKey}`);
}))();
//# sourceMappingURL=index.js.map