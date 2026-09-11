import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactMessagesRouter from "./contact-messages";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactMessagesRouter);

export default router;
