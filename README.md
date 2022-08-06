# create-solana-token

<img src="./token/token_image.png" width="200" alt="Image of token which is a Buoy" />

## Overview

Here are the steps for creating a new Solana fungible token using command-line tools and scripts.

The example token created here is called `BUOY` and the final version exists live on Solana at [7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD](https://explorer.solana.com/address/7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD). The token image was created from a photo by <https://unsplash.com/@alexb>.

The steps for creating a token are:

- Create a token and supply it with an initial number of tokens
- Host token image and metadata, in this case using [Arweave](https://www.arweave.org/)
- Add (and update) metadata for token via the script written in this repo

## Getting Started

### Install tools

Install latest version of Rust using <https://rustup.rs/>. We're using `rustc 1.62.1 (e092d0b6b 2022-07-16)` (since there were compile errors on `rustc 1.58.1 (db9d1b20b 2022-01-20)`).

    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

Let's deploy to `mainnet-beta` (or you can choose `devnet`):

    solana config set --url https://api.mainnet-beta.solana.com

### Create/Choose keypair

Create your keypair if you don't already have one. See <https://docs.solana.com/cli/conventions#keypair-conventions>.

    solana-keygen new --outfile ~/.config/solana/cog-coin.json

Then choose that keypair:

    solana config set --keypair ~/.config/solana/cog-coin.json

To verify, run `solana config get` and you should have a config that has these settings to RPC URL and Keypair Path:

    RPC URL: https://api.mainnet-beta.solana.com
    Keypair Path: /Users/USERNAME_HERE/.config/solana/cog-coin.json

## Create Token

Create a new token:

    spl-token create-token

Here's the token that was created in this example:

    7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD

No supply to start with.

### Create a supply of tokens

Create an account to hold the token supply balance:

    spl-token create-account 7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD

Which created this account:

    8CF2g8tDLgfn9PjDVL8ZwodTLmgc9tPUieu5TSVK6WPR

Mint 100 tokens

    spl-token mint 7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD 100

Total supply and this accounts balance should be both `100`:

    spl-token supply 7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD

You can also view total supply in Solana Explorer by visiting <https://explorer.solana.com/address/7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD>

## Adding Metadata for your new token

Now we need to provide and image and metadata for the token.

We're going to upload these files to Arweave for permanent storage and we'll pay in SOL.

Then we'll create metadata for the token via a script in this repository.

### Fund the bundlr node so we can upload files to Arweave

We'll pay in SOL, so will use our own wallet public key, as shown below with `THE_WALLET_PUBLIC_KEY` placeholder.

    # fund AR with 0.1 SOL using any Solana wallet to pay for it
    npx @bundlr-network/client fund 100000000 -h https://node1.bundlr.network -w ~/.config/solana/my-mainnet-wallet.json -c solana

    # check our balance
    npx @bundlr-network/client balance THE_WALLET_PUBLIC_KEY -h https://node1.bundlr.network -c solana

### Upload token image

    npx @bundlr-network/client upload token/token_image.png -h https://node1.bundlr.network -w ~/.config/solana/my-mainnet-wallet.json -c solana

The image was uploaded to <https://arweave.net/nWYCzV8L44EozywXUqrRO2n7Wxa72q6tOe1H7LkBu0s>.

### Edit and upload token_metadata.json

First add the token_image.png Arweave URL (from above) to `token/token_metadata.json` file.

Then upload the metadata file

    npx @bundlr-network/client upload token/token_metadata.json -h https://node1.bundlr.network -w ~/.config/solana/my-mainnet-wallet.json -c solana

The token metadata was uploaded to <https://arweave.net/Wtvd6MvCBO_ZXbLcR20mHDhBx2Bwpx_xZSb3OM_cDzg>.

### Create initial token metadata

    # metadata is currently hardcoded in script
    npm run create-metadata

### Update token metadata

You have two choices.

1. Use script, but change script to call `updateMetadata()`

2. You can update metadata via <https://token-creator-lac.vercel.app/update>. This method won't create initial metadata after token is created, hence needing our script. Note: you'll **first need to import your filesystem wallet** into your Phantom wallet so you have permissions to update metadata.

Find the token metadata here in [token_metadata.json](./token/token_metadata.json).

## Testing Token

### Transfer tokens to another wallet

Let's transfer 50 tokens to your wallet:

    spl-token transfer 7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD 50 YOUR_WALLET_PUBLIC_KEY_HERE

You should now see those 50 tokens appear in your wallet. In Phantom, you'll see under the `$` tab. Or you can run:

    spl-token balance YOUR_WALLET_PUBLIC_KEY_HERE

## Resources

- Solana's Token Program and Documentation: [Solana's Token Program](https://spl.solana.com/token)
- [Token Creator source code](https://github.com/jacobcreech/Token-Creator)
