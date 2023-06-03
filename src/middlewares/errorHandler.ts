import CustomError from '../utils/customError'
// const logger from '../utils/logger')
import config from '../config/sysConfig'
import { Request, Response } from 'express'

export default (err:Error, req:Request, res:Response) => {
	if (err instanceof CustomError) {
		return res
			.status(err.status)
			.json({ error: 1, msg: err.message })
	}
	let resObj = {}

	if (process.env.NODE_ENV === 'production') {
		resObj = {
			error: 1,
			msg: 'Something went wrong. Try again later.',
		}
	} else {
		console.log(err.name, err.message)
		resObj = {
			error: 1,
			msg: err.message,
			data: err.stack,
		}
	}

	return res.status(500).json(resObj);
	// return process.exit(1)
}
