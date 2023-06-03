const winston = require('winston')
const config = require('../config')

const { createLogger, format, transports } = winston

const FILE_DIRECTORY = '../logs'

const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.errors({ stack: true }),
		format.splat(),
		format.json()
	),
	transports: [
		new transports.Console({
			format: format.combine(format.colorize(), format.simple()),
		}),
	],
})

if (config.isProduction) {
	const errorFileTransport = new transports.File({
		filename: `${FILE_DIRECTORY}/error`,
		level: 'error',
	})
	const infoFileTransport = new transports.File({
		filename: `${FILE_DIRECTORY}/info`,
	})

	logger.clear().add(errorFileTransport).add(infoFileTransport)
}

module.exports = logger
