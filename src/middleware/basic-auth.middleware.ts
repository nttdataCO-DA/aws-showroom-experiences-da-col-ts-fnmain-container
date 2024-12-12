import { Request, Response, NextFunction } from 'express';

import { config } from '../common/config/default';

const secretCode = config.SECRET_CODE;

export const authenticateSecretCode = (req: Request, res: Response, next: NextFunction) => {
    if (!config.AUTH_ENABLE) {
        return next();
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== secretCode) {
        return res.sendStatus(401);
    }
    next();
};
