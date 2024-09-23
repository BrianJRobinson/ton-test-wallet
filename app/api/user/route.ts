import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const userData = await req.json();
        
        if (!userData || !userData.telegramId) {
            return NextResponse.json({ error: 'Invalid user data'}, { status: 400 });
        }
        console.log("Before user call");
        let user = await prisma.user.findUnique({
            where: { telegramId: userData.telegramId }
        });
        console.log("After user call");
        //message = message + "about to call create..."
        if (!user) {
            console.log(userData);
            user = await prisma.user.create({
                data: {
                    telegramId: userData.telegramId,
                    username: userData.username || '',
                    first_name: userData.first_name || '',
                    last_name: userData.last_name || ''
                }
            });
        }
        //message = message + "call complete..."
        return NextResponse.json({"user" : user}); //, "extra" : message});
    } catch (error) {
        console.error('Error processing user data:', error);
        return NextResponse.json({error: 'internal server error'}, { status: 500});
    }
}