# Add metadata for token

Now we need to provide and image and metadata for the token.

We're going to upload these files to Arweave for permanent storage and we'll pay in SOL.

Then we'll create metadata for the token via a script in this repository.

## Fund the bundlr node so we can upload files to Arweave

We'll pay in SOL, so first make sure your `coin-keypair.json` has some SOL to spend.

    # save current public key to COIN_KEYPAIR_PUBLIC_KEY using Bash backticks to run solana-keygen
    export COIN_KEYPAIR_PUBLIC_KEY=`solana-keygen pubkey`

    # verify by running
    echo $COIN_KEYPAIR_PUBLIC_KEY

    # fund AR with 0.1 SOL using any Solana wallet to pay for it
    npx @bundlr-network/client fund 100000000 -h https://node1.bundlr.network -w ~/.config/solana/coin-keypair.json -c solana

    # check our balance (may need to wait a few seconds after funding)
    npx @bundlr-network/client balance $COIN_KEYPAIR_PUBLIC_KEY -h https://node1.bundlr.network -c solana

## Upload token image

    npx @bundlr-network/client upload token/token_image.png -h https://node1.bundlr.network -w ~/.config/solana/coin-keypair.json -c solana

The image was uploaded to <https://arweave.net/nWYCzV8L44EozywXUqrRO2n7Wxa72q6tOe1H7LkBu0s>.

## Edit and upload token_metadata.json

First add the token_image.png Arweave URL (from above) to `token/token_metadata.json` file.

Then upload the metadata file

    npx @bundlr-network/client upload token/token_metadata.json -h https://node1.bundlr.network -w ~/.config/solana/coin-keypair.json -c solana

The token metadata was uploaded to <https://arweave.net/Wtvd6MvCBO_ZXbLcR20mHDhBx2Bwpx_xZSb3OM_cDzg>.

## Create initial token metadata

Find the token metadata here in [token_metadata.json](./token/token_metadata.json).

    # the script parameters are currently hard-coded so
    # ensure everything is set correctly before running, including:
    #
    #   clusterApiUrl() (default: mainnet)
    #   privateKeyFile
    #   the metadata itself at the bottom of the script which should match token_metadata.json
    #       and with "tokenUrl" set to the url of the metadata that was uploaded above
    #
    npm run create-metadata

## Update token metadata

You have two choices.

1. Use script, but manually change `./scripts/create-metadata.ts` script to call `updateMetadata()` and then `npm run create-metadata`.

2. You can update metadata via <https://token-creator-lac.vercel.app/update>. This method won't create initial metadata after token is created, hence needing our script. Note: you'll **first need to import your filesystem wallet** into your Phantom wallet so you have permissions to update metadata.

Find the token metadata here in [token_metadata.json](./token/token_metadata.json).
