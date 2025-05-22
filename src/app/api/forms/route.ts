import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { formsCollection } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json();

  const newForm = {
    title: body.title || 'Untitled Form',
    description: body.description || '',
    questions: body.questions || [],
  };

  const result = await formsCollection.insertOne(newForm);

  return NextResponse.json({ _id: result.insertedId.toString(), ...newForm });
}

export async function GET() {
  const forms = await formsCollection.find().toArray();

  const cleanForms = forms.map(form => ({
    ...form,
    _id: form._id.toString(),
  }));

  return NextResponse.json(cleanForms);
}