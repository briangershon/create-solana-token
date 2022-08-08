import {
  Transaction,
  PublicKey,
  Keypair,
  Connection,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  DataV2,
  createCreateMetadataAccountV2Instruction,
  createUpdateMetadataAccountV2Instruction,
} from "@metaplex-foundation/mpl-token-metadata";
import { findMetadataPda } from "@metaplex-foundation/js";
import fs from "fs";

let connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

async function createMetadata({
  publicKey,
  tokenMint,
  tokenName,
  tokenSymbol,
  tokenUrl,
}: {
  publicKey: PublicKey;
  tokenMint: string;
  tokenName: string;
  tokenSymbol: string;
  tokenUrl: string;
}) {
  const mint = new PublicKey(tokenMint);
  const metadataPDA = await findMetadataPda(mint);
  const tokenMetadata = {
    name: tokenName,
    symbol: tokenSymbol,
    uri: tokenUrl,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  } as DataV2;

  const updateMetadataTransaction = new Transaction().add(
    createCreateMetadataAccountV2Instruction(
      {
        metadata: metadataPDA,
        updateAuthority: publicKey,
        mint: mint,
        mintAuthority: publicKey,
        payer: publicKey,
      },
      {
        createMetadataAccountArgsV2: {
          data: tokenMetadata,
          isMutable: true,
        },
      }
    )
  );
  await sendAndConfirmTransaction(connection, updateMetadataTransaction, [
    keypair,
  ]);
}

async function updateMetadata({
  publicKey,
  tokenMint,
  tokenName,
  tokenSymbol,
  tokenUrl,
}: {
  publicKey: PublicKey;
  tokenMint: string;
  tokenName: string;
  tokenSymbol: string;
  tokenUrl: string;
}) {
  const mint = new PublicKey(tokenMint);
  const metadataPDA = await findMetadataPda(mint);
  const tokenMetadata = {
    name: tokenName,
    symbol: tokenSymbol,
    uri: tokenUrl,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  } as DataV2;

  const updateMetadataTransaction = new Transaction().add(
    createUpdateMetadataAccountV2Instruction(
      {
        metadata: metadataPDA,
        updateAuthority: publicKey,
      },
      {
        updateMetadataAccountArgsV2: {
          data: tokenMetadata,
          updateAuthority: publicKey,
          primarySaleHappened: true,
          isMutable: true,
        },
      }
    )
  );
  await sendAndConfirmTransaction(connection, updateMetadataTransaction, [
    keypair,
  ]);
}

const privateKeyFile = fs.readFileSync(
  "/Users/brian/.config/solana/coin-keypair.json"
);
let privateKeySeed = JSON.parse(privateKeyFile.toString()).slice(0, 32);
let keypair = Keypair.fromSeed(Uint8Array.from(privateKeySeed));
console.log("Token update authority:", keypair.publicKey.toString());

createMetadata({
  publicKey: keypair.publicKey,
  tokenMint: "7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD",
  tokenName: "BUOY",
  tokenSymbol: "BUOY",
  tokenUrl: "https://arweave.net/Wtvd6MvCBO_ZXbLcR20mHDhBx2Bwpx_xZSb3OM_cDzg",
});
