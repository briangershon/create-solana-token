# Run through the MINTING and SIGNING process

## Tool setup

To install the tools, see [Getting started](./getting-started.md).

Ensure you have the latest version of your tools.

    solana --version            # ours is 1.10.32
    spl-token --version         # ours is 2.0.16

These latest versions were needed recently when the format of the Nonce changed. Without having latest versions you may see "data account" errors.

## Set keypair for as upcoming fee payer and Nonce authority

    # set your key as the payer
    solana config set --keypair ~/.config/solana/coin-keypair.json

## Set environment variables for minting process

    # here's the general info about the token and mint
    export TOKEN_MINT_ADDRESS=7uVii1LGC5jCJAgHHmLqKZP3bpNtJS6ywHW6CUSocuyD
    export MULTISIG_ACCOUNT=Bb2ske4Wpjd5xjkD1MVCnoXuFZDGUJCcehmcYFoUJVt1
    export NONCE_PUBLIC_KEY=4LZucffEpb21wZifheqhUnxigLQFRRGFUgx7THL8Xxxp
    export COIN_PUBLIC_KEY=BrtiXxJN5H7zoLyAsucBuymAgpYH8zRcR3NiQuyP9mPL

    # this is where you want the minted tokens to go
    export YOUR_WALLET_PUBLIC_KEY_HERE=5SjuawfgWTaJqBF2fcA3fYpGhiNaCMYJgzLaPcSBYTeu
    export ASSOCIATED_TOKEN_ACCOUNT=zsmZEGsdGZuo6ngM6tcreaQQUriKx3XKVpzrRoL6j9F

    # these are the signers who approve the minting
    export SIGNER_PUBLIC_KEY_1=3m9oUysTUgry1YEfBNx48yZZVNvHgbjd1CVCp744cZoz
    export SIGNER_PUBLIC_KEY_2=HM4jSVX5ujwmrrytpS7mGrFB9sCf6mhLn97eMiJNvATs

    # and each time the NONCE_BLOCKHASH needs to be set
    # by running: `solana nonce-account $NONCE_PUBLIC_KEY` and grabbing latest blockhash value
    export NONCE_BLOCKHASH=H4u4rJMD5LGZdcr6rU6po1MS9ChhoGFky6RdyP29hC1j

    # create absent signers to kick things off
    spl-token mint $TOKEN_MINT_ADDRESS 1 $ASSOCIATED_TOKEN_ACCOUNT \
    --owner $MULTISIG_ACCOUNT \
    --multisig-signer $SIGNER_PUBLIC_KEY_1 \
    --multisig-signer $SIGNER_PUBLIC_KEY_2 \
    --blockhash $NONCE_BLOCKHASH \
    --nonce $NONCE_PUBLIC_KEY \
    --nonce-authority $COIN_PUBLIC_KEY \
    --fee-payer $COIN_PUBLIC_KEY \
    --sign-only \
    --mint-decimals 9

## each signer must run same command but substituting in their keypair

Here's signer-1's command

    spl-token mint $TOKEN_MINT_ADDRESS 1 $ASSOCIATED_TOKEN_ACCOUNT \
    --owner $MULTISIG_ACCOUNT \
    --multisig-signer ~/.config/solana/signer-1.json \
    --multisig-signer $SIGNER_PUBLIC_KEY_2 \
    --blockhash $NONCE_BLOCKHASH \
    --nonce $NONCE_PUBLIC_KEY \
    --nonce-authority $COIN_PUBLIC_KEY \
    --fee-payer $COIN_PUBLIC_KEY \
    --sign-only \
    --mint-decimals 9

Results will be the signer's PubKey=Signature

Signers (Pubkey=Signature):
3m9oUysTUgry1YEfBNx48yZZVNvHgbjd1CVCp744cZoz=8vUDiHQ3a4sxnLdwKuX7jod9KDhWwpjKW7KUkigxJSUXpUdMWCwZtrSrYfFr2YvvS6xBiRQ4CDY3UMV5Ls9hM7S

Here's signer-2's command

    spl-token mint $TOKEN_MINT_ADDRESS 1 $ASSOCIATED_TOKEN_ACCOUNT \
    --owner $MULTISIG_ACCOUNT \
    --multisig-signer $SIGNER_PUBLIC_KEY_1 \
    --multisig-signer ~/.config/solana/signer-2.json \
    --blockhash $NONCE_BLOCKHASH \
    --nonce $NONCE_PUBLIC_KEY \
    --nonce-authority $COIN_PUBLIC_KEY \
    --fee-payer $COIN_PUBLIC_KEY \
    --sign-only \
    --mint-decimals 9

Results will be the signer's PubKey=Signature

Signers (Pubkey=Signature):
HM4jSVX5ujwmrrytpS7mGrFB9sCf6mhLn97eMiJNvATs=xkjbJCdyYLpiwYCTVv9C19A695oPCKtPencEHuKjw3EX2WrrrdCAo5dwvi3HF69gGCwLd4qi9fg3LJaUKzkf2S1

## Finalize mint

To finalize and complete minting the originating party gathers the `Pubkey=Signature`s and runs:

    spl-token mint $TOKEN_MINT_ADDRESS 1 $ASSOCIATED_TOKEN_ACCOUNT \
    --owner $MULTISIG_ACCOUNT \
    --multisig-signer $SIGNER_PUBLIC_KEY_1 \
    --multisig-signer $SIGNER_PUBLIC_KEY_2 \
    --blockhash $NONCE_BLOCKHASH \
    --nonce $NONCE_PUBLIC_KEY \
    --nonce-authority ~/.config/solana/coin-keypair.json \
    --fee-payer ~/.config/solana/coin-keypair.json \
    --signer 3m9oUysTUgry1YEfBNx48yZZVNvHgbjd1CVCp744cZoz=8vUDiHQ3a4sxnLdwKuX7jod9KDhWwpjKW7KUkigxJSUXpUdMWCwZtrSrYfFr2YvvS6xBiRQ4CDY3UMV5Ls9hM7S \
    --signer HM4jSVX5ujwmrrytpS7mGrFB9sCf6mhLn97eMiJNvATs=xkjbJCdyYLpiwYCTVv9C19A695oPCKtPencEHuKjw3EX2WrrrdCAo5dwvi3HF69gGCwLd4qi9fg3LJaUKzkf2S1

The mint is successful and the Nonce is incremented for next time.
