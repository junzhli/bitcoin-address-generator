import express from "express";
import { body } from "express-validator";
import { validationResult } from "express-validator";
import logger from "../lib/logger";

const log = logger("input-validator-handler");

const _validatorsBody = {
    hdSeed: body("seed")
        .isString().customSanitizer((val: any) => {
            if (typeof val !== "string") {
                return val;
            }
            return val.toLowerCase();
        }),
    hdAccount: body("account").isNumeric().isInt({min: 0}),
    hdChange: body("change").isNumeric().isInt({min: 0, max: 1}),
    hdIndex: body("index").isNumeric().isInt({min: 0}),
    publicKeys: body("public_keys")
        .isArray()
        .customSanitizer((val: any) => {
            if (!Array.isArray(val)) {
                return val;
            }

            return val.map(v => {
                if (typeof v !== "string") {
                    return v;
                }

                return v.toLowerCase();
            });
        })
        .custom((val: any) => {
            if (!Array.isArray(val)) {
                return Promise.reject(new Error("not an array"));
            }

            const set = new Set();

            for (const v of val) {
                if (typeof v !== "string") {
                    return Promise.reject(new Error(`one of public keys is not represented by string: ${JSON.stringify(v)}`));
                }

                if (!/^([A-Fa-f0-9]){66}$/.test(v)) {
                    return Promise.reject(new Error(`one of public keys is not an appropriate string: ${v}`));
                }

                set.add(v.toLowerCase());
            }

            if (set.size !== val.length) {
                return Promise.reject(new Error("public keys contain duplicate"));
            }

            return true;
        })
    ,
    n: body("n").isNumeric().isInt({min: 1})
};

const generateBitcoinSegwitAddress = [
    _validatorsBody.hdSeed,
    _validatorsBody.hdAccount,
    _validatorsBody.hdChange,
    _validatorsBody.hdIndex
];

const generateBitcoinP2SHAddress = [
    _validatorsBody.publicKeys,
    _validatorsBody.n
];

const resultHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: -1, message: "provided parameters do not fit into what we need"});
        log.warn("provided request with errors: " + JSON.stringify(errors.array()));
        return;
    }
    next();
};

export default {
    generateBitcoinSegwitAddress,
    generateBitcoinP2SHAddress,
    resultHandler
};