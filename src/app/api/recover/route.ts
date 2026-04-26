import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Shamir } from '@/lib/shamir';

export async function POST(req: Request) {
    try {
        const { shareIds } = await req.json();

        const dbShares = await prisma.share.findMany({
            where: { id: { in: shareIds } }
        });

        if (dbShares.length === 0) {
            return NextResponse.json({ error: "No se encontraron fragmentos" }, { status: 404 });
        }

        const result = Shamir.combine(dbShares.map((d) => ({
            x: d.xIndex,
            content: d.content
        })));

        return NextResponse.json({ secret: result });
    } catch (error) {
        return NextResponse.json({ error: "Error al reconstruir" }, { status: 400 });
    }
}