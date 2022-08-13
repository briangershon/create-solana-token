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

## Change the mint authority for the token to that new multisig wallet:

> CAUTION: You're about to change the mint authority,
> which impacts who can make changes to your token.
> After running `spl-token authorize` you will need to go
> through the multisig process and can no longer control
> the token from the initial keypair.

    export MULTISIG_ACCOUNT=Bb2ske4Wpjd5xjkD1MVCnoXuFZDGUJCcehmcYFoUJVt1
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

### Testing new multisig authority

Try minting 1 token to `YOUR_WALLET_PUBLIC_KEY_HERE`.

> You want to explicitly provide a wallet and not use the default `--owner` wallet
> (which you get if you leave off `YOUR_WALLET_PUBLIC_KEY_HERE`).
> Otherwise, you're minting to the account that created the coin and could lose access to that.

Let's see it fail first by leaving off one of the required signers (since 2 are needed):

    export YOUR_WALLET_PUBLIC_KEY_HERE=deadbeef...

    # double-check before running
    echo $TOKEN_MINT_ADDRESS        # should be 7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD
    echo $MULTISIG_ACCOUNT          # should be Bb2ske4Wpjd5xjkD1MVCnoXuFZDGUJCcehmcYFoUJVt1

    # since we're minting to another wallet (and not the default `--owner`)
    # an account must be created to receive the token
    spl-token create-account $TOKEN_MINT_ADDRESS -- ~/.config/solana/your-wallet-keypair.json

    # to then find associated account for this wallet and token (if it was created previously)
    solana config set --keypair ~/.config/solana/my-mainnet-wallet.json
    spl-token accounts -v --owner $YOUR_WALLET_PUBLIC_KEY_HERE | grep $TOKEN_MINT_ADDRESS

    export ASSOCIATED_TOKEN_ACCOUNT=<the address in 2nd column from command above goes here>

    spl-token mint $TOKEN_MINT_ADDRESS 1 \
        $ASSOCIATED_TOKEN_ACCOUNT \
        --owner $MULTISIG_ACCOUNT \
        --multisig-signer ~/.config/solana/signer-1.json

Now let's see it work with minimum number of signers (2 in this case) to see it work

    spl-token mint $TOKEN_MINT_ADDRESS 1 \
        $ASSOCIATED_TOKEN_ACCOUNT \
        --owner $MULTISIG_ACCOUNT \
        --multisig-signer ~/.config/solana/signer-1.json \
        --multisig-signer ~/.config/solana/signer-2.json

## Support offline signing with multisig

You were successful above, but that won't scale for a team.

Here's what else you'll need:

- Distributed Wallets: The previous `--multisig-signer` options work if you have all the signer wallets, but in reality you'll have a distributed team and a variety of wallet methods such as air-gapped hardware wallets.
- Need more time: You also won't be able to have everyone sign at the same time, hence need a `nonce` to extend the time.

### Create a Durable Transaction Nonce

What is a [Durable Transaction Nonce](https://docs.solana.com/offline-signing/durable-nonce)?

    # generate keypair
    solana-keygen new -o ~/.config/solana/token-nonce-keypair.json

    export NONCE_PUBLIC_KEY=4LZucffEpb21wZifheqhUnxigLQFRRGFUgx7THL8Xxxp

    # create nonce account with 0.1 SOL
    solana create-nonce-account ~/.config/solana/token-nonce-keypair.json 0.1

    # view account details
    solana nonce-account $NONCE_PUBLIC_KEY

    # grab the blockhash from the account details
    export NONCE_BLOCKHASH=<from command output above>
