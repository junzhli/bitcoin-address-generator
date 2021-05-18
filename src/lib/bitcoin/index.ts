import * as bip32 from "bip32";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import { SeedCheckError } from "./error";

const pathSegwitPrefix = "m/84'/0'";

const getSegwitPath = (account: number, change: boolean, index: number) => {
    const _change = (change) ? 1 : 0;
    return `${pathSegwitPrefix}/${account}'/${_change}/${index}`;
};

const checkSeedPhrase = (seedPhrase: string) => {
    // check if 12 words as expected
    const words = seedPhrase.split(" ");
    if (words.length !== 12) {
        throw new SeedCheckError("12 words as seed phrase is currently supported only!");
    }
    const wordsSet = new Set(words);
    if (wordsSet.size !== 12) {
        throw new SeedCheckError("12 words contain duplicate!");
    }

    // in wordlist (english)
    const wordList = bip39.wordlists.EN;
    for (const w of words) {
        if (!wordList.includes(w)) {
            throw new SeedCheckError("word is not in english wordlists");
        }
    }
};

const generateBitcoinSegwitAddress = async (seedPhrase: string, account: number, change: boolean, index: number) => {
    checkSeedPhrase(seedPhrase);
    
    const seedBuffer = await bip39.mnemonicToSeed(seedPhrase);
    const root = bip32.fromSeed(seedBuffer);
    const path = getSegwitPath(account, change, index);
    const instance = root.derivePath(path);
    return bitcoin.payments.p2wpkh({pubkey: instance.publicKey }).address!;
};

const generateNOutOfMP2SHAddress = (addresses: string[], publicKeys: string[], n: number) => {
    if (publicKeys.length !== addresses.length) {
        throw new TypeError("number of addresses doesn't equal to number of publicKeys");
    }
    
    if (publicKeys.length < n) {
        throw new TypeError("number of addresses/publicKeys (m) is less than n");
    }
    
    const _publicKeys = publicKeys.map(p => Buffer.from(p, "hex"));

    for (const [index, address] of addresses.entries()) {
        const _address = bitcoin.payments.p2pkh({pubkey: _publicKeys[index] }).address!;
        if (address !== _address) {
            throw new TypeError(`address at index ${index} doesn't match the public key at index ${index}`);
        }
    }

    return bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: n, pubkeys: _publicKeys })
    }).address!;
};

export {
    getSegwitPath,
    checkSeedPhrase,
    generateBitcoinSegwitAddress,
    generateNOutOfMP2SHAddress
};