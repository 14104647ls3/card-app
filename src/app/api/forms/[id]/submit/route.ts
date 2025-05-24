// app/api/forms/[id]/submit/route.ts
import { NextResponse } from 'next/server';
import { responsesCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }>}): Promise<NextResponse> {
    const answers = await req.json();
    const { id } = await params;
    try {
        console.log(answers);
        const res = await responsesCollection.insertOne({
            formId: new ObjectId(id),
            answers,
            submittedAt: new Date()
        });
        console.log(res);
        return NextResponse.json({ message: 'Response submitted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error submitting response' }, { status: 500 });
    }
}