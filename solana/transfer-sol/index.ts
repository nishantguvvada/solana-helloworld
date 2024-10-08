import { PublicKey, Keypair, clusterApiUrl, Connection, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmRawTransaction, sendAndConfirmTransaction } from "@solana/web3.js"
import { airdrop } from "../airdrop";
import { showBalance } from "../show-balance";

export const transferSol = async (from: Keypair ,to: PublicKey, amount: number) => {
    // Creating a connection to the localhost:8899
    const connection = new Connection(clusterApiUrl('devnet'), "confirmed");

    // Creating an empty transaction
    const transaction = new Transaction();

    // Creating instructions for the transaction
    const instruction = SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: LAMPORTS_PER_SOL * amount
    });

    // Adding instructions to the transactions
    transaction.add(instruction);

    // Complete transaction after confirmation
    await sendAndConfirmTransaction(connection, transaction, [from]);
    console.log("Done");
}

// Account 1 (sends the SOL) 8wcKqzyS8jRsorkptP675S7wokurtDjKqCHWRM7Cy9PF
const secret = Uint8Array.from([32,199,150,50,229,167,138,211,158,181,118,181,65,147,190,50,4,249,13,228,194,12,109,181,227,214,34,212,49,216,20,13,117,255,29,58,203,20,22,96,230,246,124,126,76,105,59,116,13,254,240,175,7,1,239,76,238,203,244,95,201,171,26,90])
const fromKeyPair = Keypair.fromSecretKey(secret);

// Account 2 (receives the SOL)
const topublicKey = new PublicKey("J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4");

// (async() => {
//     // await airdrop(fromKeyPair.publicKey, 1);
//     const initialBalance = await showBalance(fromKeyPair.publicKey);
//     console.log(`Initial balance of FROM wallet is ${initialBalance}`);
//     const initialBalanceTo = await showBalance(topublicKey);
//     console.log(`Initial balance of TO wallet is ${initialBalanceTo}`);

//     await transferSol(fromKeyPair, topublicKey, 1);

//     const initialBalance2 = await showBalance(fromKeyPair.publicKey);
//     console.log(`Post transfer balance of FROM wallet is ${initialBalance2}`);
//     const initialBalanceTo2 = await showBalance(topublicKey);
//     console.log(`Post transfer balance of TO wallet is ${initialBalanceTo2}`);

// })()