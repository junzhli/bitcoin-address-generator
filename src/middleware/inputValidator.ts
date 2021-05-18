import express from "express";
import { body } from "express-validator";
import { validationResult } from "express-validator";
import logger from "../lib/logger";

const log = logger("input-validator-handler");

const _validatorsBody = {
    hdSeed: body("seed")
        .isString().customSanitizer((val: string) => {
            if (typeof val !== "string") {
                return "";
            }
            return val.toLowerCase();
        }),
    hdAccount: body("account").isNumeric().isInt({min: 0}),
    hdChange: body("change").isNumeric().isInt({min: 0, max: 1}),
    hdIndex: body("index").isNumeric().isInt({min: 0}),
};

const generateBitcoinSegwitAddress = [
    _validatorsBody.hdSeed,
    _validatorsBody.hdAccount,
    _validatorsBody.hdChange,
    _validatorsBody.hdIndex
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
    resultHandler
};