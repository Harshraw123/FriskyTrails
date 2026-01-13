
import { appendRow } from "./services/googleService.js";
import { SHEETS } from "./config/sheetConfig.js";

async function test() {
  try {
    console.log("🔄 Testing Google Sheets append...");
    await appendRow(SHEETS.USERS, [
      "test_user_123",
      "test@example.com",
      "testuser",
      "Test User",
      "",
      "LOCAL",
      true,
      false,
      new Date().toISOString(),
      new Date().toISOString(),
    ]);
    console.log("🎉 Dummy data pushed to Google Sheets successfully!");
  } catch (error) {
    console.error("❌ Failed to push dummy data:", error.message);
  }
}

test().catch(console.error);
