# NFT generation

## Description
This project is just a tutorial in order to generate an NFT collection based on some hand drawn images. The images are then combined in order to generate an NFT collections.

## Installation
Before running the script, you need to install the following dependencies. Run the following command in order to install the dependencies.
```bash
npm install
```

## Runnning the script
Before running the script you need to update the following variables in the index.js file which represents the number of NFT files to be generated.
```javascript
const NUMBER_OF_IMAGES = 900;
```

Run the following command in order to generate the NFT collection.
```bash
node index.js
```

## Output
The output of the script is a folder named output which contains the generated NFT collection. The output folder will be later used in order to mint the NFT collection. Those files need to be updated to the IPFS in order to be minted. Check ReadMe.md form `https://github.com/vladduricu/nft-frontend` in order to see how to upload the files to IPFS.