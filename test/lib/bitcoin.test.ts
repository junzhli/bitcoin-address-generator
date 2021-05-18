import { checkSeedPhrase, generateBitcoinSegwitAddress, getSegwitPath } from "../../src/lib/bitcoin";
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
});