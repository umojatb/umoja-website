# Contact form, server-side email

The contact form posts to `/api/contact`, which validates, rate-limits,
and sends an email via [Resend](https://resend.com). There is no
`mailto:` redirect anywhere in the submission flow — applicants do not
need a configured mail client.

## What lives where

| Concern              | File                                                                           |
| -------------------- | ------------------------------------------------------------------------------ |
| API endpoint         | `src/app/api/contact/route.ts`                                                 |
| Form component       | `src/app/contact/contact-form.tsx`                                             |
| Validation library   | `src/lib/validation.ts` (shared with the apply form)                           |
| Rate limit           | `src/lib/rate-limit.ts`                                                        |
| Sender / recipient   | `src/lib/site-config.ts` (defaults), `.env.local` (overrides)                  |
| Tests                | `tests/api/contact.test.ts`, `tests/components/contact-form.test.tsx`          |

## Why Resend (and not SendGrid / Mailgun / SMTP)

For a small NGO sending a few contact-form messages a day:

- **Free tier covers all real volume.** 3,000 emails/month, 100/day —
  Umoja's expected volume is comfortably under both.
- **Setup is one API key**, no SMTP credentials, no domain verification
  required for development.
- **One small dependency** (~30 KB). Nodemailer + SMTP is more code,
  more failure modes, and Gmail SMTP rate-limits at 500/day with weird
  app-password requirements.
- **Reliable delivery** with proper SPF/DKIM once you verify your
  domain.

Switching providers later is a one-file change; the route's send call
is the only place that knows about Resend specifically.

## Setup

### 1. Create a Resend account

1. Sign up at [resend.com](https://resend.com).
2. **API Keys** -> **Create API Key** -> name it `Umoja contact form`.
3. Copy the key (starts with `re_`).

### 2. Configure environment variables

In `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

Optional, but recommended for production:

```env
# Branded sender. Required to use anything other than Resend's default.
CONTACT_FROM_EMAIL=Umoja Africa <no-reply@umoja-africa.org>

# Override the recipient if you want non-default behavior. Defaults to
# info@umoja.tbafrica.org.
NEXT_PUBLIC_CONTACT_EMAIL=info@umoja.tbafrica.org
```

If you don't set `CONTACT_FROM_EMAIL`, the route uses Resend's
`onboarding@resend.dev` shared sender, which works without domain
verification but lands in spam more often.

### 3. (Production) Verify your domain in Resend

1. Resend dashboard -> **Domains** -> **Add domain** -> enter
   `umoja-africa.org` (or whatever your apex is).
2. Resend gives you four DNS records to add (SPF, DKIM, DMARC,
   return-path). Add them at your DNS provider.
3. Wait 5-30 minutes, then hit **Verify** in the Resend dashboard.
4. Set `CONTACT_FROM_EMAIL` in your Vercel project env vars to a
   sender on the verified domain, e.g.
   `Umoja Africa <no-reply@umoja-africa.org>`.

Until verified, **production sends will be rejected by Resend** if you
try to use a non-`@resend.dev` sender. Domain verification is the only
work that can't be skipped for production.

### 4. Local development without Resend

If `RESEND_API_KEY` is not set, the route logs a redacted summary to
the dev console and returns 200, so the form UI is testable without
needing a Resend account during initial development. The same code
path returns 503 in production, so missing env in production fails
loudly.

## How submissions work

```
[Browser]                          [/api/contact]                    [Resend]
   |   POST { name, email,            |                                |
   |          reason, message,        |                                |
   |          company: "" }           |                                |
   |--------------------------------->|                                |
   |                                  | 1. Parse JSON                  |
   |                                  | 2. If company != "" -> 200 fake|
   |                                  | 3. Rate-limit by IP            |
   |                                  | 4. Validate fields             |
   |                                  | 5. Build text + HTML body      |
   |                                  | 6. resend.emails.send(...)     |
   |                                  |------------------------------->|
   |                                  |                                |
   |                                  |<-------------------------------|
   |   200 { ok: true }               |                                |
   |<---------------------------------|                                |
```

## Anti-spam: honeypot + rate limit

**Honeypot.** The form renders a hidden input named `company`,
absolutely-positioned off-screen with `tabIndex={-1}` and
`aria-hidden="true"` so real users (keyboard, screen reader, mouse)
never land on it. Bots that auto-fill every input fill it. The route
treats a non-empty value as a bot signal and silently 200s without
sending — so the bot doesn't know it failed and won't retry on a
different attack vector.

**Rate limit.** Per-IP, 5 submissions per 10 minutes, in-memory.
Returns 429 + `Retry-After` header on overflow. Caveats:

- In-memory only — resets when the function instance recycles, and
  doesn't share state across Vercel function instances. For Umoja's
  scale this is fine. If you ever face distributed abuse, swap to
  Vercel KV or Upstash.
- Keys on `x-forwarded-for` (first entry) -> `x-real-ip` -> `unknown`.
  An attacker with a botnet / lots of IPs can bypass this. Honeypot
  catches naive scripts; KV-backed rate limiting catches the rest.

## Validation

Server-side validation reuses `src/lib/validation.ts` (the same module
the apply form uses). Client-side runs the same validators on blur and
submit, so the user gets inline errors without hitting the API. The
server response shape on validation failure is:

```json
{
  "ok": false,
  "message": "Enter a valid email address.",
  "errors": { "email": "Enter a valid email address." }
}
```

The component merges `errors` into its inline-error map so server-side
rejections light up the right input even if client validation passed
(e.g. server is stricter than client, or Resend rejects the email).

## Email content

```
Subject: Umoja contact form, <reason>
From:    <CONTACT_FROM_EMAIL or onboarding@resend.dev>
To:      <CONTACT_EMAIL>
Reply-To: <applicant's email>

New message from the Umoja contact form.

Name: Jane Doe
Email: jane@example.com
Reason: General question
Submitted: 2026-05-01T19:23:11.000Z

Message:
<the applicant's message>
```

Both `text` and `html` bodies are sent. The `html` body HTML-escapes
all user input to neutralize injection.

`Reply-To` is set to the applicant's email so when you hit "Reply" in
your inbox, Gmail / Outlook / Apple Mail address it to them, not to the
no-reply sender.

## Required environment variables

| Name                         | Required                           | Default                              |
| ---------------------------- | ---------------------------------- | ------------------------------------ |
| `RESEND_API_KEY`             | Yes for production, no for dev     | unset (dev logs, prod 503)           |
| `CONTACT_FROM_EMAIL`         | Recommended for production         | `Umoja Africa <onboarding@resend.dev>` |
| `NEXT_PUBLIC_CONTACT_EMAIL`  | Optional override                  | `info@umoja.tbafrica.org`              |

`CONTACT_FROM_EMAIL` is server-only, no `NEXT_PUBLIC_` prefix —
applicants don't need to know the sender, only the team does.

## Testing

```bash
# All tests (validation, honeypot, rate limit, send, fallback)
pnpm vitest run tests/api/contact.test.ts

# Component tests (fetch behavior, success state, error state)
pnpm vitest run tests/components/contact-form.test.tsx

# Manual smoke test in dev (with RESEND_API_KEY set)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "reason": "general",
    "message": "Curl smoke test from local dev.",
    "company": ""
  }'
```

A successful response is `{"ok":true}` and the email lands at
`CONTACT_EMAIL` within a few seconds.
