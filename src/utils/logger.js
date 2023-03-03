const isDebug = process.env.DEBUG === "TRUE" ? true : false;

function log(level, message, ...others) {
  const date = new Date();

  console.log(date.toISOString(), "|", level, "|", message);

  others.forEach((o) => console.dir(o));

  return;
}

function info(message, ...others) {
  log("INF", message, ...others);

  return;
}

function debug(message, ...others) {
  if (!isDebug) return;

  log("DBG", message, ...others);

  return;
}

function error(message, ...others) {
  log("ERR", message, ...others);

  return;
}

module.exports.logger = {
  info,
  debug,
  error,
};
