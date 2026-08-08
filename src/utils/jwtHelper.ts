import jwt from 'jsonwebtoken';


export const jwtHelper = async (payload: { userID: number }) => {
    const token = jwt.sign(payload, "signature", { expiresIn: '1d' });
    return token
}