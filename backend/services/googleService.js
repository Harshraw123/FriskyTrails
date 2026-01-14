import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to find credentials.json in backend directory
const credentialsPath = path.join(__dirname, "..", "credentials.json");

// Check if credentials file exists
if (!fs.existsSync(credentialsPath)) {
  console.error(`\n❌ ============================================`);
  console.error(`❌ Google Sheets credentials NOT FOUND!`);
  console.error(`❌ Expected location: ${credentialsPath}`);
  console.error(`❌ ============================================`);

} else {
  console.log(`✅ Google Sheets credentials found at: ${credentialsPath}`);
}

let auth;
let sheets;

try {
  auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheets = google.sheets({ version: "v4", auth });
  console.log(`✅ Google Sheets API initialized successfully`);
} catch (error) {
  console.error(`❌ Failed to initialize Google Sheets API:`, error.message);
  // Create a dummy sheets object to prevent crashes
  sheets = {
    spreadsheets: {
      values: {
        append: async () => {
          console.error(`❌ Cannot sync to Google Sheets - credentials not configured`);
          throw new Error("Google Sheets credentials not configured");
        }
      }
    }
  };
}

export { sheets };

