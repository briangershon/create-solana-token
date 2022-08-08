# Create Token

Create a new token:

    spl-token create-token

Here's the token that was created in this example:

    7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD

No supply to start with.

Set an environment variable to use later:

    export TOKEN_MINT_ADDRESS=7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD

## Create a supply of tokens

Create an account to hold the token supply balance:

    spl-token create-account $TOKEN_MINT_ADDRESS

Which created this account:

    8CF2g8tDLgfn9PjDVL8ZwodTLmgc9tPUieu5TSVK6WPR

Mint 100 tokens

    spl-token mint $TOKEN_MINT_ADDRESS 100

Total supply and this accounts balance should be both `100`:

    spl-token supply $TOKEN_MINT_ADDRESS

You can also view total supply in Solana Explorer by visiting <https://explorer.solana.com/address/7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD>
