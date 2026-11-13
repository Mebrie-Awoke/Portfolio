/**
 * Gmail HTTPS gateway for the Portfolio FastAPI backend.
 *
 * Setup:
 * 1. Create a Google Apps Script project while signed in to the Gmail account
 *    that should send portfolio emails.
 * 2. Paste this file into Code.gs and save.
 * 3. In Project Settings > Script Properties, add EMAIL_API_SECRET with a
 *    long random value. Use the same value in Render's EMAIL_API_SECRET.
 * 4. Deploy > New deployment > Web app:
 *      Execute as: Me
 *      Who has access: Anyone
 * 5. Copy the deployed /exec URL into Render's EMAIL_API_URL.
 *
 * Do not put the secret in this source file or commit it to GitHub.
 */

function doPost(e) {
  try {
    var payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var expectedSecret = PropertiesService.getScriptProperties().getProperty("EMAIL_API_SECRET") || "";

    if (!expectedSecret || !constantTimeEquals(String(payload.secret || ""), expectedSecret)) {
      return jsonResponse({ success: false, error: "Unauthorized" });
    }

    var recipient = String(payload.to || "").trim();
    var subject = String(payload.subject || "").trim();
    var body = String(payload.body || "");
    var replyTo = String(payload.replyTo || "").trim();

    if (!recipient || !subject || !body) {
      return jsonResponse({ success: false, error: "Missing email fields" });
    }
    if (recipient.length > 254 || subject.length > 200 || body.length > 12000) {
      return jsonResponse({ success: false, error: "Email content is too long" });
    }

    var options = { name: "Mebrie Awoke" };
    if (replyTo) options.replyTo = replyTo;

    GmailApp.sendEmail(recipient, subject, body, options);
    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Portfolio email gateway error: " + error);
    return jsonResponse({ success: false, error: "Email delivery failed" });
  }
}

function constantTimeEquals(a, b) {
  if (a.length !== b.length) return false;
  var difference = 0;
  for (var i = 0; i < a.length; i++) {
    difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return difference === 0;
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
