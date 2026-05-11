import * as core from './core';

export class Shamir {
    // Marca de validación corta
    private static VALIDATION_TAG = "REAL";

    static split(text: string, n: number, k: number): string[] {
        // Añadimos "REAL" al final del secreto antes de dividirlo
        const signedText = text + this.VALIDATION_TAG;
        
        let S: bigint;
        const bytes = Buffer.from(signedText, 'utf-8');
        S = bytes.reduce((acc, byte) => (acc << BigInt(8)) + BigInt(byte), BigInt(0));

        const coefficients: bigint[] = [S];
        for (let i = 1; i < k; i++) {
            coefficients.push(BigInt(Math.floor(Math.random() * 1000000000))); 
        }

        const shares: string[] = [];
        for (let x = 1; x <= n; x++) {
            let fx = BigInt(0);
            for (let exp = 0; exp < coefficients.length; exp++) {
                fx += coefficients[exp] * (BigInt(x) ** BigInt(exp));
            }
            shares.push(fx.toString());
        }
        return shares;
    }

    static combine(shares: { x: number; content: string }[]): string {
        const k = shares.length;
        let secretBigInt = BigInt(0);

        for (let i = 0; i < k; i++) {
            let numerator = BigInt(1);
            let denominator = BigInt(1);

            for (let j = 0; j < k; j++) {
                if (i === j) continue;
                numerator *= BigInt(-shares[j].x);
                denominator *= BigInt(shares[i].x - shares[j].x);
            }

            const yi = BigInt(shares[i].content);
            secretBigInt += (yi * numerator) / denominator;
        }

        try {
            let hex = secretBigInt.toString(16);
            if (hex.length % 2 !== 0) hex = '0' + hex;
            const buffer = Buffer.from(hex, 'hex');
            const decoded = buffer.toString('utf-8');
            
            // Verificamos si el secreto termina exactamente en "REAL"
            if (decoded.endsWith(this.VALIDATION_TAG)) {
                return decoded.slice(0, -this.VALIDATION_TAG.length);
            } else {
                throw new Error("INVALID_SHARES");
            }
        } catch {
            throw new Error("INVALID_SHARES");
        }
    }
}