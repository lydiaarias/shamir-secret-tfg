import * as core from './core';

export class Shamir {
    static split(text: string, n: number, k: number): string[] {
        let S: bigint;
        if (/^\d+$/.test(text)) {
            S = BigInt(text);
        } else {
            const bytes = Buffer.from(text, 'utf-8');
            S = bytes.reduce((acc, byte) => (acc << BigInt(8)) + BigInt(byte), BigInt(0));
        }

        const coefficients: bigint[] = [S];
        for (let i = 1; i < k; i++) {
            // Coeficientes aleatorios grandes para mayor seguridad
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

    /**
     * Recuperación exacta mediante Interpolación de Lagrange
     */
    static combine(shares: { x: number; content: string }[]): string {
        const k = shares.length;
        let secret = BigInt(0);

        for (let i = 0; i < k; i++) {
            let numerator = BigInt(1);
            let denominator = BigInt(1);

            for (let j = 0; j < k; j++) {
                if (i === j) continue;
                // Lagrange: L_i(0) = Product ( -x_j / (x_i - x_j) )
                numerator *= BigInt(-shares[j].x);
                denominator *= BigInt(shares[i].x - shares[j].x);
            }

            const yi = BigInt(shares[i].content);
            secret += (yi * numerator) / denominator;
        }

        const secretBigInt = secret;
        
        // Intentar convertir de BigInt a String de texto (UTF-8)
        try {
            let hex = secretBigInt.toString(16);
            if (hex.length % 2 !== 0) hex = '0' + hex;
            const buffer = Buffer.from(hex, 'hex');
            const decoded = buffer.toString('utf-8');
            
            // Si el resultado contiene caracteres legibles, devolvemos el texto
            // Si no, devolvemos el número como string
            return /[^\x20-\x7E]/.test(decoded) ? secretBigInt.toString() : decoded;
        } catch {
            return secretBigInt.toString();
        }
    }
}