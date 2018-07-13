var winston = require('winston');

var options = {
    file: {
        level: 'info', // - Write to all logs with level `info` 
        filename: './logs/all-logs.log', // - File to write to 
        handleExceptions: true,
        json: true,
        maxsize: 5242880, //5MB
        maxFiles: 5,
        colorize: false
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

const logger = winston.createLogger({
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
  });

// defining a log stream that will get morgan-generated output into our winston log files
logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;