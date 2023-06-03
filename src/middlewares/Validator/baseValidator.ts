import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Reduces the validation array into an object like this <{[param]:ParamValidatorArray[]}>
 * @param {ValidationError[]} _array
 * @returns
 */
const render = (_array: any[]) => {
	const errObj = []
	for (let i = 0; i < _array.length; i += 1) {
		const err = _array[i]
		if (errObj[err.path]) {
			errObj[err.path].push(err.msg)
		} else {
			errObj[err.path] = [err.msg]
		}
	}

	return errObj
}

/**
 * Checks for Validation errors. If errors,
 * responds with errors Or moves to the next middleware in the Route chain
 * @param {Request} req - Request Object
 * @param {Response} res - Response Object
 * @param {NextFunction} next - Next callback
 */
const validateInputs = async (req:Request, res:Response, next:NextFunction) => {
	// Checks for validation errors
	const result = validationResult(req)
	if (!result.isEmpty()) {
		return res.status(422).json({
			error: 1,
			msg: 'Validation Error(s)',
			data: render(result.array()),
		})
	}

	return next()
}

export default validateInputs
