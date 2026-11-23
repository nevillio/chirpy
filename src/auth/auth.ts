import argon2 from 'argon2';
import crypto from 'crypto';
import type { Request } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { BadRequestError, UnauthorizedError } from '../api/errors.ts';
import { config } from '../config.ts';

type Payload = Pick<JwtPayload, 'iss' | 'sub' | 'iat' | 'exp'>;
export function hashPassword(password: string): Promise<string> {
	return argon2.hash(password);
}

export function checkPasswordHash(
	password: string,
	hash: string,
): Promise<boolean> {
	return argon2.verify(hash, password);
}

export function makeJWT(
	userId: string,
	expiresIn: number,
	secret: string,
): string {
	const iat = Math.floor(Date.now() / 1000);
	const payload: Payload = {
		iss: config.jwt.issuer,
		sub: userId,
		iat,
		exp: iat + expiresIn,
	};
	return jwt.sign(payload, secret, { algorithm: 'HS256' });
}

export function validateJWT(tokenString: string, secret: string): string {
	try {
		const payload = jwt.verify(tokenString, secret);
		if (typeof payload !== 'string' && typeof payload.sub === 'string') {
			return payload.sub;
		}
	} catch {}
	throw new UnauthorizedError('token invalid');
}

export function extractBearerToken(authorization: string | undefined): string {
	if (authorization == null) {
		throw new BadRequestError('No token');
	}

	const regex = /(?<scheme>\w+)\s+(?<token>[A-Za-z0-9._-]+)/;
	const { scheme = '', token = '' } = authorization.match(regex)?.groups || {};
	if (scheme !== 'Bearer' || token === '') {
		throw new BadRequestError('Invalid token');
	}
	return token;
}

export function getBearerToken(req: Request): string {
	const authHeader = req.get('authorization');
	return extractBearerToken(authHeader);
}

export function makeRefreshToken(): string {
	return crypto.randomBytes(32).toString('hex');
}
