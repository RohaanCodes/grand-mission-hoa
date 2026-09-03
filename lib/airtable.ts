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
  DocumentAccessRequest,
  RequestCategory,
  ServiceRequestInput,
  ServiceRequest,
  ResidentProfile,
  BoardMember,
  RequestQuery,
  FAQ
} from './types'
import { verifyAndResolveMapsLink, extractCoordsFromMapsLink } from './mapUtils'


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
      slug: record.get('slug') as string || '',
      description: record.get('description') as string || '',
      hours: record.get('hours') as string | undefined,
      image: record.get('image') as AirtableAttachment[] | undefined,
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
      slug: record.get('slug') as string || '',
      description: record.get('description') as string || '',
      hours: record.get('hours') as string | undefined,
      image: record.get('image') as AirtableAttachment[] | undefined,
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


export async function getRequestCategories(): Promise<RequestCategory[]> {
  try {
    if (!base) return [];

    const records = await base('Request Categories')
      .select({
        fields: ['Category Name'],
      })
      .all();

    return records.map((record) => ({
      id: record.id,
      category_name: (record.get('Category Name') as string) || '',
    }));
  } catch (error: any) {
    console.error('❌ Error fetching request categories:', error.message);
    return [];
  }
}

export async function submitServiceRequest(
  data: ServiceRequestInput,
  submittedVia: string = 'Resident'
): Promise<boolean> {
  try {
    if (!base) return false

    const fields: any = {
      'Requester Name': data.requesterName,
      'Requester Email': data.requesterEmail,
      'Unit / Address': data.unitAddress,
      Phone: data.phone || '',
      'Category (Resident Selected)': data.category || 'Not Sure / Let System Decide',
      Description: data.description,
      'Submitted Via': submittedVia,
    }

    if (data.locationLink) {
  const { verified, resolvedUrl } = await verifyAndResolveMapsLink(data.locationLink)
  if (verified && resolvedUrl) {
    fields['Location Link'] = resolvedUrl
    const coords = await extractCoordsFromMapsLink(data.locationLink)
    if (coords) {
      fields['Latitude'] = coords.lat
      fields['Longitude'] = coords.lng
    }
  }
  // if not verified, the link is silently dropped, nothing is stored
}

    await base('Service Requests').create([{ fields }])
    return true
  } catch (error: any) {
    console.error('❌ Error submitting service request:', error.message)
    return false
  }
}

export async function getResidentByAccessToken(token: string): Promise<ResidentProfile | null> {
  try {
    if (!base || !token) return null;

    const records = await base('Resident Profiles')
      .select({
        filterByFormula: `{Access Token} = '${token.replace(/'/g, "\\'")}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) return null;

    const record = records[0];
    return {
      id: record.id,
      resident_name: (record.get('Resident Name') as string) || '',
      email: (record.get('Email') as string) || '',
      unit_address: record.get('Unit / Address') as string | undefined,
      phone: record.get('Phone') as string | undefined,
      profile_status: record.get('Profile Status') as any,
      access_token: record.get('Access Token') as string | undefined,
    };
  } catch (error: any) {
    console.error('❌ Error looking up resident by token:', error.message);
    return null;
  }
}

export async function getRequestsByResidentEmail(email: string): Promise<ServiceRequest[]> {
  try {
    if (!base || !email) return [];

    const records = await base('Service Requests')
      .select({
        filterByFormula: `LOWER({Requester Email}) = LOWER('${email.replace(/'/g, "\\'")}')`,
        sort: [{ field: 'Submitted Date', direction: 'desc' }],
      })
      .all();

    return records.map((record) => {
      const statusValue = record.get('Status') as any;
      return {
        id: record.id,
        requester_name: (record.get('Requester Name') as string) || '',
        requester_email: (record.get('Requester Email') as string) || '',
        unit_address: record.get('Unit / Address') as string | undefined,
        phone: record.get('Phone') as string | undefined,
        category_resident_selected: record.get('Category (Resident Selected)') as string | undefined,
        final_category: record.get('Final Category') as string | undefined,
        description: (record.get('Description') as string) || '',
        status: typeof statusValue === 'object' ? statusValue?.name : statusValue,
        next_follow_up_date: record.get('Next Follow-up Date') as string | undefined,
        submitted_date: record.get('Submitted Date') as string | undefined,
        last_updated: record.get('Last Updated') as string | undefined,
      };
    });
  } catch (error: any) {
    console.error('❌ Error fetching requests for resident:', error.message);
    return [];
  }
}


