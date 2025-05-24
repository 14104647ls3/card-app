import { NextRequest, NextResponse } from 'next/server';
import { getFilesByFormAndQuestion } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; questionId: string }}
) {
  try {
    const { id: formId, questionId } = params;

    if (!formId || !questionId) {
      return NextResponse.json(
        { error: 'Form ID and Question ID are required' },
        { status: 400 }
      );
    }

    const files = await getFilesByFormAndQuestion(formId, questionId);

    const fileList = files.map(file => ({
      _id: file._id.toString(),
      filename: file.filename,
      originalName: file.metadata?.originalName || file.filename,
      mimeType: file.metadata?.mimeType,
      size: file.metadata?.size || file.length,
      uploadedAt: file.metadata?.uploadedAt || file.uploadDate,
    }));

    return NextResponse.json({
      files: fileList,
      count: fileList.length,
    });

  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
} 