import jwt, { JwtPayload } from "jsonwebtoken";
import { AccessToken, RefreshToken } from "../models";

export class JwtAdapter {
    static decode(token: AccessToken) {
        return jwt.decode(token);
    }

    static isTokenExpired(token: AccessToken | RefreshToken) {
        const {exp} = jwt.decode(token) as JwtPayload
        return exp! < Date.now() / 1000
    }
}