export async function createLoginRequest(email: string): Promise<boolean> {
  try {
    if (!base) {
      console.error('❌ Airtable base is null');
      return false;
    }

    await base('Login Requests').create([
      {
        fields: {
          Email: email.trim(),
        },
      },
    ]);

    console.log('✅ Login request created');
    return true;
  } catch (error: any) {
    console.error('❌ Error creating login request:', error.message);
    return false;
  }
}


export async function generateBoardMagicLink(email: string): Promise<{ token: string; recordId: string; name: string } | null> {
  try {
    if (!base) return null
    console.log('DEBUG base exists:', !!base)
    const records = await base('Board Members')
      .select({
        filterByFormula: `LOWER({Email}) = LOWER('${email.replace(/'/g, "\\'")}')`,
        maxRecords: 1,
      })
      .firstPage()

    if (records.length === 0) return null

    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    await base('Board Members').update([
      {
        id: records[0].id,
        fields: {
          'Magic Link Token': token,
          'Magic Link Expires At': expiresAt,
        },
      },
    ])

    return { token, recordId: records[0].id, name: (records[0].get('Board Member Name') as string) || '' }
  } catch (error: any) {
    console.error('❌ Error generating board magic link:', error.message)
    return null
  }
}

export async function getBoardMemberByToken(token: string): Promise<BoardMember | null> {
  try {
    if (!base || !token) return null

    const records = await base('Board Members')
      .select({
        filterByFormula: `{Magic Link Token} = '${token.replace(/'/g, "\\'")}'`,
        maxRecords: 1,
      })
      .firstPage()

    if (records.length === 0) return null

    const record = records[0]
    const expiresAt = record.get('Magic Link Expires At') as string | undefined
    if (!expiresAt || new Date(expiresAt) < new Date()) return null

    // single-use: clear immediately after successful validation
    await base('Board Members').update([
      { id: record.id, fields: { 'Magic Link Token': '', 'Magic Link Expires At': null } },
    ])

    return {
      id: record.id,
      name: (record.get('Board Member Name') as string) || '',
      email: (record.get('Email') as string) || '',
      phone: record.get('Phone') as string | undefined,
      role: record.get('Role') as string | undefined,
    }
  } catch (error: any) {
    console.error('❌ Error validating board token:', error.message)
    return null
  }
}


export async function getAllServiceRequests(includePrivateNotes: boolean = false): Promise<ServiceRequest[]> {
  try {
    if (!base) return []
    const records = await base('Service Requests')
      .select({ sort: [{ field: 'Submitted Date', direction: 'desc' }] })
      .all()
    return records.map((record) => {
      const statusValue = record.get('Status') as any
      return {
        id: record.id,
        requester_name: (record.get('Requester Name') as string) || '',
        requester_email: (record.get('Requester Email') as string) || '',
        unit_address: record.get('Unit / Address') as string | undefined,
        phone: record.get('Phone') as string | undefined,
        category_resident_selected: record.get('Category (Resident Selected)') as string | undefined,
        final_category: record.get('Final Category') as string | undefined,
        description: (record.get('Description') as string) || '',
        status: typeof statusValue === 'object' ? statusValue?.name : statusValue,
        next_follow_up_date: record.get('Next Follow-up Date') as string | undefined,
        submitted_date: record.get('Submitted Date') as string | undefined,
        last_updated: record.get('Last Updated') as string | undefined,
        submitted_via: (record.get('Submitted Via') as any)?.name || record.get('Submitted Via') as string | undefined,
        request_id_number: record.get('Request ID') as number | undefined,
        private_notes: includePrivateNotes ? (record.get('Management Private Notes') as string | undefined) : undefined,
        proposed_solution: record.get('Management Proposed Solution') as string | undefined,
        estimated_cost: record.get('Estimated Cost') as string | undefined,
        management_due_date: record.get('Management Due Date') as string | undefined,
        location_link: record.get('Location Link') as string | undefined,
        closed_date: record.get('Closed Date') as string | undefined, 
        
      }
    })
  } catch (error: any) {
    console.error('❌ Error fetching all service requests:', error.message)
    return []
  }
}

