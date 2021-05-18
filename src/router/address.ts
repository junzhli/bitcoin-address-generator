import express from "express";
import { generateBitcoinSegwitAddress } from "../controller/address";
import inputValidator from "../middleware/inputValidator";

export default () => {
    const router = express.Router();

    router.use(express.json());

    /** Address API */

    router.post("/bitcoin/generateSegwitAddress", inputValidator.generateBitcoinSegwitAddress, inputValidator.resultHandler, generateBitcoinSegwitAddress);

    return router;
};