class CustomError extends Error {
	status: number;
	constructor(message:string, status:number) {
		super(message)
		this.name = this.constructor.name
		this.status = status || 400
	}
}

export default CustomError
