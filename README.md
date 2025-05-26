# Form Builder Application

## Introduction

## User flow
### Create a new form
  1a. Click on the right side "Create new form" button 
  1b. User can create a clone of a form with the hamburger menu icon button of the original form
  3. User edit the title and description of the form
  4. User can select to generate the form with AI or manually adding the questions 

### Distributing the form
  1. User access the main screen of the WebApp
  2. User click on the hamburger menu icon on the form card user want to distribute
  3a. User can copy the form link
  3b. OR user can open the QR code for sharing


### Filling form
  1a. User can access the main screen and click on the survey button
  1b. User can click on the said link the was shared in Distributing the form
  2. User fill in the form, upload file if possible

### Checking on responses
  1. User can click on the 'responses' tab at the header bar
  2. For desktop mode, User select the desired form from the left side bar; For mobile mode, user select the form from the left side menu icon button
  3. User can check on 

## Used Libraries
- Tailwind CSS
- Radix UI
- Chart.js
- Lodash
- QRCode-react
- Sortable.js
- UUID

## Technical Documentation

### Route & API Structure

This application follows Next.js 13+ App Router structure with a well-organized API and route system.

#### Frontend Routes

```
src/app/
├── page.tsx                          # Home page - displays all forms
├── form/[id]/
│   ├── page.tsx                      # Form submission page (public)
│   ├── edit/page.tsx                 # Form builder/editor page
│   ├── preview/page.tsx              # Form preview page
│   └── qrcode/page.tsx              # QR code generation page
├── responses/
│   ├── page.tsx                      # Desktop responses dashboard
│   └── mobile/page.tsx              # Mobile-optimized responses page
├── scripts/page.tsx                  # Development scripts page
├── test-api/page.tsx                # API testing interface
└── test-redirect/page.tsx           # Redirect testing page
```

#### API Routes

The API follows RESTful conventions with nested resources:

```
src/app/api/
├── forms/
│   ├── route.ts                     # GET /api/forms - List all forms
│   │                                # POST /api/forms - Create new form
│   ├── generate/route.ts            # POST /api/forms/generate - AI form generation
│   ├── upload/
│   │   ├── route.ts                 # POST /api/forms/upload - File upload
│   │   └── [fileId]/route.ts        # GET /api/forms/upload/[fileId] - File retrieval
│   ├── download/
│   │   └── [fileId]/route.ts        # GET /api/forms/download/[fileId] - File download
│   └── [id]/
│       ├── route.ts                 # GET /api/forms/[id] - Get specific form
│       │                            # PUT /api/forms/[id] - Update form
│       │                            # DELETE /api/forms/[id] - Delete form
│       ├── submit/route.ts          # POST /api/forms/[id]/submit - Submit form response
│       ├── files/[questionId]/route.ts # GET /api/forms/[id]/files/[questionId] - Question files
│       └── responses/
│           └── route.ts             # GET /api/forms/[id]/responses - Form responses
│                                    # ?action=stats - Quick statistics
│                                    # ?action=grouped - Grouped by questions
│                                    # (default) - All responses
```

#### API Response Structure

**Form Responses API** (`/api/forms/[id]/responses`)

The responses API supports three different modes via query parameters:

1. **Default Mode** - Returns all responses:
```typescript
GET /api/forms/[id]/responses
// Returns: FormResponse[]
```

2. **Stats Mode** - Returns quick statistics:
```typescript
GET /api/forms/[id]/responses?action=stats
// Returns: { totalSubmissions: number, numberOfQuestions: number }
```

3. **Grouped Mode** - Returns responses grouped by questions:
```typescript
GET /api/forms/[id]/responses?action=grouped
// Returns: QuestionAnswers[]
```

**File Download API** (`/api/forms/download/[fileId]`)

Downloads files uploaded through form submissions:

```typescript
GET /api/forms/download/[fileId]
// Returns: File binary data with appropriate headers
// Headers include:
// - Content-Type: Original file MIME type
// - Content-Disposition: attachment; filename="original_filename"
// - Content-Length: File size in bytes
// - Cache-Control: private, max-age=3600
```

#### Data Models

**Form Structure:**
```typescript
interface Form {
  _id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

interface Question {
  id: string;
  type: 'short' | 'long' | 'radio' | 'checkbox' | 'file';
  label: string;
  isRequired: boolean;
  options?: string[]; // For radio/checkbox questions
}
```

**Response Structure:**
```typescript
interface FormResponse {
  _id: string;
  formId: string;
  answers: ResponseAnswer[] | Record<string, any>; // Supports both formats
  submittedAt: Date;
}

interface ResponseAnswer {
  questionId: string;
  questionType: string;
  value: string | string[] | FileUpload[];
}
```

#### Component Architecture

**Hooks:**
- `useResponses` - Manages form responses data fetching and state
- Custom hooks for form management and data processing

**UI Components:**
- `FormBuilder` - Main form creation/editing interface
- `ResponsesContent` - Displays form responses with charts and statistics
- `ResponseChart` - Renders pie/bar charts for radio/checkbox questions
- `MobileHeader` - Mobile-optimized header component
- `FormsSidebar` - Form selection sidebar

#### Database Integration

The application uses MongoDB with the following collections:
- `forms` - Stores form definitions and questions
- `responses` - Stores form submission data
- `uploads` - Stores file upload metadata

#### File Upload System

File uploads are handled through a dedicated API route with:
- Secure file storage
- File type validation
- Unique file ID generation
- Integration with form questions

#### Mobile Responsiveness

The application includes dedicated mobile routes and components:
- Responsive design patterns
- Touch-optimized interfaces
- Mobile-specific navigation
- Optimized chart rendering for small screens

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
