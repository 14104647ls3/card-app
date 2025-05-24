import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToGridFS } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const formId = formData.get('formId') as string;
    const questionId = formData.get('questionId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!formId || !questionId) {
      return NextResponse.json(
        { error: 'formId and questionId are required' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(bytes);

    // Create unique filename with timestamp
    const timestamp = Date.now();
    const uuid = uuidv4();
    const filename = `${timestamp}_${uuid}_${file.name}`;

    // Upload to GridFS with metadata
    const fileId = await uploadFileToGridFS(fileBuffer, filename, {
      formId,
      questionId,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
    });

    return NextResponse.json({
      success: true,
      fileId: fileId.toString(),
      filename: file.name,
      size: file.size,
      mimeType: file.type,
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
