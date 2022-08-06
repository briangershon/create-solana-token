# Setup Team Approach

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

## Create the multisig account

Gather everyone's public keys, decide how many signatures are required, then create the multisig account.

If you have 3 public keys, and require 2 signatures, here's the command you'd use:

    export TOKEN_MINT_ADDRESS=7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD

    export PUBLIC_KEY_1=BzWpkuRrwXHq4SSSFHa8FJf6DRQy4TaeoXnkA89vTgHZ
    export PUBLIC_KEY_2=DhkUfKgfZ8CF6PAGKwdABRL1VqkeNrTSRx8LZfpPFVNY
    export PUBLIC_KEY_3=D7ssXHrZJjfpZXsmDf8RwfPxe1BMMMmP1CtmX3WojPmG

    # create a new Solana data account with the multisig information
    spl-token create-multisig 2 $PUBLIC_KEY_1 $PUBLIC_KEY_2 $PUBLIC_KEY_3

which generated account `5TieiddCepVsUWu6E9VcWR9w3gp1w5hYka86TwWjipLV` that stores all this information.

View this account info on-chain at <https://explorer.solana.com/address/5TieiddCepVsUWu6E9VcWR9w3gp1w5hYka86TwWjipLV>

Then set it to an environment variable for later:

    export MULTISIG_ACCOUNT=5TieiddCepVsUWu6E9VcWR9w3gp1w5hYka86TwWjipLV

Then change the mint authority for the token to that new multisig wallet:

> CAUTION: You're changing the mint authority, which changes who can make changes to your token.

    spl-token authorize $TOKEN_MINT_ADDRESS mint $MULTISIG_ACCOUNT

`spl-token` commands will now use the `--owner` option to point to $MULTISIG_ACCOUNT and multiple `--multisig-signer` options to bring in signers.

Let's try to mint and test out the multisig process.

TODO

Make sure when you mint tokens, you add the `<RECIPIENT_TOKEN_ACCOUNT_ADDRESS>` option at the end so the tokens go to the right place.