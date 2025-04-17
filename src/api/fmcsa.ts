import express, { Router } from "express";
import axios from "axios";

const router: Router = express.Router();

router.get("/validate/:mc_number", async (req: any, res: any) => {
  const { mc_number } = req.params;
  const apiKey = process.env.FMCSA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "FMCSA API key not configured" });
  }

  try {
    const response = await axios.get(
      `https://mobile.fmcsa.dot.gov/qc/services/carriers/${mc_number}?webKey=${apiKey}`
    );

    // Check if the carrier data exists and is valid
    const carrierData = response.data.content;
    if (!carrierData || !carrierData.carrier) {
      return res.status(404).json({
        mc_number,
        valid: false,
        details: { message: "Carrier not found" },
      });
    }

    // Assume carrier is valid if allowed to operate and status is active
    const isValid =
      carrierData.carrier.allowedToOperate === "Y" &&
      carrierData.carrier.statusCode === "A";

    // Extract relevant details
    const details = {
      companyName: carrierData.carrier.legalName || "Unknown",
      status: carrierData.carrier.statusCode === "A" ? "Active" : "Inactive",
      operationClassification:
        carrierData.carrier.carrierOperation?.carrierOperationDesc || "Unknown",
    };

    res.status(200).json({
      mc_number,
      valid: isValid,
      details,
    });
  } catch (error: any) {
    // Handle specific error cases
    if (error.response) {
      if (error.response.status === 400) {
        return res.status(400).json({ error: "Invalid MC number format" });
      }
      if (error.response.status === 401) {
        return res.status(401).json({ error: "Invalid FMCSA API key" });
      }
    }
    // Generic error handling
    res.status(500).json({ error: "Error validating MC number" });
  }
});

export default router;
