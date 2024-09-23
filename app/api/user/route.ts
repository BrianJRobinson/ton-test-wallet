import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const userData = await req.json();

        if (!userData || !userData.id) {
            return NextResponse.json({ error: 'Invalid user data'}, { status: 400 });
        }

        let user = await prisma.user.findUnique({
            where: { telegramId: userData.id }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    telegramId: userData.id,
                    username: userData.username || '',
                    first_name: userData.first_name || '',
                    last_name: userData.last_name || ''
                }
            });
        }

        return NextResponse.json({"user" : user, "extra" : "Attempted Call"});
    } catch (error) {
        console.error('Error processing user data:', error);
        return NextResponse.json({error: 'internal server error'}, { status: 500});
    }
}