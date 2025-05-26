import { NextResponse } from 'next/server';
import { getFileFromGridFS } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
): Promise<NextResponse> {
  try {
    const { fileId } = await params;
    
    // Validate ObjectId format
    if (!ObjectId.isValid(fileId)) {
      return NextResponse.json(
        { error: 'Invalid file ID format' },
        { status: 400 }
      );
    }

    // Get file from GridFS
    const { file, stream } = await getFileFromGridFS(fileId);

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      stream.on('end', () => {
        const fileBuffer = Buffer.concat(chunks);
        
        // Create response with proper headers
        const response = new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': file.metadata?.mimeType || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${file.metadata?.originalName || file.filename}"`,
            'Content-Length': file.length.toString(),
            'Cache-Control': 'private, max-age=3600', // Cache for 1 hour
          },
        });
        
        resolve(response);
      });

      stream.on('error', (error) => {
        console.error('Stream error:', error);
        reject(NextResponse.json(
          { error: 'Failed to read file' },
          { status: 500 }
        ));
      });
    });

  } catch (error) {
    console.error('File download error:', error);
    
    if (error instanceof Error && error.message === 'File not found') {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
} 