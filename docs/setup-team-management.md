# Setup Team Management of Token

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

## Getting Started

Gather everyone's public keys, decide how many signatures are required, then create the multisig account.

## Create the multisig account

If you have 3 members of the team (3 public keys), and require 2 signatures, here's the command you'd use to create a new Solana data account with the multisig information:

    spl-token create-multisig 2 $PUBLIC_KEY_1 $PUBLIC_KEY_2 $PUBLIC_KEY_3

---

If you want to automatically create keypairs to play with:

```
$ for i in $(seq 3); do solana-keygen new --no-passphrase --silent --outfile "${HOME}/.config/solana/signer-${i}.json"; done
```

Then set all public keys to environment variables to use later:

```
$ for i in $(seq 3); do SIGNER="${HOME}/.config/solana/signer-${i}.json"; eval "export SIGNER_PUBLIC_KEY_${i}=$(solana-keygen pubkey "$SIGNER")"; done
```

You should now have these 3 environment variables set. Run `env | grep SIGNER_PUBLIC_KEY` to check.

For this project, here are the public keys that were generated.

```
SIGNER_PUBLIC_KEY_1=3m9oUysTUgry1YEfBNx48yZZVNvHgbjd1CVCp744cZoz
SIGNER_PUBLIC_KEY_2=HM4jSVX5ujwmrrytpS7mGrFB9sCf6mhLn97eMiJNvATs
SIGNER_PUBLIC_KEY_3=z7wESgkZ48wtq9MR1ktJ5P8j3DoWyjDCqNMPqADyBTz
```

---

Create the multisig data account:

    spl-token create-multisig 2 $SIGNER_PUBLIC_KEY_1 $SIGNER_PUBLIC_KEY_2 $SIGNER_PUBLIC_KEY_3

which for this project generated account `Bb2ske4Wpjd5xjkD1MVCnoXuFZDGUJCcehmcYFoUJVt1` that stores all this information.

Verify the multisig account, options and list of signers on-chain at <https://explorer.solana.com/address/Bb2ske4Wpjd5xjkD1MVCnoXuFZDGUJCcehmcYFoUJVt1>

Set it to an environment variable for later:

    export MULTISIG_ACCOUNT=Bb2ske4Wpjd5xjkD1MVCnoXuFZDGUJCcehmcYFoUJVt1

Then change the mint authority for the token to that new multisig wallet:

> CAUTION: You're about to change the mint authority,
> which impacts who can make changes to your token.
> After running `spl-token authorize` you will need to go
> through the multisig process and can no longer control
> the token from the initial keypair.

    export TOKEN_MINT_ADDRESS=7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD

    # double-check before running
    echo $TOKEN_MINT_ADDRESS
    echo $MULTISIG_ACCOUNT

    spl-token authorize $TOKEN_MINT_ADDRESS mint $MULTISIG_ACCOUNT

    # you'll then see
    Updating 7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD
      Current mint authority: BrtiXxJN5H7zoLyAsucBuymAgpYH8zRcR3NiQuyP9mPL
      New mint authority: Bb2ske4Wpjd5xjkD1MVCnoXuFZDGUJCcehmcYFoUJVt1

From this point onward, the `spl-token` commands will now use the `--owner` option to point to $MULTISIG_ACCOUNT and multiple `--multisig-signer` options to bring in signers.

First, let's verify we can no longer transfer tokens using the method prior to multisig:

    export YOUR_WALLET_PUBLIC_KEY_HERE=deadbeef....

    # let's transfer 50 tokens to your wallet
    spl-token transfer --fund-recipient $TOKEN_MINT_ADDRESS 50 $YOUR_WALLET_PUBLIC_KEY_HERE

Now let's successfully transfer 1 token to `YOUR_WALLET_PUBLIC_KEY_HERE` (the RECIPIENT_TOKEN_ACCOUNT_ADDRESS) via the multisig process and see what happens.

1. First try leaving off one of the signers and it should fail since at least 2 are needed

   spl-token transfer --fund-recipient $TOKEN_MINT_ADDRESS 1 \
   $YOUR_WALLET_PUBLIC_KEY_HERE \
   --owner $MULTISIG_ACCOUNT \
   --multisig-signer signer-1.json

2. Succeed: Then try with the minimum number of signers (2 in this case) to see it work

   spl-token transfer $TOKEN_MINT_ADDRESS 1 \
   $YOUR_WALLET_PUBLIC_KEY_HERE \
   --owner $MULTISIG_ACCOUNT \
   --multisig-signer signer-1.json \
   --multisig-signer signer-2.json

## Support offline signing with multisig

You were successful above, but that won't scale for a team.

Here's what else you'll need:

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
