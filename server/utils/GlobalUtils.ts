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

  static shuffle(unshuffled: string[]): string[] {
    let unshuffledCopy: string[] = [...unshuffled];
    let toShuffle: number = unshuffledCopy.length;
    let swapPosition: number;
    while (toShuffle) {
      swapPosition = Math.floor(Math.random() * toShuffle--);
      [unshuffledCopy[toShuffle], unshuffledCopy[swapPosition]] =
        [unshuffledCopy[swapPosition], unshuffledCopy[toShuffle]];
    }
    return unshuffledCopy;
  }

  static shuffleMap<T>(unshuffledMap: Map<string, T>): Map<string, T> {
    return this.shuffle(
      Array.from(unshuffledMap.keys())
    ).reduce((shuffeldMap: Map<string, T>, id: string) => {
      return shuffeldMap.set(id, unshuffledMap.get(id))
    }, new Map())
  }
}
