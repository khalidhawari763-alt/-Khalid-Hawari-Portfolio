import { Router, type IRouter } from "express";
import { db, contactMessagesTable } from "@workspace/db";
import {
  CreateContactMessageBody,
  CreateContactMessageResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact-messages", async (req, res): Promise<void> => {
  const parsed = CreateContactMessageBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.flatten() }, "Invalid contact message");
    res.status(400).json({ error: "Please provide a valid name, email, and message." });
    return;
  }

  const [contactMessage] = await db
    .insert(contactMessagesTable)
    .values(parsed.data)
    .returning({
      id: contactMessagesTable.id,
      createdAt: contactMessagesTable.createdAt,
    });

  res.status(201).json(CreateContactMessageResponse.parse(contactMessage));
});

export default router;