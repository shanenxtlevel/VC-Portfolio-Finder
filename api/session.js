// Tells the page whether a passcode is needed and, once allowed in, where feedback goes.
import { isLocked, isAuthed, json } from './_lib/auth.js';

export default function handler(req, res) {
  const authed = isAuthed(req);
  json(res, 200, {
    locked: isLocked(),
    authed,
    feedbackEmail: authed ? (process.env.FEEDBACK_EMAIL || '').trim() : ''
  });
}
