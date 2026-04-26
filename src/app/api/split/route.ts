import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

    // 2. Generar los fragmentos usando el polinomio f(x) = S + a1x + a2x^2...
    // Esta función ahora devuelve un array de strings decimales
    const shares = Shamir.split(text, n, k);

    // 3. Guardar el "Secreto" principal en la base de datos
    // No guardamos el texto original por seguridad, solo la configuración
    const newSecret = await prisma.secret.create({
      data: {
        threshold: k,
      },
    });

    // 4. Bucle de guardado de los fragmentos (Shares)
    // Guardamos i + 1 como xIndex para que x sea 1, 2, 3, 4, 5, 6...
    const savedShares = [];
    for (let i = 0; i < shares.length; i++) {
      const share = await prisma.share.create({
        data: {
          content: shares[i],   // Este es el valor f(x)
          xIndex: i + 1,        // Este es el valor x
          secretId: newSecret.id,
        },
      });
      savedShares.push(share);
    }

    // 5. Responder al cliente con los datos generados
    return NextResponse.json({
      id: newSecret.id,
      threshold: newSecret.threshold,
      shares: savedShares, // Enviamos los fragmentos para que el usuario los vea
    });

  } catch (error: any) {
    console.error('Error en API Split:', error);
    return NextResponse.json(
      { error: 'Error interno al procesar el secreto', details: error.message },
      { status: 500 }
    );
  }
}