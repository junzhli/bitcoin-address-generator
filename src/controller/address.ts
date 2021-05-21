
import express from "express";
import {generateBitcoinSegwitAddress as _generateBitcoinSegwitAddress, generateNOutOfMP2SHAddress} from "../lib/bitcoin";
import { SeedCheckError } from "../lib/bitcoin/error";

const generateBitcoinSegwitAddress = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const {seed, account, change, index} = req.body;
        if (typeof seed !== "string" 
        || typeof account !== "number" 
        || typeof change !== "number"
        || typeof index !== "number") {
            throw new TypeError("seed, account, change, index is not valid type");
        }

        const _account = Number(account);
        const _change = Number(change); // 0: notChange (external), 1: isChange (internal)
        const _index = Number(index);
        if (Number.isNaN(_account) || Number.isNaN(_change) || Number.isNaN(_index)) {
            throw new Error("account or change or index is not valid");
        }
        const _isChange = (_change === 1) ? true : false;

        try {
            const address = await _generateBitcoinSegwitAddress(seed, _account, _isChange, _index);
            res.status(200).json({
                address
            });
        } catch (error) {
            if (error instanceof SeedCheckError) {
                res.status(400).json({
                    error: -2,
                    message: `Seed phrase is not expected format: ${error.message}`
                });
                return;
            } else {
                throw error;
            }
        }
    } catch (error) {
        next(error);
    }
};

const generateBitcoinP2SHAddress = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const {public_keys, n} = req.body;
        if (!Array.isArray(public_keys) 
        || typeof n !== "number") {
            throw new TypeError("public_keys or n is not valid type");
        }

        try {
            const address = generateNOutOfMP2SHAddress(public_keys, n);
            res.status(200).json({
                address
            });
        } catch (error) {
            if (error instanceof TypeError) {
                res.status(400).json({
                    error: -2,
                    message: `Some arguments is not expected: ${error.message}`
                });
                return;
            } else {
                res.status(400).json({
                    error: -2,
                    message: `Some arguments is not expected: unknown`
                });
                return;
            }
        }
    } catch (error) {
        next(error);
    }
};

export {
    generateBitcoinSegwitAddress,
    generateBitcoinP2SHAddress
};