import { pushToSheet } from "./pushToSheet.js";
import { sheetConfig } from "../config/sheetConfig.js";

export const withSheetSync = (modelName, createFn) => {
  return async (req, res) => {
    try {
      const doc = await createFn(req);

      const config = sheetConfig[modelName];
      if (config) {
        await pushToSheet({
          sheetName: config.sheetName,
          columns: config.columns,
          document: doc,
        });
      }

      res.status(201).json({ success: true, data: doc });
    } catch (err) {
      console.error("Sheet sync failed:", err);
      res.status(500).json({ error: err.message });
    }
  };
};
