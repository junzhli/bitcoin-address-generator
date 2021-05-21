import { checkSeedPhrase, generateBitcoinSegwitAddress, generateNOutOfMP2SHAddress, getPath } from "../../src/lib/bitcoin";
import { SeedCheckError } from "../../src/lib/bitcoin/error";

describe("bitcoin lib testings", () => {
    describe("getPath (Segwit) test", () => {
        test("it should return bitcoin wallet hd key path with given account, change and index", async () => {
            const account = 1;
            const change = true;
            const index = 1;

            const path = getPath(account, change, index);
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
        test("it should return address with compressed public key", async () => {
            const publicKeys = [
                "033b3aa196c22d0765965ea37ad01eaf8eafbce74e15dc8c47fdaa193fc02e7a46",
                "02290fab3a48a7d43e1db0a74404d32660648841faa16e069bced29bda4a5e28c1",
                "03375f613b3d4c6c62f42fb74652c9452007ebfe57c6ed29ff59e87ec29b2d6ce6"
            ];
            expect(generateNOutOfMP2SHAddress(publicKeys, 2)).toBe("363Ph3sUd9joLY3UU2ZL3bAJ8oq1rcuhp3");
        });

        test("it should return address with uncompressed public key", async () => {
            const publicKeys = [
                "033b3aa196c22d0765965ea37ad01eaf8eafbce74e15dc8c47fdaa193fc02e7a46",
                "02290fab3a48a7d43e1db0a74404d32660648841faa16e069bced29bda4a5e28c1",
                "04909f1f1bc5ced0885beafe1552be8739a69b887b316504e133816804a43c5b191e13185a7a1a1195569f73a0add03d4b0edcb74b5422abc85a255d897a8076c7"
            ];
            expect(generateNOutOfMP2SHAddress(publicKeys, 2)).toBe("3Goc64p9HHWCwdcnMe42F4QbtgwyGqrj8x");
        });

        test("it should throw error as n is less than m in n out of m", async () => {
            const publicKeys = [
                "033b3aa196c22d0765965ea37ad01eaf8eafbce74e15dc8c47fdaa193fc02e7a46",
                "02290fab3a48a7d43e1db0a74404d32660648841faa16e069bced29bda4a5e28c1",
                "03375f613b3d4c6c62f42fb74652c9452007ebfe57c6ed29ff59e87ec29b2d6ce6"
            ];
            expect(generateNOutOfMP2SHAddress.bind(undefined, publicKeys, 4)).toThrow(TypeError);
        });

        test("it should throw error as some arguments are invalid", async () => {
            const publicKeys = [
                "033b3aa196c22d0765965ea37ad01eaf8eafbce74e15dc8c47fdaa193",
                "02290fab3a48a7d43e1db0a74404d32660648841faa16e069bced29bda4a5e28c1",
                "03375f613b3d4c6c62f42fb74652c9452007ebfe57c6ed29ff59e87ec29b2d6ce6"
            ];
            expect(generateNOutOfMP2SHAddress.bind(undefined, publicKeys, 2)).toThrow(Error);
        });
    });
});