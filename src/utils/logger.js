function log(level, message, ...others) {
  const date = new Date();

  console.log(date.toISOString(), "|", level, "|", message);

  others.forEach((o) => console.dir(o));
}

function info(message, ...others) {
  log("INF", message, ...others);
}

function debug(message, ...others) {
  log("DBG", message, ...others);
}

function error(message, ...others) {
  log("ERR", message, ...others);
}

module.exports.logger = {
  info,
  debug,
  error,
};
