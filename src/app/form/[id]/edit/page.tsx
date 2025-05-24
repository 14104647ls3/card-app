// app/form/[id]/edit/page.tsx (Form Editing)
import { formsCollection } from '@/lib/db';
import FormBuilder from '@/components/FormBuilder';
import { ObjectId } from 'mongodb';

export default async function FormEditPage({ params }: { params: Promise<{ id: string }> }) {
    let form;
    const { id } = await params;
  try {
    // Only use ObjectId for MongoDB _id lookup
    form = await formsCollection.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error("Error finding form:", error);
  }
  form = {
    _id: form?._id.toString(),
    title: form?.title || '',
    description: form?.description || '',
      questions: form?.questions || [{}],
  }
  if (!form) return <div>Form not found</div>;
  return <FormBuilder initialForm={form} />;
}
