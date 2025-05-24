# AI Form Generation Setup

This application includes an AI-powered form generation feature using Claude API.

## Setup

1. **Get a Claude API Key**
   - Sign up at [console.anthropic.com](https://console.anthropic.com)
   - Create an API key
   - Copy your API key

2. **Add Environment Variable**
   Add the following to your `.env.local` file:
   ```
   ANTHROPIC_API_KEY=your-claude-api-key-here
   ```

3. **Restart your development server**
   ```bash
   npm run dev
   ```

## Usage

1. **Access the Form Builder**
   - Go to any form edit page
   - Click "Generate with AI" button

2. **Describe Your Form**
   - Enter a detailed description of the form you want to create
   - Be specific about question types, requirements, and context
   - Example: "Create a customer feedback survey for a restaurant with rating questions, comment sections, and file upload for photos"

3. **Generate and Customize**
   - AI will generate questions based on your description
   - You can edit the generated questions manually
   - Add, remove, or modify questions as needed

## Features

- **Smart Question Generation**: AI creates appropriate question types based on context
- **File Upload Support**: AI can suggest file upload questions with appropriate restrictions
- **Validation**: AI determines which questions should be required
- **Multiple Choice Options**: AI generates relevant options for radio and checkbox questions

## Example Prompts

- "Create a job application form for a software developer position"
- "Generate a course evaluation survey for university students"
- "Make an event registration form with file upload for documents"
- "Create a customer satisfaction survey for an e-commerce website"

## Troubleshooting

- **API Key Error**: Make sure your ANTHROPIC_API_KEY is correctly set in `.env.local`
- **Rate Limits**: If you hit rate limits, wait a few minutes before trying again
- **Invalid Response**: If AI generates invalid JSON, try rephrasing your prompt 