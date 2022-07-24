# cog-solana-token

Create a new Solana fungible token using command-line tools and scripts.

Token image was created from a photo by <https://unsplash.com/@opticonor>.

The steps for creating a token are:

- Create a token and supply it with an initial number of tokens
- Host token image and metadata on Arweave
- Add metadata to token (and can update later) (script written in this repo)
- Transfer tokens to others

## Getting Started

Token creation instructions are based on the Solana Token CLI example: [Solana's Token Program](https://spl.solana.com/token)

### Install tools

Install latest version of Rust using <https://rustup.rs/>. We're using `rustc 1.62.1 (e092d0b6b 2022-07-16)` (since there were compile errors on `rustc 1.58.1 (db9d1b20b 2022-01-20)`).

    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

Let's deploy to mainnet-beta:

    solana config set --url https://api.mainnet-beta.solana.com

### Create/Choose keypair

Create your keypair if you don't already have one. See <https://docs.solana.com/cli/conventions#keypair-conventions>.

    solana-keygen new --outfile ~/.config/solana/cog-coin.json

Then choose that keypair:

    solana config set --keypair ~/.config/solana/cog-coin.json

Now run `solana config get` and you should have a config that has these settings to RPC URL and Keypair Path:

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

    npx @bundlr-network/client upload token_image.jpeg -h https://node1.bundlr.network -w ~/.config/solana/my-mainnet-wallet.json -c solana

The image was uploaded to:

    <https://arweave.net/kNLuCPdnwvrlxBwCE-y1vlVxH5nKqiTorTYMJMXA39U>

View [transaction on ViewBlock.io](https://viewblock.io/arweave/tx/kNLuCPdnwvrlxBwCE-y1vlVxH5nKqiTorTYMJMXA39U).

### Edit and upload token_metadata.json

First add the token_image.jpeg URL to `token_metadata.json` file, which in this case the URL is <https://arweave.net/kNLuCPdnwvrlxBwCE-y1vlVxH5nKqiTorTYMJMXA39U>

Then upload the metadata file

    npx @bundlr-network/client upload token_metadata.json -h https://node1.bundlr.network -w ~/.config/solana/my-mainnet-wallet.json -c solana

The token metadata was uploaded to:

    https://arweave.net/OAQCAVuN118P78EkUuDv0rlE2XrBnBLE202ngYESXEk

View [transaction on ViewBlock.io](https://viewblock.io/arweave/tx/OAQCAVuN118P78EkUuDv0rlE2XrBnBLE202ngYESXEk).

### Create initial token metadata

    # metadata is currently hardcoded in script
    cd scripts
    npm run create-metadata

### Update token metadata

You have two choices.

1. Use script, but change script to call `updateMetadata()`

2. You can update metadata via <https://token-creator-lac.vercel.app/update>. This method won't create initial metadata after token is created, hence needing our script. Note: you'll **first need to import your filesystem wallet** into your Phantom wallet so you have permissions to update metadata.

```
Token Mint Address: 7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD
Token Name: COG Token
Symbol: GOG
Metadata Url: https://arweave.net/OAQCAVuN118P78EkUuDv0rlE2XrBnBLE202ngYESXEk
```

## Try transferring tokens to another wallet

Let's add this new token to your wallet (and create an account for the token balance too, which will require some test SOL). For example, in Phantom wallet, make sure you're on `mainnet-beta` then click on `Manage token list` within first tab (`$`) and here's the info you need:

    Mint address: 7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD
    Name: COG Token
    Symbol: COG

Let's transfer 50 coins to your wallet:

    spl-token transfer 7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD 50 YOUR_WALLET_PUBLIC_KEY_HERE

You should now see those 50 tokens appear in your wallet. In Phantom, you'll see under the `$` tab. Or you can run:

    spl-token balance YOUR_WALLET_PUBLIC_KEY_HERE

## Resources

- [Solana's Token Program](https://spl.solana.com/token)
- [Token Creator source code](https://github.com/jacobcreech/Token-Creator)
