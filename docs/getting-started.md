# Getting Started

## Install tools

Install latest version of Rust using <https://rustup.rs/>. We're using `rustc 1.62.1 (e092d0b6b 2022-07-16)` (since there were compile errors on `rustc 1.58.1 (db9d1b20b 2022-01-20)`).

    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

Let's deploy to `mainnet-beta` (or you can choose `devnet`):

    solana config set --url https://api.mainnet-beta.solana.com

## Create/Choose keypair

Create your keypair if you don't already have one. See <https://docs.solana.com/cli/conventions#keypair-conventions>.

    solana-keygen new --outfile ~/.config/solana/cog-coin.json

Then choose that keypair:

    solana config set --keypair ~/.config/solana/cog-coin.json

To verify, run `solana config get` and you should have a config that has these settings to RPC URL and Keypair Path:

    RPC URL: https://api.mainnet-beta.solana.com
    Keypair Path: /Users/USERNAME_HERE/.config/solana/cog-coin.json

To view your public key from the keypair

    solana-keygen pubkey
