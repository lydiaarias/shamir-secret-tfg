import { NextResponse } from 'next/server';
import { Shamir } from '@/lib/shamir';

export async function POST(req: Request) {
    try {
        const { shares } = await req.json(); // Viene de RecoverForm como [{x, y}, ...]

        if (!shares || shares.length === 0) {
            return NextResponse.json({ error: "No se proporcionaron fragmentos" }, { status: 400 });
        }

        // Llamamos a la lógica de interpolación
        const recoveredSecret = Shamir.combine(shares.map((s: any) => ({
            x: Number(s.x),
            content: s.y
        })));

        return NextResponse.json({ secret: recoveredSecret });
    } catch (error: any) {
        return NextResponse.json({ error: "Error al reconstruir. Asegúrate de tener suficientes fragmentos." }, { status: 400 });
    }
}