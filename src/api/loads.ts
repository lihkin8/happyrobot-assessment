import express, { Request, Response, Router } from "express";
import { db } from "../db";

const router: Router = express.Router();

router.get("/:reference_number", (req: Request, res: Response) => {
  let { reference_number } = req.params;

  // Add REF prefix if not present
  if (!reference_number.startsWith("REF")) {
    reference_number = `REF${reference_number}`;
  }

  // DB is already initialized at server startup, so we can query directly
  db.get(
    "SELECT * FROM loads WHERE reference_number = ?",
    [reference_number],
    (err: Error | null, row: any) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Error retrieving load data" });
      }
      if (!row) {
        return res.status(404).json({ error: "Load not found" });
      }
      return res.status(200).json({
        reference_number: row.reference_number,
        load: {
          origin: row.origin,
          destination: row.destination,
          equipment_type: row.equipment_type,
          rate: row.rate,
          commodity: row.commodity,
        },
      });
    }
  );
});

export default router;