export async function updatePrivateNote(requestId: string, notes: string): Promise<boolean> {
  try {
    if (!base) return false
    await base('Service Requests').update([{ id: requestId, fields: { 'Management Private Notes': notes } }])
    return true
  } catch { return false }
}

export async function getBoardMemberById(recordId: string): Promise<BoardMember | null> {
  try {
    if (!base || !recordId) return null
    const record = await base('Board Members').find(recordId)
    return {
      id: record.id,
      name: (record.get('Board Member Name') as string) || '',
      email: (record.get('Email') as string) || '',
      phone: record.get('Phone') as string | undefined,
      role: record.get('Role') as string | undefined,
    }
  } catch {
    return null
  }
}

export async function generateManagementMagicLink(email: string) {
  try {
    if (!base) return null
    const records = await base('Management Companies')
      .select({ filterByFormula: `LOWER({Contact Email}) = LOWER('${email.replace(/'/g, "\\'")}')`, maxRecords: 1 })
      .firstPage()
    if (records.length === 0) return null

    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
    await base('Management Companies').update([
      { id: records[0].id, fields: { 'Magic Link Token': token, 'Magic Link Expires At': expiresAt } },
    ])
    return { token, name: (records[0].get('Company Name') as string) || '' }
  } catch { return null }
}

export async function getManagementByToken(token: string) {
  try {
    if (!base || !token) return null
    const records = await base('Management Companies')
      .select({ filterByFormula: `{Magic Link Token} = '${token.replace(/'/g, "\\'")}'`, maxRecords: 1 })
      .firstPage()
    if (records.length === 0) return null
    const record = records[0]
    const expiresAt = record.get('Magic Link Expires At') as string | undefined
    if (!expiresAt || new Date(expiresAt) < new Date()) return null
    await base('Management Companies').update([
      { id: record.id, fields: { 'Magic Link Token': '', 'Magic Link Expires At': null } },
    ])
    return { id: record.id, name: (record.get('Company Name') as string) || '', email: (record.get('Contact Email') as string) || '' }
  } catch { return null }
}

export async function submitManagementRequest(data: {
  requesterName: string
  requesterEmail: string
  category: string
  description: string
  proposedSolution?: string
  dueDate?: string
  estimatedCost?: string
  locationLink?: string
}): Promise<boolean> {
  try {
    if (!base) return false

    const fields: any = {
      'Requester Name': data.requesterName,
      'Requester Email': data.requesterEmail,
      'Category (Resident Selected)': data.category || 'Other',
      Description: data.description,
      'Submitted Via': 'Management Company',
      'Routing Decision': 'Management',
      Status: 'Agent In Progress',
      'Triage Started Date': new Date().toISOString().split('T')[0],
      'Triage Completed Date': new Date().toISOString().split('T')[0],
    }
    if (data.proposedSolution) fields['Management Proposed Solution'] = data.proposedSolution
    if (data.dueDate) fields['Management Due Date'] = data.dueDate
    if (data.estimatedCost) fields['Estimated Cost'] = data.estimatedCost

    if (data.locationLink) {
  const { verified, resolvedUrl } = await verifyAndResolveMapsLink(data.locationLink)
  if (verified && resolvedUrl) {
    fields['Location Link'] = resolvedUrl
    const coords = await extractCoordsFromMapsLink(data.locationLink)
    if (coords) {
      fields['Latitude'] = coords.lat
      fields['Longitude'] = coords.lng
    }
  }
  // if not verified, the link is silently dropped, nothing is stored
}

    await base('Service Requests').create([{ fields }])
    return true
  } catch (error: any) {
    console.error('❌ Error submitting management request:', error.message)
    return false
  }
}

