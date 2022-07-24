# cog-solana-token

Let's create a Solana fungible token called a COG.

Metadata hosted on Arweave.

Token image cropped from photo by <https://unsplash.com/@opticonor>.

## Getting Started

Based on the Solana Token CLI setup and example: [Solana's Token Program](https://spl.solana.com/token)

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

### Create Token

Create a new token:

    spl-token create-token

Here's the token that was created in this example:

    7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD

No supply to start with.

### Main a supply of tokens

Create an account to hold the token supply balance:

    spl-token create-account 7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD

Which created this account:

    8CF2g8tDLgfn9PjDVL8ZwodTLmgc9tPUieu5TSVK6WPR

Mint 100 tokens

    spl-token mint 7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD 100

Total supply and this accounts balance should be both `100`:

    spl-token supply 7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD

You can also view total supply in Solana Explorer by visiting <https://explorer.solana.com/address/7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD>

### Try transferring tokens to another wallet

Let's add this new token to your wallet (and create an account for the token balance too, which will require some test SOL). For example, in Phantom wallet, make sure you're on `devnet` then click on `Manage token list` within first tab (`$`) and here's the info you need:

    Mint address: 7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD
    Name: COG
    Symbol: COG

Let's transfer 50 coins to your wallet:

    spl-token transfer 7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD 50 YOUR_WALLET_PUBLIC_KEY_HERE

You should now see those 50 tokens appear in your wallet. In Phantom, you'll see under the `$` tab. Or you can run:

    spl-token balance YOUR_WALLET_PUBLIC_KEY_HERE

## Adding Metadata for your new token

Now we need to provide and image and metadata for the token.

We're going to upload these files to Arweave for permanent storage and we'll pay in SOL.

### Create SOL Wallet

First let's create a Solana wallet that's accessible from command-line. Here's one approach [Using a Phantom Wallet Address with the Solana CLI](https://mattmazur.com/2021/11/18/using-a-phantom-wallet-address-with-the-solana-cli/) which is basically:

    solana-keygen recover 'prompt:?key=0/0' --outfile ~/.config/solana/my-mainnet-wallet.json

and then paste in your seedphrase at the prompt.

### Fund the bundlr node so we can upload files

We'll pay in SOL, so will use our wallet public key.

    # fund AR with 0.1 SOL using our Solana wallet created above
    npx @bundlr-network/client fund 100000000 -h https://node1.bundlr.network -w ~/.config/solana/my-mainnet-wallet.json -c solana

    # check our balance
    npx @bundlr-network/client balance THE_WALLET_PUBLIC_KEY -h https://node1.bundlr.network -c solana

### Upload token image

    npx @bundlr-network/client upload token_image.jpeg -h https://node1.bundlr.network -w ~/.config/solana/my-mainnet-wallet.json -c solana

    npx @bundlr-network/client upload token_image.jpeg -h https://node1.bundlr.network -c arweave

The image was uploaded to:

    <https://arweave.net/kNLuCPdnwvrlxBwCE-y1vlVxH5nKqiTorTYMJMXA39U>

### Edit and upload token_metadata.json

First add the token_image.jpeg URL to `token_metadata.json` file, which in this case the URL is <https://arweave.net/kNLuCPdnwvrlxBwCE-y1vlVxH5nKqiTorTYMJMXA39U>

Then upload the metadata file

    npx @bundlr-network/client upload token_metadata.json -h https://node1.bundlr.network -w ~/.config/solana/my-mainnet-wallet.json -c solana

The token metadata was uploaded to:

    https://arweave.net/OAQCAVuN118P78EkUuDv0rlE2XrBnBLE202ngYESXEk

### Create initial token metadata

    # metadata is currently hardcoded in script
    cd scripts
    npm run create-metadata

### Update token metadata

You have two choices.

1. Use script, but change script to call `updateMetadata()`

2. You can update metadata via <https://token-creator-lac.vercel.app/update>. This method won't create initial metadata after token is created, hence script above to do creation.

```
Token Mint Address: 7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD
Token Name: COG Token
Symbol: GOG
Metadata Url: https://arweave.net/OAQCAVuN118P78EkUuDv0rlE2XrBnBLE202ngYESXEk
```

## Resources

- [Solana's Token Program](https://spl.solana.com/token)
- [Token Creator](https://github.com/jacobcreech/Token-Creator)
