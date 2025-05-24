import { formsCollection } from '@/lib/db';
import FormRenderer from '@/components/FormRenderer';
import { ObjectId } from 'mongodb';


export default async function FormPage({ params }: { params: Promise<{ id: string }> }) {
    let form;
    const { id } = await params;
    try {
        // Only use ObjectId for MongoDB _id lookup
        form = await formsCollection.findOne({ _id: new ObjectId(id) });
      } catch (error) {
        console.error("Error finding form:", error);
    }

    // Return with only plain fields, remove all other functions
    form = {
        _id: form?._id.toString(),
        title: form?.title,
        questions: form?.questions,
    }
  if (!form) return <div>Form not found</div>;
  return <FormRenderer form={form} />;
}