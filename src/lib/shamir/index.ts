import * as core from './core';

export class Shamir {
    /**
     * S = Secreto (a0)
     * n = Número de fragmentos
     * k = Umbral (threshold)
     */
    static split(text: string, n: number, k: number): string[] {
        // 1. Convertimos el texto a un número (S)
        // Si el usuario mete "1234", lo usamos como número. 
        // Si mete texto, lo convertimos a BigInt desde bytes.
        let S: bigint;
        if (/^\d+$/.test(text)) {
            S = BigInt(text);
        } else {
            const bytes = Buffer.from(text, 'utf-8');
            S = bytes.reduce((acc, byte) => (acc << BigInt(8)) + BigInt(byte), BigInt(0));
        }

        // 2. Generamos coeficientes aleatorios (a1, a2, ..., ak-1)
        // f(x) = S + a1*x + a2*x^2 + ...
        const coefficients: bigint[] = [S];
        for (let i = 1; i < k; i++) {
            // Generamos números aleatorios para los coeficientes
            coefficients.push(BigInt(Math.floor(Math.random() * 1000))); 
        }

        // 3. Calculamos f(x) para x desde 1 hasta n
        const shares: string[] = [];
        for (let x = 1; x <= n; x++) {
            let fx = BigInt(0);
            for (let exp = 0; exp < coefficients.length; exp++) {
                // f(x) = sumatoria de (ai * x^exp)
                fx += coefficients[exp] * (BigInt(x) ** BigInt(exp));
            }
            // Guardamos el resultado como string decimal
            shares.push(fx.toString());
        }

        return shares;
    }

    /**
     * Recuperación mediante Interpolación de Lagrange
     */
    static combine(shares: { x: number; content: string }[]): string {
        const k = shares.length;
        let secret = BigInt(0);

        for (let i = 0; i < k; i++) {
            let numerator = BigInt(1);
            let denominator = BigInt(1);

            for (let j = 0; j < k; j++) {
                if (i === j) continue;
                // Lagrange: L(0) = productoria de (x_j / (x_j - x_i))
                numerator *= BigInt(shares[j].x);
                denominator *= BigInt(shares[j].x - shares[i].x);
            }

            const yi = BigInt(shares[i].content);
            secret += (yi * numerator) / denominator;
        }

        // Si el secreto parece un número, lo devolvemos tal cual
        const secretStr = secret.toString();
        
        // Opcional: Intentar convertir de vuelta a texto si no era originalmente un número
        try {
            return secretStr; 
        } catch {
            return secretStr;
        }
    }
}