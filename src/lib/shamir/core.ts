const LOG = new Uint8Array(256);
const EXP = new Uint8Array(256);

(function init() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
        EXP[i] = x;
        LOG[x] = i;
        x <<= 1;
        if (x & 0x100) x ^= 0x11d;
    }
    EXP[255] = EXP[0];
})();

export const mul = (a: number, b: number) => (a === 0 || b === 0) ? 0 : EXP[(LOG[a] + LOG[b]) % 255];
export const div = (a: number, b: number) => (a === 0) ? 0 : EXP[(LOG[a] - LOG[b] + 255) % 255];

export function splitByte(secret: number, n: number, k: number): number[] {
    const coeffs = [secret, ...Array.from({ length: k - 1 }, () => Math.floor(Math.random() * 256))];
    return Array.from({ length: n }, (_, i) => {
        const x = i + 1;
        let y = coeffs[0];
        for (let j = 1; j < k; j++) {
            y ^= mul(coeffs[j], EXP[(LOG[x] * j) % 255]);
        }
        return y;
    });
}

export function recoverByte(shares: { x: number; y: number }[]): number {
    let secret = 0;
    for (let i = 0; i < shares.length; i++) {
        let li = 1;
        for (let j = 0; j < shares.length; j++) {
            if (i !== j) {
                li = mul(li, div(shares[j].x, shares[j].x ^ shares[i].x));
            }
        }
        secret ^= mul(shares[i].y, li);
    }
    return secret;
}