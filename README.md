# cog-solana-token

Let's create a Solana fungible token called a COG.

Metadata hosted on Arweave.

## Getting Started

Based on the Solana Token CLI setup and example: [Solana's Token Program](https://spl.solana.com/token)

Install latest version of Rust using <https://rustup.rs/>. We're using `rustc 1.62.1 (e092d0b6b 2022-07-16)` (since there were compile errors on `rustc 1.58.1 (db9d1b20b 2022-01-20)`).

    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

Let's deploy to devnet, or choose another one: <https://docs.solana.com/clusters>

    solana config set --url https://api.devnet.solana.com

Create your keypair if you don't already have one. See <https://docs.solana.com/cli/conventions#keypair-conventions>.

    solana-keygen new --outfile ~/.config/solana/cog-coin.json

Then choose that keypair:

    solana config set --keypair ~/.config/solana/cog-coin.json

Now run `solana config get` and you should have a config that has these settings to RPC URL and Keypair Path:

    RPC URL: https://api.devnet.solana.com
    Keypair Path: /Users/USERNAME_HERE/.config/solana/cog-coin.json

Airdrop some test SOL for devnet:

    solana airdrop 2

Create a new token!

    spl-token create-token

Here's the token that was created in this example:

    3ocGpFEtykZvnyjySUwepwAuqa3aEVKTKEDLU5UzWoVR

No supply to start with:

    spl-token supply 3ocGpFEtykZvnyjySUwepwAuqa3aEVKTKEDLU5UzWoVR

Create an account to hold the token supply balance:

    spl-token create-account 3ocGpFEtykZvnyjySUwepwAuqa3aEVKTKEDLU5UzWoVR

Which created this account:

    2uYURG8aCcr5Q6QNg6ZNk8nikRH8iZ3NpBBtM4Ggnzzm

What's balance for this account?

    spl-token balance 3ocGpFEtykZvnyjySUwepwAuqa3aEVKTKEDLU5UzWoVR

Mint 100 tokens

    spl-token mint 3ocGpFEtykZvnyjySUwepwAuqa3aEVKTKEDLU5UzWoVR 100

Total supply and this accounts balance should be both `100`:

    spl-token supply 3ocGpFEtykZvnyjySUwepwAuqa3aEVKTKEDLU5UzWoVR
    spl-token balance 3ocGpFEtykZvnyjySUwepwAuqa3aEVKTKEDLU5UzWoVR

Let's add this new token to your wallet (and create an account for the token balance too, which will require some test SOL). For example, in Phantom wallet, make sure you're on `devnet` then click on `Manage token list` within first tab (`$`) and here's the info you need:

    Mint address: 3ocGpFEtykZvnyjySUwepwAuqa3aEVKTKEDLU5UzWoVR
    Name: COG
    Symbol: COG

Let's transfer 50 coins to your wallet:

    spl-token transfer 3ocGpFEtykZvnyjySUwepwAuqa3aEVKTKEDLU5UzWoVR 50 YOUR_WALLET_PUBLIC_KEY_HERE

    # If the receiver does not yet have an associated token account,
    # the sender may choose to fund the receiver's account.
    spl-token transfer --fund-recipient 3ocGpFEtykZvnyjySUwepwAuqa3aEVKTKEDLU5UzWoVR 50 YOUR_WALLET_PUBLIC_KEY_HERE

You should now see those tokens appear in your wallet. In Phantom, you'll see under the `$` tab.

Let's see all the token info on Solana Explorer by visiting <https://explorer.solana.com/address/3ocGpFEtykZvnyjySUwepwAuqa3aEVKTKEDLU5UzWoVR?cluster=devnet>

## Resources

- [Solana's Token Program](https://spl.solana.com/token)
- [Token Creator](https://github.com/jacobcreech/Token-Creator)
