import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const { email, type, message } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if environment variables are set
    if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
      console.error('Missing Notion environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Add to Notion database
    await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID,
      },
      properties: {
        // Notion requires a Title property (usually 'Name' or 'Title')
        Name: {
          title: [
            {
              text: {
                content: `Support Request: ${email}`,
              },
            },
          ],
        },
        Email: {
          email: email,
        },
        Type: {
          select: {
            name: type || 'Question',
          },
        },
        Message: {
          rich_text: [
            {
              text: {
                content: message || '',
              },
            },
          ],
        },
      },
    });

    return NextResponse.json(
      { message: 'Successfully sent support request' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding support request to Notion:', error);
    
    // Handle specific Notion API errors
    if (error instanceof Error) {
      if (error.message.includes('database_id')) {
        return NextResponse.json(
          { error: 'Database configuration error' },
          { status: 500 }
        );
      }
      if (error.message.includes('unauthorized')) {
        return NextResponse.json(
          { error: 'Authentication error' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to send support request' },
      { status: 500 }
    );
  }
}