import Airtable from 'airtable'
import type {
  SiteSettings,
  News,
  Amenity,
  Document,
  Event,
  GalleryImage,
  Contact,
  MeetingMinutes,
  Sponsor, 
  AirtableAttachment,     // ← Added
  DocumentAccessRequest
} from './types'

const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY
const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID

if (!apiKey || !baseId) {
  console.warn(
    'Airtable credentials not configured. Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables.'
  )
}

const base = apiKey && baseId ? new Airtable({ apiKey }).base(baseId) : null

// Helper function to transform Airtable records
function transformRecord<T>(record: any): T {
  return {
    id: record.id,
    ...record.fields,
  } as T
}

// Site Settings
// Site Settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    if (!base) return null;

    const records = await base('SiteSettings')
      .select({
        fields: [
          'hero_title',
          'hero_subtitle',
          'welcome_text',
          'logo_url',
          'club_hours',
          'community_code'     // ← Must be explicitly listed
        ]
      })
      .firstPage();

    if (records.length === 0) {
      console.warn('⚠️ No record found in SiteSettings table');
      return null;
    }

    const settings = transformRecord<SiteSettings>(records[0]);
    console.log("✅ SiteSettings loaded successfully:", settings);
    console.log("🔑 Community Code value:", settings.community_code);

    return settings;
  } catch (error) {
    console.error('❌ Error fetching site settings:', error);
    return null;
  }
}

