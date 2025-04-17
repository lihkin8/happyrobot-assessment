import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import sqlite3 from "sqlite3";

// In-memory SQLite DB
export const db = new sqlite3.Database(":memory:");

// Initialize database by loading CSV, creating table and index
export const initDB = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      // Create the loads table
      db.run(
        `CREATE TABLE loads (
          reference_number TEXT PRIMARY KEY,
          origin TEXT,
          destination TEXT,
          equipment_type TEXT,
          rate INTEGER,
          commodity TEXT
        )`,
        (err: Error | null) => {
          if (err) return reject(err);
        }
      );

      // Prepare statement for bulk inserts
      const stmt = db.prepare(
        "INSERT INTO loads (reference_number, origin, destination, equipment_type, rate, commodity) VALUES (?, ?, ?, ?, ?, ?)"
      );

      // Read and parse the CSV file
      fs.createReadStream(path.join(__dirname, "../data/loads.csv"))
        .pipe(parse({ columns: true, trim: true }))
        .on("data", (row: any) => {
          stmt.run(
            row.reference_number,
            row.origin,
            row.destination,
            row.equipment_type,
            parseInt(row.rate, 10),
            row.commodity
          );
        })
        .on("end", () => {
          stmt.finalize((err: Error | null) => {
            if (err) return reject(err);
            
            // Create an index on reference_number for faster lookups
            db.run(
              "CREATE INDEX idx_reference ON loads(reference_number)",
              (err2: Error | null) => {
                if (err2) return reject(err2);
                console.log("Database initialized successfully!");
                resolve();
              }
            );
          });
        })
        .on("error", (err: Error) => {
          console.error("CSV parsing error:", err);
          reject(err);
        });
    });
  });
};