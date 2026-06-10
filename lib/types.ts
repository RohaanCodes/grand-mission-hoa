export interface SiteSettings {
  id: string
  hero_title: string
  hero_subtitle: string
  welcome_text: string
  logo_url?: string
  club_hours?: string
}

export interface News {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string[]          // ← Changed to Attachment field
  published_date: string
  author?: string
}

export interface Amenity {
  id: string
  name: string
  slug: string
  description: string
  hours?: string
  image?: string[]           // ← Changed to Attachment field
  category?: string
}
export interface Document {
  id: string
  title: string
  url: string
  category?: string
  updated_date?: string
}

export interface Event {
  id: string
  'Event Name': string
  'Event Date': string
  'End Date'?: string
  Description: string
  Location?: string
  Status?: string
  'Banner Image'?: string[]
  'Event Category'?: string
  'Tier 1 Name'?: string
  'Tier 1 Price'?: number
  'Tier 1 Benefits'?: string
  'Tier 2 Name'?: string
  'Tier 2 Price'?: number
  'Tier 2 Benefits'?: string
  'Tier 3 Name'?: string
  'Tier 3 Price'?: number
  'Tier 3 Benefits'?: string
  'Sponsor Application Link'?: string
}

export interface GalleryImage {
  id: string
  title: string
  image?: string[]        // ← Changed to Attachment
  category?: string
  order?: number
}

export interface Contact {
  id: string
  type: 'clubhouse' | 'management' | 'emergency'
  name?: string
  phone?: string
  email?: string
  address?: string
  hours?: string
}

export interface MeetingMinutes {
  id: string
  title: string
  slug: string
  date: string
  summary: string
  attendees?: string
  topics_discussed?: string
  decisions_made?: string
  action_items?: string
  document_url?: string
}

export interface FormSubmission {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export interface FAQ {
  id: string
  Question: string
  Answer: string
  Category?: string
  Order?: number
}