"use strict";
import crypto from 'crypto';

export class GlobalUtils {
  static generateID(size?: number): string {
    let normalizedSize: number = size ?? 16;
    return crypto.randomBytes(normalizedSize).toString('hex');
  }

  static generateAlphanumericID(size?: number): string {
    let normalizedSize: number = size ?? 4;
    const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result: string = '';
    for (let i = normalizedSize; i > 0; --i) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
    return result;
  }
}
