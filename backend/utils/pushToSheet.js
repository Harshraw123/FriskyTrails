import { sheets } from '../services/googleService.js';

export async function pushToSheet({ sheetName, columns, document }) {
  try {
    // Convert Mongoose document to plain object if needed
    const doc = document.toObject ? document.toObject() : document;
    
    const values = columns.map((col) => {
      const val = doc[col];
      
      // Handle null/undefined
      if (val === null || val === undefined) {
        return "";
      }
      
      // Handle Date objects
      if (val instanceof Date) {
        return val.toISOString();
      }
      
      // Handle boolean values - convert to TRUE/FALSE for Google Sheets
      if (typeof val === 'boolean') {
        return val ? 'TRUE' : 'FALSE';
      }
      
      // Handle ObjectId and Mongoose ObjectIds
      if (val && typeof val === 'object' && val.toString) {
        // Check if it's an ObjectId (24 char hex string) or has _id property
        const strVal = val.toString();
        if (strVal.match(/^[0-9a-fA-F]{24}$/) || val._id) {
          return strVal;
        }
      }
      
      // Handle nested objects (convert to string)
      if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        return JSON.stringify(val);
      }
      
      // Return as-is for strings, numbers, arrays
      return val;
    });

    console.log(`📤 Syncing user to ${sheetName} sheet...`);

    // Use a more specific range based on the number of columns
    // Convert column number to letter (1->A, 2->B, ..., 26->Z, 27->AA, etc.)
    const columnCount = columns.length;
    let lastColumn = '';
    let num = columnCount;
    while (num > 0) {
      const remainder = (num - 1) % 26;
      lastColumn = String.fromCharCode(65 + remainder) + lastColumn;
      num = Math.floor((num - 1) / 26);
    }
    const range = `${sheetName}!A:${lastColumn || 'Z'}`;

    await sheets.spreadsheets.values.append({
      spreadsheetId: '1_g8vuLfJz2LtIuMsPD92Tsgx_ivlHTIovsvWQ1SkVjk',
      range: range,
      valueInputOption: "RAW",
      requestBody: {
        values: [values],
      },
    });
    
    console.log(`✅ Successfully synced user (${doc.email || doc._id}) to Google Sheet: ${sheetName}`);
  } catch (error) {
    console.error(`❌ Failed to sync to Google Sheet (${sheetName}):`, error.message);
    if (error.response) {
      console.error(`❌ Google API Error Details:`, {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
      
      // Provide helpful error message for common issues
      if (error.response.status === 400 && error.response.data?.error?.message?.includes('Unable to parse range')) {
        console.error(`💡 Tip: Make sure the sheet "${sheetName}" exists in your Google Spreadsheet.`);
      }
    }
    // Don't throw - allow the main operation to succeed even if sheet sync fails
    // This prevents sheet sync failures from breaking user registration
  }
}
