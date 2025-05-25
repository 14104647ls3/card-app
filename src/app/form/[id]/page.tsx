import { formsCollection } from '@/lib/db';
import FormRenderer from '@/components/FormRenderer';
import { ObjectId } from 'mongodb';

export default async function FormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    // Only use ObjectId for MongoDB _id lookup
    const form = await formsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!form) {
      return <div>Form not found</div>;
    }

    // Return with only plain fields, remove all other functions
    const formData = {
      _id: form._id.toString(),
      title: form.title || '',
      questions: form.questions || [],
    };
    
    return <FormRenderer form={formData} />;
  } catch (error) {
    console.error("Error finding form:", error);
    return <div>Error loading form</div>;
  }
}