export async function getManagementById(recordId: string) {
  try {
    if (!base || !recordId) return null
    const record = await base('Management Companies').find(recordId)
    return {
      id: record.id,
      name: (record.get('Company Name') as string) || '',
      email: (record.get('Contact Email') as string) || '',
    }
  } catch {
    return null
  }
}

export async function getQueriesForRequest(requestIdNumber: number): Promise<RequestQuery[]> {
  try {
    if (!base) return []
    const records = await base('Request Queries')
      .select({ filterByFormula: `{Request ID Number} = ${requestIdNumber}` })
      .all()
    return records
      .map((r) => ({
        id: r.id,
        queryText: (r.get('Query Text') as string) || '',
        askedByName: (r.get('Asked By Name') as string) || '',
        responseText: r.get('Response Text') as string | undefined,
        answered: !!r.get('Answered'),
        createdTime: r._rawJson.createdTime,
      }))
      .sort((a, b) => new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime())
  } catch { return [] }
}

export async function submitRequestQuery(data: {
  requestIdNumber: number
  queryText: string
  askedByName: string
  askedByEmail: string
}): Promise<boolean> {
  try {
    if (!base) return false
    await base('Request Queries').create([{
      fields: {
        'Request ID Number': data.requestIdNumber,
        'Query Text': data.queryText,
        'Asked By Name': data.askedByName,
        'Asked By Email': data.askedByEmail,
      },
    }])
    return true
  } catch { return false }
}

export async function respondToQuery(queryId: string, responseText: string): Promise<boolean> {
  try {
    if (!base) return false
    await base('Request Queries').update([
      { id: queryId, fields: { 'Response Text': responseText, Answered: true } },
    ])
    return true
  } catch { return false }
}

export async function closeRequest(requestId: string): Promise<boolean> {
  try {
    if (!base) return false
    await base('Service Requests').update([{
      id: requestId,
      fields: { Status: 'Closed', 'Closed Date': new Date().toISOString().split('T')[0] },
    }])
    return true
  } catch { return false }
}


// ============================================================
// PREMIUM FEATURE — Board AI Agent
// These two functions plus the "AI Agent Sessions" Airtable table
// and the "Board AI Agent" automation are the entire backend for
// this feature. To remove the feature: delete these two functions,
// delete the table, delete the automation. Nothing else references
// AI Agent Sessions.
// ============================================================
export async function submitAgentQuery(email: string, prompt: string): Promise<boolean> {
  try {
    if (!base) return false
    const existing = await base('AI Agent Sessions')
      .select({ filterByFormula: `LOWER({Board Member Email}) = LOWER('${email.replace(/'/g, "\\'")}')`, maxRecords: 1 })
      .firstPage()

    if (existing.length > 0) {
      await base('AI Agent Sessions').update([
        { id: existing[0].id, fields: { Prompt: prompt, Response: '', Status: 'Pending' } },
      ])
    } else {
      await base('AI Agent Sessions').create([
        { fields: { 'Board Member Email': email, Prompt: prompt, Status: 'Pending' } },
      ])
    }
    return true
  } catch { return false }
}

export async function getAgentSession(email: string): Promise<AIAgentSession | null> {
  try {
    if (!base) return null
    const records = await base('AI Agent Sessions')
      .select({ filterByFormula: `LOWER({Board Member Email}) = LOWER('${email.replace(/'/g, "\\'")}')`, maxRecords: 1 })
      .firstPage()
    if (records.length === 0) return null
    const statusValue = records[0].get('Status') as any
    return {
      status: (typeof statusValue === 'object' ? statusValue?.name : statusValue) || 'Pending',
      response: records[0].get('Response') as string | undefined,
    }
  } catch { return null }
}