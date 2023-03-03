function log(level, message, ...others) {
  const date = new Date();

  console.log(date.toISOString(), "|", level, "|", message);

  others.forEach((o) => console.dir(o));
}

function info(message, ...others) {
  log("LOG", message, ...others);
}

function debug(message, ...others) {
  log("DBG", message, ...others);
}

function error(message, ...others) {
  log("ERR", message, ...others);
}

module.exports.info = info;
module.exports.debug = debug;
module.exports.error = error;
module.exports.logger = {
  info,
  debug,
  error,
};
