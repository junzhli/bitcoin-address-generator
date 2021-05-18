import express from "express";
import { generateBitcoinP2SHAddress, generateBitcoinSegwitAddress } from "../controller/address";
import inputValidator from "../middleware/inputValidator";

export default () => {
    const router = express.Router();

    router.use(express.json());

    /** Address API */

    router.post("/bitcoin/generateSegwitAddress", inputValidator.generateBitcoinSegwitAddress, inputValidator.resultHandler, generateBitcoinSegwitAddress);

    router.post("/bitcoin/generateP2SHAddress", inputValidator.generateBitcoinP2SHAddress, inputValidator.resultHandler, generateBitcoinP2SHAddress);

    return router;
};