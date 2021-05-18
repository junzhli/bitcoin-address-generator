import { checkSeedPhrase, generateBitcoinSegwitAddress, generateNOutOfMP2SHAddress, getSegwitPath } from "../../src/lib/bitcoin";
import { SeedCheckError } from "../../src/lib/bitcoin/error";

describe("bitcoin lib testings", () => {
    describe("getSegwitPath test", () => {
        test("it should return bitcoin wallet hd key path with given account, change and index", async () => {
            const account = 1;
            const change = true;
            const index = 1;

            const path = getSegwitPath(account, change, index);
            expect(path).toBe("m/84'/0'/1'/1/1");
        });
    });

    describe("checkSeedPhrase test", () => {
        test("it should return nothing as seed is valid", async () => {
            const seed = "praise you muffin lion enable neck grocery crumble super myself license ghost";
            expect(checkSeedPhrase(seed)).toBe(undefined);
        });

        test("it should throw seed check error as words in seed is not 12 in length", async () => {
            const seed = "praise you muffin lion enable neck grocery crumble super myself license";
            expect(checkSeedPhrase.bind(undefined, seed)).toThrow(SeedCheckError);
        });

        test("it should throw seed check error as words in seed contain duplicates", async () => {
            const seed = "praise you muffin lion enable neck grocery crumble myself myself license";
            expect(checkSeedPhrase.bind(undefined, seed)).toThrow(SeedCheckError);
        });

        test("it should throw seed check error as words in seed don't exist in english-wordlists", async () => {
            const seed = "praise you muffin lion enable neck grocery crumble super myself licenseeee";
            expect(checkSeedPhrase.bind(undefined, seed)).toThrow(SeedCheckError);
        });
    });

    describe("generateBitcoinSegwitAddress test", () => {
        test("it should return address (not change)", async () => {
            const seed = "praise you muffin lion enable neck grocery crumble super myself license ghost";
            const account = 0;
            const change = false;
            const index = 0;
            expect(await generateBitcoinSegwitAddress(seed, account, change, index)).toBe("bc1qpeeu3vjrm9dn2y42sl926374y5cvdhfn5k7kxm");
        });

        test("it should return address (change)", async () => {
            const seed = "praise you muffin lion enable neck grocery crumble super myself license ghost";
            const account = 0;
            const change = true;
            const index = 0;
            expect(await generateBitcoinSegwitAddress(seed, account, change, index)).toBe("bc1q5agj58cuevcmzs68qgasc956h87aqnhxjdel5f");
        });

        test("it should throw seed check error because of invalid seed", async () => {
            const seed = "praise you muffin lion enable neck grocery crumble super myself license ghost!!!!";
            const account = 0;
            const change = true;
            const index = 0;
            await expect(generateBitcoinSegwitAddress(seed, account, change, index)).rejects.toThrow(SeedCheckError);
        });
    });

    describe("generateNOutOfMP2SHAddress test", () => {
        test("it should return address", async () => {
            const addresses = [
                "1PLDRLacEkAaaiWnfojVDb5hWpwXvKJrRa",
                "1BAgzvv2gsUjx7owJeSFhtexQ97yWQFEZe",
                "16nnTfKoJijyrKcxzD4U9x5ku6saCoCYdj"
            ];
            const publicKeys = [
                "033b3aa196c22d0765965ea37ad01eaf8eafbce74e15dc8c47fdaa193fc02e7a46",
                "02290fab3a48a7d43e1db0a74404d32660648841faa16e069bced29bda4a5e28c1",
                "03375f613b3d4c6c62f42fb74652c9452007ebfe57c6ed29ff59e87ec29b2d6ce6"
            ];
            expect(generateNOutOfMP2SHAddress(addresses, publicKeys, 2)).toBe("363Ph3sUd9joLY3UU2ZL3bAJ8oq1rcuhp3");
        });

        test("it should throw error as one of addresses doesn't match the specified public", async () => {
            const addresses = [
                "1BAgzvv2gsUjx7owJeSFhtexQ97yWQFEZe",
                "1PLDRLacEkAaaiWnfojVDb5hWpwXvKJrRa",
                "16nnTfKoJijyrKcxzD4U9x5ku6saCoCYdj"
            ];
            const publicKeys = [
                "033b3aa196c22d0765965ea37ad01eaf8eafbce74e15dc8c47fdaa193fc02e7a46",
                "02290fab3a48a7d43e1db0a74404d32660648841faa16e069bced29bda4a5e28c1",
                "03375f613b3d4c6c62f42fb74652c9452007ebfe57c6ed29ff59e87ec29b2d6ce6"
            ];
            expect(generateNOutOfMP2SHAddress.bind(undefined, addresses, publicKeys, 2)).toThrow(TypeError);
        });

        test("it should throw error as n is less than m in n out of m", async () => {
            const addresses = [
                "1PLDRLacEkAaaiWnfojVDb5hWpwXvKJrRa",
                "1BAgzvv2gsUjx7owJeSFhtexQ97yWQFEZe",
                "16nnTfKoJijyrKcxzD4U9x5ku6saCoCYdj"
            ];
            const publicKeys = [
                "033b3aa196c22d0765965ea37ad01eaf8eafbce74e15dc8c47fdaa193fc02e7a46",
                "02290fab3a48a7d43e1db0a74404d32660648841faa16e069bced29bda4a5e28c1",
                "03375f613b3d4c6c62f42fb74652c9452007ebfe57c6ed29ff59e87ec29b2d6ce6"
            ];
            expect(generateNOutOfMP2SHAddress.bind(undefined, addresses, publicKeys, 4)).toThrow(TypeError);
        });

        test("it should throw error as number of addresses doesn't equal number of publicKeys", async () => {
            const addresses = [
                "1PLDRLacEkAaaiWnfojVDb5hWpwXvKJrRa",
                "1BAgzvv2gsUjx7owJeSFhtexQ97yWQFEZe",
                "16nnTfKoJijyrKcxzD4U9x5ku6saCoCYdj",
                "16nnTfKoJijyrKcxzD4U9x5ku6saCoCYdj"
            ];
            const publicKeys = [
                "033b3aa196c22d0765965ea37ad01eaf8eafbce74e15dc8c47fdaa193fc02e7a46",
                "02290fab3a48a7d43e1db0a74404d32660648841faa16e069bced29bda4a5e28c1",
                "03375f613b3d4c6c62f42fb74652c9452007ebfe57c6ed29ff59e87ec29b2d6ce6"
            ];
            expect(generateNOutOfMP2SHAddress.bind(undefined, addresses, publicKeys, 2)).toThrow(TypeError);
        });

        test("it should throw error as some arguments are invalid", async () => {
            const addresses = [
                "1PLDRLacEkAaaiWnfojVDb5hWpwXvKJrRa",
                "1BAgzvv2gsUjx7owJeSFhtexQ97yWQFEZe",
                "16nnTfKoJijyrKcxzD4U9x5ku6saCoCYdj"
            ];
            const publicKeys = [
                "033b3aa196c22d0765965ea37ad01eaf8eafbce74e15dc8c47fdaa193",
                "02290fab3a48a7d43e1db0a74404d32660648841faa16e069bced29bda4a5e28c1",
                "03375f613b3d4c6c62f42fb74652c9452007ebfe57c6ed29ff59e87ec29b2d6ce6"
            ];
            expect(generateNOutOfMP2SHAddress.bind(undefined, addresses, publicKeys, 2)).toThrow(Error);
        });
    });
});