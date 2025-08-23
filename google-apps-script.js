/**
 * Google Apps Script for Portfolio Contact Form
 * 
 * Instructions:
 * 1. Create a new Google Apps Script project at script.google.com
 * 2. Replace the default code with this code
 * 3. Create a new Google Spreadsheet and copy its ID from the URL
 * 4. Replace YOUR_SPREADSHEET_ID below with your actual spreadsheet ID
 * 5. Deploy as a web app with execute permissions for "Anyone"
 * 6. Copy the web app URL and use it in your contact form
 */

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Replace with your actual Google Spreadsheet ID
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
    
    // Open the spreadsheet and get the active sheet
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // If this is the first entry, add headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Subject', 'Message', 'IP Address']);
    }
    
    // Get client IP address (if available)
    const clientIP = e.parameter.clientIP || 'Unknown';
    
    // Append the new contact form data
    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.subject || 'Portfolio Contact',
      data.message,
      clientIP
    ]);
    
    // Optional: Send email notification to yourself
    // Uncomment and modify the lines below if you want email notifications
    /*
    const emailSubject = `New Portfolio Contact from ${data.name}`;
    const emailBody = `
      New contact form submission:
      
      Name: ${data.name}
      Email: ${data.email}
      Subject: ${data.subject || 'Portfolio Contact'}
      Message: ${data.message}
      
      Timestamp: ${new Date()}
      IP Address: ${clientIP}
    `;
    
    // Replace with your email address
    MailApp.sendEmail('your-email@example.com', emailSubject, emailBody);
    */
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Form submitted successfully',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    console.error('Error processing form submission:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        message: 'Failed to process form submission'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function to verify the script works
 * Run this function in the Apps Script editor to test
 */
function testFormSubmission() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'This is a test message from the Google Apps Script.'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    },
    parameter: {
      clientIP: '127.0.0.1'
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}

/**
 * Setup function to create the spreadsheet if needed
 * Run this once to set up your contact form spreadsheet
 */
function setupSpreadsheet() {
  try {
    // Create a new spreadsheet
    const spreadsheet = SpreadsheetApp.create('Portfolio Contact Form Submissions');
    const sheet = spreadsheet.getActiveSheet();
    
    // Add headers
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Subject', 'Message', 'IP Address']);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, 6);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285F4');
    headerRange.setFontColor('white');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 6);
    
    console.log('Spreadsheet created successfully!');
    console.log('Spreadsheet ID:', spreadsheet.getId());
    console.log('Spreadsheet URL:', spreadsheet.getUrl());
    
    // Return the spreadsheet ID
    return spreadsheet.getId();
    
  } catch (error) {
    console.error('Error creating spreadsheet:', error);
    return null;
  }
}
