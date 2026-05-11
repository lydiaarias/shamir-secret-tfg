import { NextResponse } from 'next/server';
import { Shamir } from '@/lib/shamir';

export async function POST(req: Request) {
    try {
        const { shares } = await req.json(); 

        if (!shares || shares.length === 0) {
            return NextResponse.json({ error: "No se proporcionaron fragmentos" }, { status: 400 });
        }

        const recoveredSecret = Shamir.combine(shares.map((s: any) => ({
            x: Number(s.x),
            content: s.y
        })));

        return NextResponse.json({ secret: recoveredSecret });
    } catch (error: any) {
        // Si no termina en "REAL", devolvemos un error
        return NextResponse.json(
            { error: "El secreto no existe o los fragmentos son incorrectos." }, 
            { status: 404 }
        );
    }
}