# Google Sheets Webhook for Applications

This document describes the Google Apps Script that receives volunteer and
partner applications from `/api/submit-application` and appends them to a
Google Sheet.

The Next.js route validates and forwards a JSON payload. The Apps Script's
job is narrow: append one row per submission, in a stable column order,
without losing data under concurrent writes.

## Payload contract

The route sends a single flat JSON object. Field set depends on `type`.

**Always present:**

| Key           | Type   | Notes                                          |
| ------------- | ------ | ---------------------------------------------- |
| `type`        | string | `"volunteer"` or `"partner"`                   |
| `fullName`    | string | Required, trimmed, max 4000 chars              |
| `email`       | string | Required, validated against email regex        |
| `phone`       | string | Required                                       |
| `location`    | string | Required, free text (e.g. `"Bukavu, DRC"`)     |
| `motivation`  | string | Required, free text                            |
| `submittedAt` | string | ISO 8601 timestamp added server-side           |

**Volunteer-only (`type === "volunteer"`):**

| Key             | Type   | Notes                                       |
| --------------- | ------ | ------------------------------------------- |
| `availability`  | string | Required, free text                         |
| `skills`        | string | Required, free text                         |
| `preferredRole` | string | Required, one of `Mentor`, `Tutor`, `Workshop facilitator`, `Other` |

**Partner-only (`type === "partner"`):**

| Key                   | Type   | Notes                                  |
| --------------------- | ------ | -------------------------------------- |
| `orgName`             | string | Required                               |
| `partnershipType`     | string | Required, one of `School`, `Community leader`, `Corporate`, `Small business`, `Other` |
| `contributionDetails` | string | Required                               |
| `website`             | string | Optional, may be empty                 |

## Sheet schema

Use a single sheet named `Applications` with **14 columns** in this order.
Both application types share the schema; cells for the "other type's"
fields stay empty.

| #  | Column header           | Source field                  | Filled for |
| -- | ----------------------- | ----------------------------- | ---------- |
| 1  | `Submitted At`          | `submittedAt`                 | both       |
| 2  | `Type`                  | `type`                        | both       |
| 3  | `Full Name`             | `fullName`                    | both       |
| 4  | `Email`                 | `email`                       | both       |
| 5  | `Phone`                 | `phone`                       | both       |
| 6  | `Location`              | `location`                    | both       |
| 7  | `Motivation`            | `motivation`                  | both       |
| 8  | `Availability`          | `availability`                | volunteer  |
| 9  | `Skills`                | `skills`                      | volunteer  |
| 10 | `Preferred Role`        | `preferredRole`               | volunteer  |
| 11 | `Organization Name`     | `orgName`                     | partner    |
| 12 | `Partnership Type`      | `partnershipType`             | partner    |
| 13 | `Contribution Details`  | `contributionDetails`         | partner    |
| 14 | `Website`               | `website`                     | partner    |

The script auto-creates the `Applications` sheet and writes the header row
on first run, so you do not need to set this up manually.

## Why the original snippets do not fit

The `doPost` example you pasted has four mismatches with what the route
actually sends:

1. It reads `data.name` — the route sends `fullName`, never `name`. Same
   issue with the `MailApp.sendEmail` snippet you shared, it also uses
   `data.name`.
2. It reads `data.extra` — the route sends type-specific fields **flat**
   on the payload, not nested under `extra`.
3. It calls `getActiveSheet()` — fragile, the row lands wherever the user
   last clicked. Selecting a sheet by name is reproducible.
4. It has no `LockService`, so two concurrent submissions can corrupt the
   row index when both try to append at the same time.

The `MailApp.sendEmail` snippet has additional problems beyond the
`data.name` typo:

- The body shows only name + email, dropping the motivation, role,
  organization, and contribution details — the parts a reviewer actually
  needs to make a decision.
- A failure inside `sendEmail` (quota, transient error) would propagate
  and fail the whole submission, even though the row already landed in
  the sheet. Notifications are best-effort and must not break the append.
- No `replyTo`, so hitting "Reply" in Gmail goes to the script owner, not
  the applicant.

## The corrected script

Paste this into the Apps Script editor of the spreadsheet (Extensions ->
Apps Script), save, then **Deploy -> New deployment -> Web app**:

- Description: `Umoja applications webhook`
- Execute as: `Me`
- Who has access: `Anyone`

