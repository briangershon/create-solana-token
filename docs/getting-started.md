# Getting Started

## Install tools

1. [Install the Solana Tool Suite](https://docs.solana.com/cli/install-solana-cli-tools)

2. Let configure tools to use Solana's `mainnet-beta`:

   solana config set --url https://api.mainnet-beta.solana.com

On MacOS, if there are errors installing the Solana Tool Suite, you may need to upgrade Rust using <https://rustup.rs/>. We're using `rustc 1.62.1 (e092d0b6b 2022-07-16)` (since there were compile errors on `rustc 1.58.1 (db9d1b20b 2022-01-20)`).

## Create keypair

Create your keypair if you don't already have one. See <https://docs.solana.com/cli/conventions#keypair-conventions>.

In this case we're naming the file `coin-keypair.json` but you can name the file anything you want.

    solana-keygen new --outfile ~/.config/solana/coin-keypair.json

Then choose that keypair:

    solana config set --keypair ~/.config/solana/coin-keypair.json

To verify your configuration, run `solana config get` and you should have a config that has these settings to RPC URL and Keypair Path:

    RPC URL: https://api.mainnet-beta.solana.com
    Keypair Path: /Users/USERNAME_HERE/.config/solana/coin-keypair.json

To view your public key from the keypair:

    solana-keygen pubkey

**Important Final Keypair Steps**

1. You will **never** send your `~/.config/solana/coin-keypair.json` keypair file to anyone -- but you must keep this safe and backed-up (say in a password safe). You'll need it to sign transactions. Since you're the only one with access to the private key, your signature can be verified as coming from you and not someone else. If you lose it, or someone else finds it, they will have the power to sign on your behalf.

2. For multisig accounts, you want to provide your team with the public key (derived from that keypair file). Do not send the file, just run `solana-keygen pubkey` and send that public key. The key will be a string of text that looks something like this example: `7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD`.

## Install Solana Token Program

The `spl-token` program is a command-line interface that requires Rust to be installed.

### Install Rust language

Install latest version of Rust using <https://rustup.rs/>.

In a terminal or command window let's make sure Rust's `cargo` program is installed

    cargo --version

### Install spl-token program

Ok, with run installed and its cargo package manager available

    cargo install spl-token-cli

When that's succesfully, test it by running

    spl-token --version
