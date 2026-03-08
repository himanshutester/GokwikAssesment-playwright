/**
 * Structured logging utility for test runs.
 * Implementation in Phase 10.
 */

function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`, Object.keys(meta).length ? meta : '');
}

module.exports = {
  info: (msg, meta) => log('INFO', msg, meta),
  warn: (msg, meta) => log('WARN', msg, meta),
  error: (msg, meta) => log('ERROR', msg, meta),
  debug: (msg, meta) => log('DEBUG', msg, meta),
};