Copy the resulting `/exec` URL into `GOOGLE_SHEETS_WEBHOOK_URL` in
`.env.local` (and the Vercel project env vars). The plain spreadsheet
share URL will not work, only the `/exec` URL from a Web App deployment.

```javascript
const SHEET_NAME = "Applications";

// Where new-application notifications go. Override at runtime by setting a
// `NOTIFY_EMAIL` Script Property (Project Settings -> Script properties).
const DEFAULT_NOTIFY_EMAIL = "tb@umoja.tbafrica.org";

// Optional: pin the destination spreadsheet by ID so the script always
// writes to the same place even if it's run standalone or copied. Set the
// `SPREADSHEET_ID` Script Property (Project Settings -> Script properties)
// to the ID portion of the spreadsheet URL — the long string between
// `/d/` and `/edit` in https://docs.google.com/spreadsheets/d/<ID>/edit.
// Leave the property unset to fall back to getActiveSpreadsheet() (only
// works when the script is container-bound).

const HEADERS = [
  "Submitted At",
  "Type",
  "Full Name",
  "Email",
  "Phone",
  "Location",
  "Motivation",
  "Availability",
  "Skills",
  "Preferred Role",
  "Organization Name",
  "Partnership Type",
  "Contribution Details",
  "Website",
];

function getSpreadsheet() {
  const pinnedId = PropertiesService.getScriptProperties().getProperty(
    "SPREADSHEET_ID",
  );
  if (pinnedId) {
    return SpreadsheetApp.openById(pinnedId);
  }
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) {
    throw new Error(
      "No SPREADSHEET_ID Script Property is set and the script is not " +
        "container-bound. Set SPREADSHEET_ID in Project Settings.",
    );
  }
  return active;
}

function getOrCreateSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function pick(data, key) {
  const value = data[key];
  if (value === undefined || value === null) return "";
  return String(value);
}

// Sheets parses any cell whose value starts with =, +, -, or @ as a formula.
// Phone numbers like "+243 999 ..." then surface as #ERROR! Formula parse error.
// A leading apostrophe forces the cell to text mode and is hidden in display.
function safeText(value) {
  const s = value == null ? "" : String(value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function buildRow(data) {
  const submittedAt = pick(data, "submittedAt") || new Date().toISOString();
  return [
    submittedAt,
    safeText(pick(data, "type")),
    safeText(pick(data, "fullName")),
    safeText(pick(data, "email")),
    safeText(pick(data, "phone")),
    safeText(pick(data, "location")),
    safeText(pick(data, "motivation")),
    safeText(pick(data, "availability")),
    safeText(pick(data, "skills")),
    safeText(pick(data, "preferredRole")),
    safeText(pick(data, "orgName")),
    safeText(pick(data, "partnershipType")),
    safeText(pick(data, "contributionDetails")),
    safeText(pick(data, "website")),
  ];
}

function getNotifyEmail() {
  const prop = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL");
  return prop || DEFAULT_NOTIFY_EMAIL;
}

function buildNotificationBody(data) {
  const isVolunteer = data.type === "volunteer";
  const lines = [
    "A new application just landed in the Applications sheet.",
    "",
    "Type: " + pick(data, "type"),
    "Name: " + pick(data, "fullName"),
    "Email: " + pick(data, "email"),
    "Phone: " + pick(data, "phone"),
    "Location: " + pick(data, "location"),
    "",
    "Motivation:",
    pick(data, "motivation") || "(none)",
    "",
  ];

  if (isVolunteer) {
    lines.push(
      "Availability: " + pick(data, "availability"),
      "Skills: " + pick(data, "skills"),
      "Preferred role: " + pick(data, "preferredRole"),
    );
  } else {
    lines.push(
      "Organization: " + pick(data, "orgName"),
      "Partnership type: " + pick(data, "partnershipType"),
      "Website: " + (pick(data, "website") || "(none)"),
      "",
      "Contribution details:",
      pick(data, "contributionDetails") || "(none)",
    );
  }

  lines.push(
    "",
    "Submitted at: " + (pick(data, "submittedAt") || new Date().toISOString()),
  );
  return lines.join("\n");
}

function sendNotification(data) {
  try {
    const isVolunteer = data.type === "volunteer";
    const who = isVolunteer
      ? pick(data, "fullName")
      : (pick(data, "orgName") || pick(data, "fullName"));
    const subject = isVolunteer
      ? "New volunteer application, " + who
      : "New partnership inquiry, " + who;

    const options = { name: "Umoja Applications" };
    const replyTo = pick(data, "email");
    if (replyTo) options.replyTo = replyTo;

    MailApp.sendEmail(
      getNotifyEmail(),
      subject,
      buildNotificationBody(data),
      options,
    );
  } catch (err) {
    // Notification is best-effort, never fail the submission because of it.
    console.error("Email notification failed:", err);
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return jsonResponse({ success: false, error: "Could not acquire lock." });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: "Empty request body." });
    }

    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return jsonResponse({ success: false, error: "Invalid JSON." });
    }

    if (data.type !== "volunteer" && data.type !== "partner") {
      return jsonResponse({ success: false, error: "Invalid type." });
    }

    const sheet = getOrCreateSheet();
    sheet.appendRow(buildRow(data));

    sendNotification(data);

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ success: false, error: String(error && error.message || error) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: "umoja-applications-webhook" });
}

/**
 * Run this once from the editor (top toolbar -> select `testEmail` ->
 * Run) to:
 *   1. Trigger the OAuth consent screen for MailApp the first time
 *      MailApp is added to the script.
 *   2. Verify the configured recipient actually receives mail.
 *
 * After running, check the Executions log AND the recipient inbox.
 * Running `doPost` manually does NOT trigger the MailApp scope, because
 * with no event payload the function returns early at the empty-body
 * guard before ever reaching MailApp.
 */
function testEmail() {
  const recipient = getNotifyEmail();
  const remaining = MailApp.getRemainingDailyQuota();
  MailApp.sendEmail(
    recipient,
    "Umoja webhook, MailApp test",
    [
      "If you can read this, MailApp is authorized and the recipient is correct.",
      "",
      "Recipient: " + recipient,
      "Remaining daily quota: " + remaining,
    ].join("\n"),
  );
  console.log("Test email sent to " + recipient + " (quota left: " + remaining + ")");
}
```