// News
export async function getAllNews(): Promise<News[]> {
  try {
    if (!base) {
      console.error('❌ Airtable base is null for News');
      return [];
    }

    const records = await base('News')
      .select({
        sort: [{ field: 'published_date', direction: 'desc' }],
        fields: ['title', 'slug', 'excerpt', 'content', 'Image', 'published_date', 'author']
      })
      .all();

    console.log(`✅ Found ${records.length} news articles`);

    return records.map((record) => ({
      id: record.id,
      title: record.get('title') as string || '',
      slug: record.get('slug') as string || '',
      excerpt: record.get('excerpt') as string || '',
      content: record.get('content') as string || '',
      image: record.get('Image') as string[] | undefined,        // ← Attachment field
      published_date: record.get('published_date') as string || '',
      author: record.get('author') as string | undefined,
    }));
  } catch (error: any) {
    console.error('❌ Error fetching news:', error.message);
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  try {
    if (!base) return null;

    const records = await base('News')
      .select({
        filterByFormula: `{slug} = '${slug}'`,
        fields: ['title', 'slug', 'excerpt', 'content', 'Image', 'published_date', 'author']
      })
      .firstPage();

    if (records.length === 0) return null;

    const record = records[0];
    return {
      id: record.id,
      title: record.get('title') as string || '',
      slug: record.get('slug') as string || '',
      excerpt: record.get('excerpt') as string || '',
      content: record.get('content') as string || '',
      image: record.get('Image') as string[] | undefined,
      published_date: record.get('published_date') as string || '',
      author: record.get('author') as string | undefined,
    };
  } catch (error: any) {
    console.error('❌ Error fetching news by slug:', error.message);
    return null;
  }
}

export async function getFeaturedNews(limit: number = 3): Promise<News[]> {
  try {
    if (!base) return [];

    const records = await base('News')
      .select({
        sort: [{ field: 'published_date', direction: 'desc' }],
        maxRecords: limit,
        fields: ['title', 'slug', 'excerpt', 'content', 'Image', 'published_date', 'author']
      })
      .all();

    return records.map((record) => ({
      id: record.id,
      title: record.get('title') as string || '',
      slug: record.get('slug') as string || '',
      excerpt: record.get('excerpt') as string || '',
      content: record.get('content') as string || '',
      image: record.get('Image') as string[] | undefined,
      published_date: record.get('published_date') as string || '',
      author: record.get('author') as string | undefined,
    }));
  } catch (error: any) {
    console.error('❌ Error fetching featured news:', error.message);
    return [];
  }
}

// Amenities
export async function getAllAmenities(): Promise<Amenity[]> {
  try {
    if (!base) {
      console.error('❌ Airtable base is null for Amenities');
      return [];
    }

    const records = await base('Amenities')
      .select({
        sort: [{ field: 'name', direction: 'asc' }],
        fields: ['name', 'slug', 'description', 'hours', 'image', 'category']
      })
      .all();

    console.log(`✅ Found ${records.length} amenities`);

    return records.map((record) => ({
      id: record.id,
      name: record.get('name') as string || '',
      slug: record.get('slug') as string | undefined,
      description: record.get('description') as string || '',
      hours: record.get('hours') as string | undefined,
      image: record.get('image') as string[] | undefined,        // ← Attachment
      category: record.get('category') as string | undefined,
    }));
  } catch (error: any) {
    console.error('❌ Error fetching amenities:', error.message);
    return [];
  }
}

export async function getAmenityBySlug(slug: string): Promise<Amenity | null> {
  try {
    if (!base) return null;

    const records = await base('Amenities')
      .select({
        filterByFormula: `{slug} = '${slug}'`,
        fields: ['name', 'slug', 'description', 'hours', 'image', 'category']
      })
      .firstPage();

    if (records.length === 0) return null;

    const record = records[0];
    return {
      id: record.id,
      name: record.get('name') as string || '',
      slug: record.get('slug') as string | undefined,
      description: record.get('description') as string || '',
      hours: record.get('hours') as string | undefined,
      image: record.get('image') as string[] | undefined,
      category: record.get('category') as string | undefined,
    };
  } catch (error: any) {
    console.error('❌ Error fetching amenity by slug:', error.message);
    return null;
  }
}

// Documents - DEBUG VERSION
// Documents - Using Attachment Field
export async function getAllDocuments(): Promise<Document[]> {
  try {
    if (!base) {
      console.error('❌ Airtable base is null for Documents');
      return [];
    }

    const records = await base('Documents')
      .select({
        sort: [{ field: 'updated_date', direction: 'desc' }],
        fields: ['title', 'document', 'category', 'updated_date']
      })
      .all();

    console.log(`✅ Found ${records.length} documents`);

    return records.map((record) => {
      const attachments = record.get('document') as any[] | undefined;
      
      const firstAttachment = attachments && attachments.length > 0 
        ? attachments[0] 
        : null;

      return {
        id: record.id,
        title: record.get('title') as string || 'Untitled Document',
        document: attachments || [],           // Full attachment array
        category: record.get('category') as string | undefined,
        updated_date: record.get('updated_date') as string | undefined,
        // Optional: direct download URL for convenience
        url: firstAttachment ? firstAttachment.url : '',
      };
    });
  } catch (error: any) {
    console.error('❌ Error fetching documents:', error.message);
    return [];
  }
}

// ==================== EVENTS ====================

export async function getAllEvents(): Promise<Event[]> {
  try {
    if (!base) {
      console.error('❌ Airtable base is null for Events');
      return [];
    }

    const records = await base('Events')
      .select({
        sort: [{ field: 'Event Date', direction: 'asc' }],
        fields: [
          'Event Name', 'Event Date', 'End Date', 'Description', 'Location', 
          'Status', 'Banner Image', 'Event Category',
          'Tier 1 Name', 'Tier 1 Price', 'Tier 1 Benefits',
          'Tier 2 Name', 'Tier 2 Price', 'Tier 2 Benefits',
          'Tier 3 Name', 'Tier 3 Price', 'Tier 3 Benefits',
          'Sponsor Application Link'
        ]
      })
      .all();

    console.log(`✅ Found ${records.length} events`);

    return records.map((record) => ({
      id: record.id,
      'Event Name': record.get('Event Name') as string || '',
      'Event Date': record.get('Event Date') as string || '',
      'End Date': record.get('End Date') as string | undefined,
      Description: record.get('Description') as string || '',
      Location: record.get('Location') as string | undefined,
      Status: record.get('Status') as string | undefined,
      'Banner Image': record.get('Banner Image') as string[] | undefined,
      'Event Category': record.get('Event Category') as string | undefined,
      'Tier 1 Name': record.get('Tier 1 Name') as string | undefined,
      'Tier 1 Price': record.get('Tier 1 Price') as number | undefined,
      'Tier 1 Benefits': record.get('Tier 1 Benefits') as string | undefined,
      'Tier 2 Name': record.get('Tier 2 Name') as string | undefined,
      'Tier 2 Price': record.get('Tier 2 Price') as number | undefined,
      'Tier 2 Benefits': record.get('Tier 2 Benefits') as string | undefined,
      'Tier 3 Name': record.get('Tier 3 Name') as string | undefined,
      'Tier 3 Price': record.get('Tier 3 Price') as number | undefined,
      'Tier 3 Benefits': record.get('Tier 3 Benefits') as string | undefined,
      'Sponsor Application Link': record.get('Sponsor Application Link') as string | undefined,
    }));
  } catch (error: any) {
    console.error('❌ Error fetching events:', error.message);
    return [];
  }
}

export async function getUpcomingEvents(limit: number = 5): Promise<Event[]> {
  try {
    if (!base) return [];

    const today = new Date().toISOString().split('T')[0];

    const records = await base('Events')
      .select({
        filterByFormula: `{Event Date} >= '${today}'`,
        sort: [{ field: 'Event Date', direction: 'asc' }],
        maxRecords: limit,
        fields: [
          'Event Name', 'Event Date', 'End Date', 'Description', 'Location', 
          'Status', 'Banner Image', 'Event Category',
          'Tier 1 Name', 'Tier 1 Price', 'Tier 1 Benefits',
          'Tier 2 Name', 'Tier 2 Price', 'Tier 2 Benefits',
          'Tier 3 Name', 'Tier 3 Price', 'Tier 3 Benefits',
          'Sponsor Application Link'
        ]
      })
      .all();

    console.log(`✅ Found ${records.length} upcoming events`);

    return records.map((record) => ({
      id: record.id,
      'Event Name': record.get('Event Name') as string || '',
      'Event Date': record.get('Event Date') as string || '',
      'End Date': record.get('End Date') as string | undefined,
      Description: record.get('Description') as string || '',
      Location: record.get('Location') as string | undefined,
      Status: record.get('Status') as string | undefined,
      'Banner Image': record.get('Banner Image') as string[] | undefined,
      'Event Category': record.get('Event Category') as string | undefined,
      'Tier 1 Name': record.get('Tier 1 Name') as string | undefined,
      'Tier 1 Price': record.get('Tier 1 Price') as number | undefined,
      'Tier 1 Benefits': record.get('Tier 1 Benefits') as string | undefined,
      'Tier 2 Name': record.get('Tier 2 Name') as string | undefined,
      'Tier 2 Price': record.get('Tier 2 Price') as number | undefined,
      'Tier 2 Benefits': record.get('Tier 2 Benefits') as string | undefined,
      'Tier 3 Name': record.get('Tier 3 Name') as string | undefined,
      'Tier 3 Price': record.get('Tier 3 Price') as number | undefined,
      'Tier 3 Benefits': record.get('Tier 3 Benefits') as string | undefined,
      'Sponsor Application Link': record.get('Sponsor Application Link') as string | undefined,
    }));
  } catch (error: any) {
    console.error('❌ Error fetching upcoming events:', error.message);
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    if (!base) return null;

    // Fetch the main event
    const eventRecords = await base('Events')
      .select({
        fields: [
          'Event Name', 'Event Date', 'End Date', 'Description', 'Location', 
          'Status', 'Banner Image', 'Event Category', 'Sponsor Application Link'
        ]
      })
      .all();

    const matchedRecord = eventRecords.find(record => {
      const eventName = (record.get('Event Name') as string || '').trim();
      const generatedSlug = eventName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      return generatedSlug === slug;
    });

    if (!matchedRecord) return null;

    const record = matchedRecord;
    const eventName = (record.get('Event Name') as string || '').replace(/'/g, "\\'");

    const event: Event = {
      id: record.id,
      'Event Name': record.get('Event Name') as string || '',
      'Event Date': record.get('Event Date') as string || '',
      'End Date': record.get('End Date') as string | undefined,
      Description: record.get('Description') as string || '',
      Location: record.get('Location') as string | undefined,
      Status: record.get('Status') as string | undefined,
      'Banner Image': record.get('Banner Image') as string[] | undefined,
      'Event Category': record.get('Event Category') as string | undefined,
      'Sponsor Application Link': record.get('Sponsor Application Link') as string | undefined,
      sponsors: []
    };

    // Fetch sponsors linked to THIS event only
    try {
      const sponsorRecords = await base('Sponsor Requests')
  .select({
    filterByFormula: `AND(FIND('${eventName}', ARRAYJOIN({Event})), {Payment Received} = 1)`,
    fields: [
      'Sponsor Name / Business',
      'Brand Name',
      'Contact Name',
      'Contact Email',
      'Contact Phone',
      'Logo',
      'Address',
    ]
  })
  .all();

event.sponsors = sponsorRecords.map((sr: any): Sponsor => ({
  id: sr.id,
  'Sponsor Name / Business': sr.get('Sponsor Name / Business') as string || '',
  'Brand Name': sr.get('Brand Name') as string | undefined,
  'Contact Name': sr.get('Contact Name') as string | undefined,
  'Contact Email': sr.get('Contact Email') as string | undefined,
  'Contact Phone': sr.get('Contact Phone') as string | undefined,
  Logo: sr.get('Logo') as AirtableAttachment[] | undefined,
  
  'Payment Received': true,
}));

    } catch (sponsorError: any) {
      console.warn('⚠️ Could not load sponsors for this event:', sponsorError.message);
      event.sponsors = [];
    }

    return event;

  } catch (error: any) {
    console.error('❌ Error fetching event by slug:', error.message);
    return null;
  }
}

// Gallery
export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  try {
    if (!base) {
      console.error('❌ Airtable base is null for Gallery');
      return [];
    }

    const records = await base('Gallery')
      .select({
        sort: [{ field: 'order', direction: 'asc' }],
        fields: ['title', 'image', 'category', 'order']
      })
      .all();

    console.log(`✅ Found ${records.length} gallery images`);

    return records.map((record) => ({
      id: record.id,
      title: record.get('title') as string || 'Untitled',
      image: record.get('image') as string[] | undefined,     // ← Attachment field
      category: record.get('category') as string | undefined,
      order: record.get('order') as number | undefined,
    }));
  } catch (error: any) {
    console.error('❌ Error fetching gallery images:', error.message);
    return [];
  }
}


// Contacts
export async function getAllContacts(): Promise<Contact[]> {
  try {
    if (!base) {
      console.error('❌ Airtable base is null for Contacts');
      return [];
    }

    const records = await base('Contacts')
      .select({
        sort: [{ field: 'order', direction: 'asc' }, { field: 'type', direction: 'asc' }],
        fields: [
          'type', 
          'name', 
          'role', 
          'phone', 
          'secondary_phone',      // New
          'after_hours_phone',    // New
          'email', 
          'address', 
          'hours',
          'note', 
          'website', 
          'is_important'
        ]
      })
      .all();

    console.log(`✅ Found ${records.length} contacts`);

    return records.map((record) => ({
      id: record.id,
      type: record.get('type') as any || 'general',
      name: record.get('name') as string | undefined,
      role: record.get('role') as string | undefined,
      phone: record.get('phone') as string | undefined,
      secondary_phone: record.get('secondary_phone') as string | undefined,
      after_hours_phone: record.get('after_hours_phone') as string | undefined,
      email: record.get('email') as string | undefined,
      address: record.get('address') as string | undefined,
      hours: record.get('hours') as string | undefined,
      note: record.get('note') as string | undefined,
      website: record.get('website') as string | undefined,
      is_important: record.get('is_important') as boolean | undefined,
    }));
  } catch (error: any) {
    console.error('❌ Error fetching contacts:', error.message);
    return [];
  }
}

export async function getContactsByType(type: string): Promise<Contact[]> {
  try {
    if (!base) return []
    const records = await base('Contacts')
      .select({
        filterByFormula: `{type} = '${type}'`,
      })
      .all()
    return records.map((record) => transformRecord<Contact>(record))
  } catch (error) {
    console.error('Error fetching contacts by type:', error)
    return []
  }
}

// Meeting Minutes
export async function getAllMeetingMinutes(): Promise<MeetingMinutes[]> {
  try {
    if (!base) {
      console.error('❌ Airtable base is null for MeetingMinutes');
      return [];
    }

    const records = await base('MeetingMinutes')
      .select({
        sort: [{ field: 'date', direction: 'desc' }],
        fields: [
          'title', 
          'slug', 
          'date', 
          'summary', 
          'attendees', 
          'topics_discussed', 
          'decisions_made', 
          'action_items', 
          'document_url'
        ]
      })
      .all();

    console.log(`✅ Found ${records.length} meeting minutes`);

    return records.map((record) => ({
      id: record.id,
      title: record.get('title') as string || '',
      slug: record.get('slug') as string || '',
      date: record.get('date') as string || '',
      summary: record.get('summary') as string || '',
      attendees: record.get('attendees') as string | undefined,
      topics_discussed: record.get('topics_discussed') as string | undefined,
      decisions_made: record.get('decisions_made') as string | undefined,
      action_items: record.get('action_items') as string | undefined,
      document_url: record.get('document_url') as string | undefined,
    }));
  } catch (error: any) {
    console.error('❌ Error fetching meeting minutes:', error.message);
    return [];
  }
}

export async function getMeetingMinutesBySlug(
  slug: string
): Promise<MeetingMinutes | null> {
  try {
    if (!base) return null;

    const records = await base('MeetingMinutes')
      .select({
        filterByFormula: `{slug} = '${slug}'`,
        fields: [
          'title', 
          'slug', 
          'date', 
          'summary', 
          'attendees', 
          'topics_discussed', 
          'decisions_made', 
          'action_items', 
          'document_url'
        ]
      })
      .firstPage();

    if (records.length === 0) return null;

    const record = records[0];
    return {
      id: record.id,
      title: record.get('title') as string || '',
      slug: record.get('slug') as string || '',
      date: record.get('date') as string || '',
      summary: record.get('summary') as string || '',
      attendees: record.get('attendees') as string | undefined,
      topics_discussed: record.get('topics_discussed') as string | undefined,
      decisions_made: record.get('decisions_made') as string | undefined,
      action_items: record.get('action_items') as string | undefined,
      document_url: record.get('document_url') as string | undefined,
    };
  } catch (error: any) {
    console.error('❌ Error fetching meeting minutes by slug:', error.message);
    return null;
  }
}

// Form Submissions
export async function submitContactForm(data: {
  name: string
  email: string
  phone?: string
  message: string
}): Promise<boolean> {
  try {
    if (!base) {
      console.error('❌ Airtable base is null');
      return false;
    }

    await base('ContactSubmissions').create([
      {
        fields: {
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          message: data.message,
          // Do NOT include submitted_date — let Airtable handle it
        }
      }
    ]);

    console.log('✅ Contact form submitted successfully to Airtable');
    return true;
  } catch (error: any) {
    console.error('❌ Error submitting contact form:', error.message);
    return false;
  }
}


// FAQs
export async function getAllFAQs(): Promise<FAQ[]> {
  try {
    if (!base) {
      console.error('❌ Airtable base is null for FAQs');
      return [];
    }

    const records = await base('FAQs')
      .select({
        sort: [{ field: 'Order', direction: 'asc' }],
        fields: ['Question', 'Answer', 'Category', 'Order']
      })
      .all();

    console.log(`✅ Found ${records.length} FAQs`);

    return records.map((record) => ({
      id: record.id,
      Question: record.get('Question') as string || '',
      Answer: record.get('Answer') as string || '',
      Category: record.get('Category') as string | undefined,
      Order: record.get('Order') as number | undefined,
    }));
  } catch (error: any) {
    console.error('❌ Error fetching FAQs:', error.message);
    return [];
  }
}

// Create Document Access Request (for email option)
export async function createDocumentAccessRequest(email: string): Promise<boolean> {
  try {
    if (!base) return false;

    await base('Document Access Requests').create([
      {
        fields: {
          Email: email.trim(),
          Status: 'Pending',
          'Code Sent': false,
        }
      }
    ]);

    console.log(`✅ Access request created for ${email}`);
    return true;
  } catch (error: any) {
    console.error('❌ Error creating access request:', error.message);
    return false;
  }
}