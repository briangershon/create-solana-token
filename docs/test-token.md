# Test Token

## Metadata ok?

- Does metadata look ok in Solana Explorer? [7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD](https://explorer.solana.com/address/7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD)

## Transfer tokens to another wallet

First, let's set an environment variable for the wallet we want to use to send tokens to.

    export YOUR_WALLET_PUBLIC_KEY_HERE=deadbeef....

Let's transfer 50 tokens to your wallet:

    spl-token transfer $TOKEN_MINT_ADDRESS 50 $YOUR_WALLET_PUBLIC_KEY_HERE

You should now see those 50 tokens appear in your wallet. In Phantom, you'll see under the `$` tab. Or you can run:

    spl-token balance $YOUR_WALLET_PUBLIC_KEY_HERE

Does token image appear ok in Phantom wallet?
