# create-solana-token

<img src="./token/token_image.png" width="200" alt="Image of token which is a Buoy" />

## Overview

Here are the steps for creating a new Solana fungible token using command-line tools and scripts.

Also manage tokens safely across a team using a multisig wallet approach instead of a single owner.

The example token created here is called `BUOY` and the final version exists live on Solana at [7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD](https://explorer.solana.com/address/7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD).

The token image was created from a photo by <https://unsplash.com/@alexb>.

## Steps for creating new token

- [Getting started](./docs/getting-started.md) - install tools and choose keypair
- [Create token](./docs/create-token.md) and mint them
- [Add metadata](./docs/add-metadata.md) for your token and host on Arweave
- [Test token](./docs/test-token.md)
- Here's a [run through of the multisig signing process](./docs/multisig-signing-process.md)

## Steps for creating a multisig mint authority for token

- [Setup team management of token](./docs/setup-team-management.md) using multisig approach

## Setup for multsig signers

Scenario: You've been asked to be one of the official approvers of token minting.

- you can generate your keypair and public key by following [Getting started](./docs/getting-started.md).

- then [run through the multisig signing process](./docs/multisig-signing-process.md)

## Credits

These useful resources served as an initial foundation for docs and scripts in this repo:

- Solana's Token Program and Documentation: [Solana's Token Program](https://spl.solana.com/token)
- [Token Creator source code](https://github.com/jacobcreech/Token-Creator)
