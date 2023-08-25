const { readFileSync, writeFileSync } = require('fs');
const sharp = require('sharp');

const NUMBER_OF_IMAGES = 900;

const TEMPLATE = `
    <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- bg -->
        <!-- head -->
        <!-- hair -->
        <!-- eyes -->
        <!-- nose -->
        <!-- mouth -->
        <!-- beard -->
    </svg>
`

const NAMES = require('./names.json');
const ATTRIBUTES = require('./attributes.json');

const takenNames = [];
const takenFaces = [];

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function randomArrElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// This function is to get the layer from the layers folder
// With the regex we are getting the content between the svg tags
function getLayer(name, skip = 0.0) {
    const svg = readFileSync(`./layers/${name}.svg`, 'utf-8');
    const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g
    const layer = svg.match(re)[0];
    return Math.random() > skip ? layer : '';
}

async function svgToPng(name) {
    const src = `./out/${name}.svg`;
    const dest = `./out/${name}.png`;

    const img = await sharp(src);
    const resized = await img.resize(1024);
    await resized.toFile(dest);
}

function rarity() {
    return Math.round(Math.random() * 10) / 10
}

// Function to generate a random name for each image in the NFT collection
function generateRandomName() {
    const randomName = randomArrElement(NAMES);
    const randomAttribute = randomArrElement(ATTRIBUTES);

    const generatedName = `${randomName}-${randomAttribute}`.replace(/\s/g, '-').toLocaleLowerCase();

    if (takenNames.includes(generatedName)) {
        return generateRandomName();
    } else {
        takenNames.push(generatedName);
        return generatedName;
    }
}

// Number of images to create are 900 images
function createImage() {
    const index = takenFaces.length;

    // Max is for how many images of that type we have in the layers folder
    const bg = randomInt(5);
    const hair = randomInt(7);
    const eyes = randomInt(9);
    const nose = randomInt(4);
    const mouth = randomInt(5);
    const beard = randomInt(3);

    // Face is a combination of ints from above
    const face = [hair, eyes, mouth, nose, beard].join("");

    if (takenFaces.includes(face)) {
        return createImage();
    } else {
        const name = generateRandomName();
        takenFaces.push(face);

        const image = TEMPLATE
            .replace('<!-- bg -->', getLayer(`bg${bg}`))
            .replace('<!-- head -->', getLayer('head0'))
            .replace('<!-- hair -->', getLayer(`hair${hair}`))
            .replace('<!-- eyes -->', getLayer(`eyes${eyes}`))
            .replace('<!-- nose -->', getLayer(`nose${nose}`))
            .replace('<!-- mouth -->', getLayer(`mouth${mouth}`))
            .replace('<!-- beard -->', getLayer(`beard${beard}`, 0.5))

        const metadata = {
            name,
            description: `This is a random generated face with the name ${name}`,
            image: `${index}.png`,
            attributes: [
                {
                    beard: "",
                    rarity: rarity()
                }
            ]
        }

        writeFileSync(`./out/${index}.json`, JSON.stringify(metadata));
        writeFileSync(`./out/${index}.svg`, image);
        svgToPng(index);
    }
}




do {
    createImage()
} while (takenFaces.length < NUMBER_OF_IMAGES)