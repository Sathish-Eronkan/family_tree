import express from "express";
const router = express.Router();
import { setValues, getResult, clearData } from "../controllers/Controller.js";
router.route('/command').post(setValues);
router.route('/result').get(getResult);
router.route('/reset').get(clearData);
export default router;