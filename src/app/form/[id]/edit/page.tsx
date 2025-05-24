// app/form/[id]/edit/page.tsx (Form Editing)
import { formsCollection } from '@/lib/db';
import FormBuilder from '@/components/FormBuilder';
import { ObjectId } from 'mongodb';

export default async function FormEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    // Only use ObjectId for MongoDB _id lookup
    const form = await formsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!form) {
      return <div>Form not found</div>;
    }
    
    const formData = {
      _id: form._id.toString(),
      title: form.title || '',
      description: form.description || '',
      questions: form.questions || [],
    };
    
    return <FormBuilder initialForm={formData} />;
  } catch (error) {
    console.error("Error finding form:", error);
    return <div>Error loading form</div>;
  }
}