## Email notifications

After every successful append, the script sends a plain-text notification
to the address returned by `getNotifyEmail()`. The body includes every
field a reviewer needs to triage the application — motivation, role or
partnership type, availability or contribution details — not just the
applicant's name and email. The applicant's email is set as `replyTo`,
so hitting "Reply" in Gmail goes to them.

**Recipient resolution order:**

1. The `NOTIFY_EMAIL` Script Property if set (Project Settings ->
   Script properties -> Add script property). Useful for staging vs prod
   without code changes.
2. Otherwise the `DEFAULT_NOTIFY_EMAIL` constant at the top of the
   script (`tb@umoja.tbafrica.org`).

**Failure behavior:** the call is wrapped in `try/catch` and logs to the
Apps Script execution log on failure. A mail-quota error or transient
SMTP issue must not fail the submission, the row already landed in the
sheet and the API route would otherwise see a 5xx and tell the applicant
to retry, creating a duplicate.

**Quota:** consumer Google accounts allow ~100 `MailApp` emails per day,
Workspace accounts ~1500. Plenty for application volume, but if you ever
fan out to multiple recipients consider a single email with several
addresses in `to` rather than one `sendEmail` call per recipient.

## Re-deploying after edits

Apps Script does **not** auto-publish changes. After editing, click
**Deploy -> Manage deployments -> pencil icon -> Version: New version ->
Deploy**, otherwise the live `/exec` URL keeps serving the old code.

## Quick local test

Once `GOOGLE_SHEETS_WEBHOOK_URL` is set in `.env.local` and the dev server
is restarted:

```bash
curl -X POST http://localhost:3000/api/submit-application \
  -H "Content-Type: application/json" \
  -d '{
    "type": "volunteer",
    "fullName": "Test Mentor",
    "email": "test@example.com",
    "phone": "+243 999 000 000",
    "location": "Bukavu, DRC",
    "motivation": "Want to help.",
    "availability": "Saturdays",
    "skills": "Mathematics",
    "preferredRole": "Mentor"
  }'
```

A new row should appear in the `Applications` sheet within a second. If
the response is `{ ok: false, ... }` from our route, the message will tell
you whether validation failed locally or the upstream webhook returned
non-2xx.

## Latency expectations

A cold Apps Script Web App can take **5-10 seconds** on the first
request, because Google has to:

1. Resolve `script.google.com` and TLS-handshake.
2. Internally redirect the request to `script.googleusercontent.com`.
3. Spin up a fresh container for your script (the actual cold start).
4. Run the body — `appendRow`, `setNumberFormat`, `MailApp.sendEmail`.
5. Return the response.

