import { transfer, createMint, mintTo, getOrCreateAssociatedTokenAccount, createTransferInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, Transaction, sendAndConfirmTransaction, PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import { airdrop } from "../airdrop/index";
import { transferSol } from "../transfer-sol";

const mint = async(mintWallet) => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const creatorToken = await createMint(
            connection,
            mintWallet,
            null,
            null,
            8,
            mintWallet,
            null,
            TOKEN_PROGRAM_ID
    );
    return creatorToken; // public key of the mint
}

const transferTokens = async (tokenAddress: PublicKey, mintWallet: Keypair, receiver: Keypair) => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    const mintTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, // connection
        mintWallet, // payer
        tokenAddress, // mint
        mintWallet.publicKey // owner
    ); // account will hold a balance of the mint
    
    await mintTo(
        connection, // connection
        mintWallet, // payer
        tokenAddress, // mint
        mintTokenAccount.address, // mint to the account created to hold the balance of mint
        null, // authority
        100000000 // amount
    );

    const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, // connection
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
    const signature = await transfer(
        connection, // connection
        mintWallet, // payer
        mintTokenAccount.address, // source
        receiverTokenAccount.address, // destination
        mintWallet.publicKey, // owner
        100000000 // amount
    )

}

(async () => {

    // creating a keypair for the receiver account
    const secret = Uint8Array.from([16,165,42,199,205,78,55,242,61,14,88,108,28,52,187,168,33,35,171,224,162,22,149,218,109,132,102,164,120,209,86,207,51,252,228,105,69,216,13,127,79,116,209,63,188,255,99,30,178,29,231,255,200,191,242,60,36,193,65,101,232,198,162,110,169]);
    const receiverKeypair = Keypair.fromSecretKey(secret)

    const mintWallet = await Keypair.generate(); // wallet address
    await transferSol(receiverKeypair, mintWallet.publicKey, 1);
    // await airdrop(mintWallet.publicKey, 1); // airdrop 1 sol to the wallet
    const creatorTokenAddress = await mint(mintWallet); // use the wallet address to create a mint
    // mint() returns a public key of the mint

    await transferTokens(creatorTokenAddress, mintWallet, receiverKeypair);

    console.log(`Creator Token Address: ${creatorTokenAddress}`);
    console.log(`mintWallet Address : ${mintWallet.publicKey}`);
})()