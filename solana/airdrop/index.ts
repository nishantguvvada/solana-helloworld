import {PublicKey, Connection, clusterApiUrl, LAMPORTS_PER_SOL} from "@solana/web3.js";

export const airdrop = async (publicKey: PublicKey, amount: number) => {
    const conn  = new Connection(clusterApiUrl('devnet'), "confirmed");
    const signature = await conn.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);
    await conn.confirmTransaction(signature);
}