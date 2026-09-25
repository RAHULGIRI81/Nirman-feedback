# Google Drive Feedback Storage Setup

This app automatically saves feedback into a Google Sheet stored directly inside your target Google Drive folder:
**Target Folder:** [https://drive.google.com/drive/folders/1ak0d756nsZ29W74UUS1O7o4g-R2EACDs](https://drive.google.com/drive/folders/1ak0d756nsZ29W74UUS1O7o4g-R2EACDs)

---

## 1. Create the Google Apps Script

1. Open [script.google.com](https://script.google.com/).
2. Click **New project** (top-left).
3. Delete any default code in the editor and paste the full contents from [`google-apps-script/Code.gs`](file:///c:/Users/rahul_ct0tnzb/Downloads/feedback/feedback/google-apps-script/Code.gs).
4. Click the 💾 **Save** icon (or Ctrl+S).

---

## 2. Deploy as a Web App

1. Click the blue **Deploy** button (top-right) > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set the fields:
   - **Description**: `Feedback Collector`
   - **Execute as**: `Me (your_email@gmail.com)`
   - **Who has access**: `Anyone` *(Important: Must be 'Anyone' so the app can submit responses)*
4. Click **Deploy**.
5. Grant permissions if prompted (click *Advanced* > *Go to (project name) (unsafe)* > *Allow*).
6. Copy the generated **Web app URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`).

---

## 3. Connect to your Local App

Open [`config.js`](file:///c:/Users/rahul_ct0tnzb/Downloads/feedback/feedback/config.js) and paste your Web app URL:

```javascript
window.FEEDBACK_CONFIG = {
  googleScriptUrl: "https://script.google.com/macros/s/PASTE_YOUR_DEPLOYMENT_URL_HERE/exec",
};
```

---

## 4. Test

1. Open [http://localhost:8080](http://localhost:8080).
2. Complete the quest and click **☁️ Save to Drive**.
3. Open your [Google Drive Folder](https://drive.google.com/drive/folders/1ak0d756nsZ29W74UUS1O7o4g-R2EACDs) — your **"Lesson Plan Assistant Feedback"** spreadsheet will be automatically created and populated with each submitted response!
