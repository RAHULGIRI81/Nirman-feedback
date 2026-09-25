const FOLDER_ID = "1ak0d756nsZ29W74UUS1O7o4g-R2EACDs";
const SPREADSHEET_NAME = "Amrita Nirman Feedback";
const SHEET_NAME = "Feedback";

const HEADERS = [
  "Submitted At",
  "Name",
  "Gmail / Email",
  "Relevance",
  "Relevance Value",
  "Content Quality",
  "Content Quality Value",
  "Lesson Structure",
  "Lesson Structure Value",
  "Customization",
  "Customization Value",
  "Teaching Support",
  "Teaching Support Value",
  "Time Saving",
  "Time Saving Value",
  "AI Output Confidence",
  "AI Output Confidence Value",
  "Teacher Control",
  "Teacher Control Value",
  "Adoption",
  "Adoption Value",
  "Overall Experience",
  "Overall Experience Value",
];

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({
      ok: true,
      message: "Feedback Apps Script Web App is active and ready.",
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(event) {
  try {
    let payload = {};
    if (event && event.postData && event.postData.contents) {
      payload = JSON.parse(event.postData.contents);
    } else if (event && event.parameter) {
      payload = event.parameter;
    }

    const sheet = getFeedbackSheet();
    sheet.appendRow(buildRow(payload));

    return jsonResponse({
      ok: true,
      message: "Feedback recorded successfully",
      spreadsheetUrl: sheet.getParent().getUrl(),
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error.toString(),
    });
  }
}

function getFeedbackSheet() {
  let targetFolder = null;
  if (FOLDER_ID && FOLDER_ID.trim() !== "") {
    try {
      targetFolder = DriveApp.getFolderById(FOLDER_ID.trim());
    } catch (e) {
      Logger.log("Folder not found or inaccessible: " + e.toString());
      targetFolder = null;
    }
  }

  let spreadsheet = null;
  if (targetFolder) {
    const files = targetFolder.getFilesByName(SPREADSHEET_NAME);
    if (files.hasNext()) {
      spreadsheet = SpreadsheetApp.open(files.next());
    } else {
      spreadsheet = SpreadsheetApp.create(SPREADSHEET_NAME);
      const file = DriveApp.getFileById(spreadsheet.getId());
      file.moveTo(targetFolder);
    }
  } else {
    const files = DriveApp.getFilesByName(SPREADSHEET_NAME);
    spreadsheet = files.hasNext()
      ? SpreadsheetApp.open(files.next())
      : SpreadsheetApp.create(SPREADSHEET_NAME);
  }

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function buildRow(payload) {
  const answersByArea = {};
  (payload.answers || []).forEach((answer) => {
    answersByArea[answer.area] = answer;
  });

  return [
    payload.completedAt || new Date().toISOString(),
    payload.name || payload.userName || "",
    payload.email || payload.userEmail || "",
    answersByArea.Relevance?.answer || "",
    answersByArea.Relevance?.value || "",
    answersByArea["Content Quality"]?.answer || "",
    answersByArea["Content Quality"]?.value || "",
    answersByArea["Lesson Structure"]?.answer || "",
    answersByArea["Lesson Structure"]?.value || "",
    answersByArea.Customization?.answer || "",
    answersByArea.Customization?.value || "",
    answersByArea["Teaching Support"]?.answer || "",
    answersByArea["Teaching Support"]?.value || "",
    answersByArea["Time Saving"]?.answer || "",
    answersByArea["Time Saving"]?.value || "",
    answersByArea["AI Output Confidence"]?.answer || "",
    answersByArea["AI Output Confidence"]?.value || "",
    answersByArea["Teacher Control"]?.answer || "",
    answersByArea["Teacher Control"]?.value || "",
    answersByArea.Adoption?.answer || "",
    answersByArea.Adoption?.value || "",
    answersByArea["Overall Experience"]?.answer || "",
    answersByArea["Overall Experience"]?.value || "",
  ];
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Run this function directly inside the Apps Script editor to authorize
 * permissions (DriveApp & SpreadsheetApp) and create the spreadsheet immediately!
 */
function testSave() {
  const samplePayload = {
    completedAt: new Date().toISOString(),
    name: "Test User",
    email: "test@gmail.com",
    answers: [
      { area: "Relevance", answer: "Extremely relevant", value: 5 },
      { area: "Content Quality", answer: "High quality", value: 5 },
      { area: "Overall Experience", answer: "Excellent", value: 5 }
    ]
  };
  const sheet = getFeedbackSheet();
  sheet.appendRow(buildRow(samplePayload));
  Logger.log("Successfully wrote test row! Spreadsheet URL: " + sheet.getParent().getUrl());
}

