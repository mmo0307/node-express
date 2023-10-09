import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { IMiddleware } from './middlewate.interface';

class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const instance = plainToClass(this.classToValidate, body);

		const errors = await validate(instance);

		errors.length > 0 ? res.status(422).send(errors) : next();
	}
}

export { ValidateMiddleware };
