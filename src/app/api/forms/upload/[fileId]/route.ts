import { NextRequest, NextResponse } from 'next/server';
import { getFileFromGridFS, deleteFileFromGridFS } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string }}
) {
  try {
    const { fileId } = await params;

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    const { file, stream } = await getFileFromGridFS(fileId);

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    
    return new Promise((resolve) => {
      stream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      stream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        
        const response = new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': file.metadata?.mimeType || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${file.metadata?.originalName || file.filename}"`,
            'Content-Length': buffer.length.toString(),
          },
        });

        resolve(response);
      });

      stream.on('error', () => {
        resolve(NextResponse.json(
          { error: 'Failed to download file' },
          { status: 500 }
        ));
      });
    });

  } catch (error) {
    console.error('File download error:', error);
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { fileId: string }}
) {
  try {
    const { fileId } = await params;

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    await deleteFileFromGridFS(fileId);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });

  } catch (error) {
    console.error('File deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
} 