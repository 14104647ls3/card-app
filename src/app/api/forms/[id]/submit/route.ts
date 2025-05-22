// app/api/forms/[id]/submit/route.ts
import { NextResponse } from 'next/server';
import { responsesCollection } from '@/lib/db';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const answers = await req.json();
  await responsesCollection.insertOne({ formId: params.id, answers, submittedAt: new Date() });
  return NextResponse.json({ message: 'Response submitted' });
}