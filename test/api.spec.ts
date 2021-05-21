import supertest from "supertest";
import app from "../src/app";

const HEADER_CONTENT_TYPE = "application/json; charset=utf-8";

const GLOBAL_API_TIMEOUT = 5000; // 15s

describe("integration testings", () => {
    describe("api test", () => {
        test("it should be ok to generate bitcoin segwit with given seed phrase, account, change, index", async () => {
            const seed = "praise you muffin lion enable neck grocery crumble super myself license ghost";
            const response = await supertest(app)
                .post("/address/bitcoin/generateSegwitAddress")
                .send({
                    seed,
                    account: 0,
                    change: 0,
                    index: 0
                })
                .set("Content-Type", "application/json");

            expect(response.status).toBe(200);
            expect(response.headers["content-type"]).toBe(HEADER_CONTENT_TYPE);
            expect(typeof response.body).toBe("object");
            expect(response.body.address).toBe("bc1qpeeu3vjrm9dn2y42sl926374y5cvdhfn5k7kxm");
        }, GLOBAL_API_TIMEOUT);

        test("it should be ok to generate bitcoin segwit with given seed phrase (upper cases), account, change, index", async () => {
            const seed = "praise you muffin lion enable neck grocery crumble super myself license ghost";

            const response = await supertest(app)
                .post("/address/bitcoin/generateSegwitAddress")
                .send({
                    seed: seed.toUpperCase(),
                    account: 0,
                    change: 0,
                    index: 0
                })
                .set("Content-Type", "application/json");

            expect(response.status).toBe(200);
            expect(response.headers["content-type"]).toBe(HEADER_CONTENT_TYPE);
            expect(typeof response.body).toBe("object");
            expect(response.body.address).toBe("bc1qpeeu3vjrm9dn2y42sl926374y5cvdhfn5k7kxm");
        }, GLOBAL_API_TIMEOUT);

        test(`it should return error message with code 400 as invalid request (invalid parameter)`, async () => {
            const response = await supertest(app)
                .post("/address/bitcoin/generateSegwitAddress")
                .send({
                    account: 0,
                    change: 0,
                    index: 0
                })
                .set("Content-Type", "application/json");

            expect(response.status).toBe(400);
            expect(response.headers["content-type"]).toBe(HEADER_CONTENT_TYPE);
            expect(typeof response.body).toBe("object");
            expect(typeof response.body.error).toBe("number");
            expect(typeof response.body.message).toBe("string");
        }, GLOBAL_API_TIMEOUT);

        test(`it should return error message with code 400 as invalid request (seed is invalid)`, async () => {
            const seed = "aaaa";
            const response = await supertest(app)
                .post("/address/bitcoin/generateSegwitAddress")
                .send({
                    seed,
                    account: 0,
                    change: 0,
                    index: 0
                })
                .set("Content-Type", "application/json");

            expect(response.status).toBe(400);
            expect(response.headers["content-type"]).toBe(HEADER_CONTENT_TYPE);
            expect(typeof response.body).toBe("object");
            expect(typeof response.body.error).toBe("number");
            expect(response.body.error).toBe(-2);
            expect(typeof response.body.message).toBe("string");
        }, GLOBAL_API_TIMEOUT);

        test(`it should return error message with code 400 as invalid request (account is invalid)`, async () => {
            const seed = "praise you muffin lion enable neck grocery crumble super myself license ghost";
            const response = await supertest(app)
                .post("/address/bitcoin/generateSegwitAddress")
                .send({
                    seed,
                    account: -1,
                    change: 0,
                    index: 0
                })
                .set("Content-Type", "application/json");

            expect(response.status).toBe(400);
            expect(response.headers["content-type"]).toBe(HEADER_CONTENT_TYPE);
            expect(typeof response.body).toBe("object");
            expect(typeof response.body.error).toBe("number");
            expect(response.body.error).toBe(-1);
            expect(typeof response.body.message).toBe("string");
        }, GLOBAL_API_TIMEOUT);

        test(`it should return error message with code 400 as invalid request (change is invalid)`, async () => {
            const seed = "praise you muffin lion enable neck grocery crumble super myself license ghost";
            const response = await supertest(app)
                .post("/address/bitcoin/generateSegwitAddress")
                .send({
                    seed,
                    account: 0,
                    change: 2,
                    index: 0
                })
                .set("Content-Type", "application/json");

            expect(response.status).toBe(400);
            expect(response.headers["content-type"]).toBe(HEADER_CONTENT_TYPE);
            expect(typeof response.body).toBe("object");
            expect(typeof response.body.error).toBe("number");
            expect(response.body.error).toBe(-1);
            expect(typeof response.body.message).toBe("string");
        }, GLOBAL_API_TIMEOUT);

        test(`it should return error message with code 400 as invalid request (index is invalid)`, async () => {
            const seed = "praise you muffin lion enable neck grocery crumble super myself license ghost";
            const response = await supertest(app)
                .post("/address/bitcoin/generateSegwitAddress")
                .send({
                    seed,
                    account: 0,
                    change: 0,
                    index: -1
                })
                .set("Content-Type", "application/json");

            expect(response.status).toBe(400);
            expect(response.headers["content-type"]).toBe(HEADER_CONTENT_TYPE);
            expect(typeof response.body).toBe("object");
            expect(typeof response.body.error).toBe("number");
            expect(response.body.error).toBe(-1);
            expect(typeof response.body.message).toBe("string");
        }, GLOBAL_API_TIMEOUT);

        test("it should be ok to generate bitcoin p2sh address with given public keys and n", async () => {
            const publicKeys = [
                "033b3aa196c22d0765965ea37ad01eaf8eafbce74e15dc8c47fdaa193fc02e7a46",
                "02290fab3a48a7d43e1db0a74404d32660648841faa16e069bced29bda4a5e28c1",
                "03375f613b3d4c6c62f42fb74652c9452007ebfe57c6ed29ff59e87ec29b2d6ce6"
            ];

            const response = await supertest(app)
                .post("/address/bitcoin/generateP2SHAddress")
                .send({
                    public_keys: publicKeys,
                    n: 2
                })
                .set("Content-Type", "application/json");

            expect(response.status).toBe(200);
            expect(response.headers["content-type"]).toBe(HEADER_CONTENT_TYPE);
            expect(typeof response.body).toBe("object");
            expect(response.body.address).toBe("363Ph3sUd9joLY3UU2ZL3bAJ8oq1rcuhp3");
        }, GLOBAL_API_TIMEOUT);

        test("it should return error message with code 400 as invalid request (invalid arguments)", async () => {
            const publicKeys = [
                "033b3aa196c22d0765965ea37ad01eaf8eafbce74e15dc8c47fdaa193fc02e7a",
                "02290fab3a48a7d43e1db0a74404d32660648841faa16e069bced29bda4a5e28c1",
                "03375f613b3d4c6c62f42fb74652c9452007ebfe57c6ed29ff59e87ec29b2d6ce6"
            ];

            const response = await supertest(app)
                .post("/address/bitcoin/generateP2SHAddress")
                .send({
                    public_keys: publicKeys,
                    n: 2
                })
                .set("Content-Type", "application/json");

            expect(response.status).toBe(400);
            expect(response.headers["content-type"]).toBe(HEADER_CONTENT_TYPE);
            expect(typeof response.body).toBe("object");
            expect(typeof response.body.error).toBe("number");
            expect(response.body.error).toBe(-1);
            expect(typeof response.body.message).toBe("string");
        }, GLOBAL_API_TIMEOUT);
    });
});