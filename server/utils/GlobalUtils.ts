"use strict";
import crypto from 'crypto';

export class GlobalUtils {
    static generateID(size?: number):string {
        let normalizedSize = size ?? 16;
        return crypto.randomBytes(normalizedSize).toString('hex');
    }
}
