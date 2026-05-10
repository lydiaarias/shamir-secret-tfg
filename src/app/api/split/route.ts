import { NextResponse } from 'next/server';
import { Shamir } from '@/lib/shamir';

export async function POST(req: Request) {
  try {
    const { text, n, k } = await req.json();

    // 1. Validaciones básicas
    if (!text || !n || !k) {
      return NextResponse.json(
        { error: 'Faltan parámetros (text, n o k)' },
        { status: 400 }
      );
    }

    if (k > n) {
      return NextResponse.json(
        { error: 'El umbral (k) no puede ser mayor al total (n)' },
        { status: 400 }
      );
    }

    // 2. Generar el ID único de 10 dígitos
    const sharedId = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    // 3. Generar los fragmentos usando Shamir
    const sharesValues = Shamir.split(text, n, k);

    // 4. Mapear los fragmentos para que incluyan el ID común y su índice X
    const formattedShares = sharesValues.map((content, i) => ({
      id: sharedId,      // El mismo ID para todos los fragmentos
      xIndex: i + 1,
      content: content
    }));

    // 5. Responder al cliente
    return NextResponse.json({
      id: sharedId,
      threshold: k,
      shares: formattedShares,
    });

  } catch (error: any) {
    console.error('Error en API Split:', error);
    return NextResponse.json(
      { error: 'Error interno al procesar el secreto', details: error.message },
      { status: 500 }
    );
  }
}