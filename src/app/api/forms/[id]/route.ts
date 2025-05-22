// app/api/forms/[id]/route.ts
import { NextResponse } from 'next/server';
import { formsCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function PUT(req: Request) {
    const body = await req.json();
    const _id = new ObjectId(body._id);
    delete body._id;
    const res = await formsCollection.updateOne({ _id: _id }, { $set: body });
    console.log(body);
    console.log(res);
    if (res.matchedCount === 0) {
        return NextResponse.json({ message: 'Form not found' }, { status: 404 });
    }
  return NextResponse.json({ message: 'Form updated' });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const objectId = new ObjectId(id);

    const result = await formsCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Form deleted' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}