Subsequent requests within a few minutes typically complete in 1-2s
because Google reuses the warm container. The Next.js route waits up to
**10 seconds** per attempt, which covers all the cold-start cases we've
seen in practice. If you ever need to extend it, the constant lives in
[`src/app/api/submit-application/route.ts`](../src/app/api/submit-application/route.ts)
as `FETCH_TIMEOUT_MS`.

The route will only retry on **connection-layer** failures (DNS,
refused, reset). It will *not* retry on response timeout, because a
timeout means the script is still running on Google's side and a
second request just hits a fresh cold-start container.

If your first submission after a deploy times out, hit submit again —
the second attempt finds the container warm and almost always
succeeds.

## Confirming where data is landing

If a submission returns 200 but you don't see the row, the script wrote
it somewhere unexpected. Add this temporary diagnostic function to the
script and run it from the editor:

```javascript
function whereAmIWriting() {
  const ss = getSpreadsheet();
  console.log("Spreadsheet name:", ss.getName());
  console.log("Spreadsheet URL:", ss.getUrl());
  console.log("Spreadsheet ID:", ss.getId());
  const tabs = ss.getSheets().map((s) => s.getName());
  console.log("Tabs:", tabs.join(", "));
  const target = ss.getSheetByName(SHEET_NAME);
  console.log(
    SHEET_NAME + " tab exists:",
    !!target,
    target ? "rows=" + target.getLastRow() : "",
  );
}
```

Select `whereAmIWriting` from the function dropdown -> Run -> open the
**Executions** panel (left sidebar). The log shows exactly which
spreadsheet the script is writing to and how many rows have landed in
the `Applications` tab. If the spreadsheet URL surprises you, set the
`SPREADSHEET_ID` Script Property to your intended target.

## Troubleshooting

### `#ERROR! Formula parse error` in the Phone column

Cause: Sheets parses any cell whose value starts with `=`, `+`, `-`, or
`@` as a formula. Phone numbers like `+243 999 000 000` start with `+`,
so `=+243 999 000 000` becomes a malformed formula.

Fix in this script: `safeText()` prepends a single apostrophe to any
value that starts with one of those characters before the row is
appended. Apps Script preserves the apostrophe as the standard "format
as text" indicator and hides it in the cell display, so the phone reads
back as a normal string.

This fix only applies to **new** rows. Rows already showing `#ERROR!`
will not auto-repair, you have to fix them manually:

- Click the offending cell, prepend a `'` (apostrophe) to the value, hit
  enter. The apostrophe disappears and the phone displays as text.
- Or just delete those test rows.

### I redeployed but I'm not receiving notification emails

Run through this checklist in order, the first three catch ~95% of cases:

1. **You deployed a new version, not just saved the file.** Apps Script
   keeps serving the previously deployed version until you bump it.
   Click **Deploy -> Manage deployments -> pencil icon -> Version: New
   version -> Deploy**. If the dropdown still shows the old version
   number after this, you missed the dropdown change.
2. **Authorize the new `MailApp` scope.** When `MailApp` was first added
   to the script, Apps Script needs you to re-grant permissions. Do
   **not** try to trigger this by running `doPost` from the editor — it
   returns early at the empty-body guard before reaching any `MailApp`
   call, so no consent prompt appears and no email is sent. Instead,
   select `testEmail` from the function dropdown in the top toolbar and
   click **Run**. The OAuth consent screen will appear on first run; a
   real test email lands in the configured recipient inbox on success.
   Without this step, the live `/exec` deployment has no `MailApp`
   authorization and `sendNotification` throws into the catch block on
   every submission.
3. **Check the Executions panel** in the Apps Script editor (left
   sidebar -> Executions). Each `doPost` call appears with a log. If
   `Email notification failed:` is in the log, the error message tells
   you exactly why — usually `MailApp` quota exhausted or unauthorized.
4. **Spam folder.** A brand new sender domain is often filtered the
   first time. Mark one as "Not spam" so the next ones land in the
   inbox.
5. **Recipient address is correct.** If you set the `NOTIFY_EMAIL`
   Script Property, it overrides `DEFAULT_NOTIFY_EMAIL`. Check Project
   Settings -> Script properties.
6. **Quota.** Consumer Google accounts have ~100 `MailApp` emails/day,
   Workspace ~1500. Check `MailApp.getRemainingDailyQuota()` from the
   editor if you suspect this.
