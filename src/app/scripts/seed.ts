import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const uri = process.env.MONGODB_URI!;
console.log(uri);
const client = new MongoClient(uri);

export async function seed() {
  await client.connect();
  const db = client.db('porject_form');
  const forms = db.collection('forms');

  const sampleForm = {
    title: 'Customer Feedback',
    description: 'We value your input!',
    questions: [
      {
        id: uuidv4(),
        type: 'short',
        label: 'What is your name?',
        isRequired: true,
      },
      {
        id: uuidv4(),
        type: 'paragraph',
        label: 'Describe your experience',
        isRequired: false,
      },
      {
        id: uuidv4(),
        type: 'radio',
        label: 'Rate our service',
        options: ['Excellent', 'Good', 'Average', 'Poor'],
        isRequired: true,
      },
      {
        id: uuidv4(),
        type: 'checkbox',
        label: 'What features did you use?',
        options: ['Chat', 'Email', 'Phone Support'],
        isRequired: false,
      },
    ],
  };

  await forms.insertOne(sampleForm);
  console.log('Sample form inserted.');
  await client.close();
}
