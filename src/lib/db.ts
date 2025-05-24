import { MongoClient, GridFSBucket, ObjectId, GridFSFile } from 'mongodb';
import { Readable } from 'stream';

const client = new MongoClient(process.env.MONGODB_URI!);

const filesBucket = new GridFSBucket(
  client.db('project_form_upload'), {
  bucketName: 'files'
});

export const db = client.db('porject_form');
export const formsCollection = db.collection('forms');
export const responsesCollection = db.collection('responses');
export const imagesCollection = db.collection('images');

// GridFS file upload functions
export async function uploadFileToGridFS(
  fileBuffer: Buffer,
  filename: string,
  metadata: {
    formId: string;
    questionId: string;
    originalName: string;
    mimeType: string;
    size: number;
  }
): Promise<ObjectId> {
  return new Promise((resolve, reject) => {
    const readable = new Readable();
    readable.push(fileBuffer);
    readable.push(null);

    const uploadStream = filesBucket.openUploadStream(filename, {
      metadata: {
        ...metadata,
        uploadedAt: new Date(),
      },
    });

    uploadStream.on('error', reject);
    uploadStream.on('finish', () => {
      resolve(uploadStream.id as ObjectId);
    });

    readable.pipe(uploadStream);
  });
}

export async function getFileFromGridFS(fileId: ObjectId | string): Promise<{
  file: GridFSFile;
  stream: NodeJS.ReadableStream;
}> {
  const objectId = typeof fileId === 'string' ? new ObjectId(fileId) : fileId;
  
  const file = await filesBucket.find({ _id: objectId }).next();
  if (!file) {
    throw new Error('File not found');
  }

  const downloadStream = filesBucket.openDownloadStream(objectId);
  
  return {
    file,
    stream: downloadStream,
  };
}

export async function deleteFileFromGridFS(fileId: ObjectId | string): Promise<void> {
  const objectId = typeof fileId === 'string' ? new ObjectId(fileId) : fileId;
  await filesBucket.delete(objectId);
}

export async function getFilesByFormAndQuestion(formId: string, questionId: string) {
  return await filesBucket.find({
    'metadata.formId': formId,
    'metadata.questionId': questionId,
  }).toArray();
}

// models/form.ts
export type QuestionType = 'short' | 'paragraph' | 'radio' | 'checkbox' | 'file';

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  options?: string[];
  isRequired: boolean;
}

export interface Form {
  _id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Image {
  _id: string;
  base64: string;
  createdAt: Date;
}

