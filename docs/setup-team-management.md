# Setup Team Approach

Once a token is created you may need to:

- update metadata
- mint more tokens
- transfer tokens

For many token projects, you'll want to manage this process as a team to:

- ensure decisions are supported by the majority of the team and not made unilaterally
- ensure redundancy by having multiple people involved
- ensure the process can be run across a remote distributed team
- add or remove team members

The Solana Token Program makes this available through a multisig approach.

## Create the multisig account

Gather everyone's public keys, decide how many signatures are required, then create the multisig account.

If you have 3 public keys, and require 2 signatures, here's the command you'd use:

    export TOKEN_MINT_ADDRESS=7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD

    export PUBLIC_KEY_1=BzWpkuRrwXHq4SSSFHa8FJf6DRQy4TaeoXnkA89vTgHZ
    export PUBLIC_KEY_2=DhkUfKgfZ8CF6PAGKwdABRL1VqkeNrTSRx8LZfpPFVNY
    export PUBLIC_KEY_3=D7ssXHrZJjfpZXsmDf8RwfPxe1BMMMmP1CtmX3WojPmG

    # create a new Solana data account with the multisig information
    spl-token create-multisig 2 $PUBLIC_KEY_1 $PUBLIC_KEY_2 $PUBLIC_KEY_3

which generated account `5TieiddCepVsUWu6E9VcWR9w3gp1w5hYka86TwWjipLV` that stores all this information.

View this account info on-chain at <https://explorer.solana.com/address/5TieiddCepVsUWu6E9VcWR9w3gp1w5hYka86TwWjipLV>

Then set it to an environment variable for later:

    export MULTISIG_ACCOUNT=5TieiddCepVsUWu6E9VcWR9w3gp1w5hYka86TwWjipLV

Then change the mint authority for the token to that new multisig wallet:

> CAUTION: You're changing the mint authority, which changes who can make changes to your token.

    spl-token authorize $TOKEN_MINT_ADDRESS mint $MULTISIG_ACCOUNT

`spl-token` commands will now use the `--owner` option to point to $MULTISIG_ACCOUNT and multiple `--multisig-signer` options to bring in signers.

Let's try to mint 1 token for `YOUR_WALLET_PUBLIC_KEY_HERE` (the RECIPIENT_TOKEN_ACCOUNT_ADDRESS) and test out the multisig process.

1. Try first leaving off one of the signers and it should fail.
2. Then try with the minimum number of signers (2 in this case to see it work)

   spl-token mint $TOKEN_MINT_ADDRESS 1 \
   $YOUR_WALLET_PUBLIC_KEY_HERE \
   --owner $MULTISIG_ACCOUNT \
   --multisig-signer signer-1.json \
   --multisig-signer signer-2.json

## Support offline signing with multisig

First, what are the issues with the online signing examples shown so far?

- Distributed Wallets: The previous `--multisig-signer` options work if you have all the signer wallets, but in reality you'll have a distributed team and a variety of wallet methods such as air-gapped hardware wallets.
- Need more time: You also won't be able to have everyone sign at the same time, hence need a `nonce` to extend the time.

### Create a Durable Transaction Nonce

What is a [Durable Transaction Nonce](https://docs.solana.com/offline-signing/durable-nonce)?

    # generate keypair
    solana-keygen new -o nonce-keypair.json

    export NONCE_PUBLIC_KEY=Fjyud2VXixk2vCs4DkBpfpsq48d81rbEzh6deKt7WvPj

    # create nonce account with 1 SOL
    solana create-nonce-account nonce-keypair.json 1

    # view account details
    solana nonce-account $NONCE_PUBLIC_KEY

    # grab the blockhash
    export NONCE_BLOCKHASH=6DPt2TfFBG7sR4Hqu16fbMXPj8ddHKkbU4Y3EEEWrC2E

    # create absent signers
    spl-token mint $TOKEN_MINT_ADDRESS 1 $YOUR_WALLET_PUBLIC_KEY_HERE \
    --owner $MULTISIG_ACCOUNT \
    --multisig-signer $PUBLIC_KEY_1 \
    --multisig-signer $PUBLIC_KEY_2 \
    --blockhash $NONCE_BLOCKHASH \
    --fee-payer $YOUR_WALLET_PUBLIC_KEY_HERE \
    --nonce $NONCE_PUBLIC_KEY \
    --nonce-authority $YOUR_WALLET_PUBLIC_KEY_HERE \
    --sign-only \
    --mint-decimals 9
