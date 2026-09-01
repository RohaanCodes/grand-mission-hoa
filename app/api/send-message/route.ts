import { submitContactForm } from '@/lib/airtable'
import { NextRequest, NextResponse } from 'next/server'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Submit to Airtable
    const success = await submitContactForm({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim(),
      message: data.message.trim(),
    })

    if (!success) {
      return NextResponse.json(
        {
          error: 'Failed to submit form. Please check your Airtable configuration.',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Message submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
