# Grand Mission HOA Website - Airtable Setup Guide

This website is a premium, luxury residential community portal fully powered by Airtable as a headless CMS. The site features an elegant design with premium typography, sophisticated color palette, and beautiful imagery showcasing your community.

## Design Features

- **Premium Typography**: Serif headings (Playfair Display) paired with clean sans-serif body text
- **Luxury Color Palette**: Deep navy primary, warm gold accents, sage green secondary
- **Full-Image Hero Section**: Uses `/images/tower.jpg` featuring the Grand Mission entrance
- **Community Showcase**: 4-image grid displaying Resort-Style Living, Amenities, Water Park, and Homes
- **Responsive Design**: Mobile-first approach optimized for all devices
- **Smooth Animations**: Subtle Framer Motion effects throughout
- **Professional Footer**: Dark navy footer with white text and accent colors

Follow these steps to set up your content:

## Step 1: Create Your Airtable Base

1. Go to [airtable.com](https://airtable.com) and sign in to your account
2. Create a new base called "Grand Mission HOA"
3. Create the following tables with the specified fields:

### Table 1: SiteSettings
Used for global site content like hero text and welcome message.

**Fields:**
- `hero_title` (Single line text) - Main headline for hero section
- `hero_subtitle` (Single line text) - Subheading for hero section
- `welcome_text` (Long text) - Text for "About Our Community" section
- `logo_url` (URL) - Optional logo URL
- `club_hours` (Single line text) - Operating hours

**Example Data:**
- hero_title: "Welcome to Grand Mission"
- hero_subtitle: "An Upscale Community Featuring World-Class Amenities, Exceptional Architecture & Unparalleled Lifestyle"
- welcome_text: "Grand Mission Homeowners Association is committed to maintaining and enhancing our vibrant community..."
- club_hours: "Mon-Fri: 9am-5pm, Sat: 10am-2pm"

### Table 2: News
Articles and updates for the community.

**Fields:**
- `title` (Single line text) - Article title
- `slug` (Single line text) - URL-friendly slug (e.g., "annual-meeting-2024")
- `excerpt` (Long text) - Short summary of the article
- `content` (Long text) - Full article content
- `image_url` (URL) - Article feature image
- `published_date` (Date) - Publication date
- `author` (Single line text) - Author name (optional)

### Table 3: Amenities
Community facilities and features.

**Fields:**
- `name` (Single line text) - Amenity name (e.g., "Tennis Courts")
- `slug` (Single line text) - URL-friendly slug
- `description` (Long text) - Detailed description
- `category` (Single line text) - Category (e.g., "Sports", "Recreation")
- `image_url` (URL) - Amenity photo
- `hours` (Single line text) - Operating hours

### Table 4: Documents
PDFs, forms, and important documents.

**Fields:**
- `title` (Single line text) - Document name
- `url` (URL) - Link to PDF or document
- `category` (Single line text) - Category (e.g., "Bylaws", "Forms", "Finance")
- `updated_date` (Date) - Last updated date

### Table 5: Events
Upcoming community events and activities.

**Fields:**
- `title` (Single line text) - Event name
- `date` (Date) - Event date
- `description` (Long text) - Event details
- `location` (Single line text) - Where the event takes place
- `image_url` (URL) - Event image

### Table 6: Gallery
Photo gallery for community photos.

**Fields:**
- `title` (Single line text) - Photo title
- `image_url` (URL) - Photo URL
- `category` (Single line text) - Category (e.g., "Amenities", "Events", "Community")
- `order` (Number) - Display order

### Table 7: Contacts
Important contact information.

**Fields:**
- `type` (Single select with options: "clubhouse", "management", "emergency")
- `name` (Single line text) - Contact name
- `phone` (Phone number) - Phone number
- `email` (Email) - Email address
- `address` (Long text) - Mailing address
- `hours` (Single line text) - Hours available

### Table 8: MeetingMinutes
HOA meeting minutes and summaries for resident access.

**Fields:**
- `title` (Single line text) - Meeting title (e.g., "March 2024 Board Meeting")
- `slug` (Single line text) - URL-friendly identifier (e.g., "march-2024-board")
- `date` (Date) - Meeting date
- `summary` (Long text) - Meeting summary and overview
- `attendees` (Single line text) - Names of attendees
- `topics_discussed` (Long text) - Topics discussed (separate with |)
- `decisions_made` (Long text) - Key decisions (separate with |)
- `action_items` (Long text) - Action items and responsible parties (separate with |)
- `document_url` (URL) - Link to full meeting minutes PDF

**Example Data:**
```
title: "March 2024 Board Meeting"
slug: "march-2024-board"
date: 2024-03-15
summary: "Discussed Q1 financials, approved annual budget, reviewed landscaping proposals..."
attendees: "John Smith, Jane Doe, Bob Johnson, Sarah Wilson"
topics_discussed: "Q1 Financials|Landscaping Improvements|Community Events Planning"
decisions_made: "Approved $50,000 landscaping budget|Scheduled summer pool maintenance"
action_items: "John to contact landscape contractors|Jane to schedule pool inspection"
```

### Table 9: ContactSubmissions (Auto-created)
Stores form submissions from the contact form.

**Fields:**
- `name` (Single line text)
- `email` (Email)
- `phone` (Phone number)
- `message` (Long text)
- `submitted_date` (Created time)

## Step 2: Get Your API Credentials

1. Go to your Airtable account settings
2. Click "Developers" → "API keys"
3. Create a new API key (or use an existing personal access token)
4. Copy your **API Key** or **Personal Access Token**
5. Go to your base and copy the **Base ID** from the URL (format: `appXXXXXXXXXXXXXX`)

## Step 3: Add Environment Variables

Add these to your Vercel project or `.env.local` file:

```
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=your_base_id_here
```

## Step 4: Add Your Images

You have 6 image placeholders ready in the code:

1. **Hero image** (`/public/images/hero.jpg`) - Main banner image for home page
2. **Amenity images** (referenced in Amenities table) - Add URLs to Airtable

Simply upload your images and add the URLs to the corresponding Airtable fields.

## Step 5: Customize Your Content

1. Log into Airtable
2. Add your community information to each table
3. The website will automatically fetch and display all content
4. Changes in Airtable will appear on the site within seconds

## Tips for Success

- **Use clear, descriptive titles and text** - This is what your residents will see
- **Keep images optimized** - Use JPG/PNG and keep file sizes under 2MB
- **Update regularly** - Keep news, events, and amenities current
- **Organize with categories** - Use the category field to organize content
- **Set proper dates** - Events and news use dates for sorting

## Images

Your website comes with 6 premium community images stored in `/public/images/`:

- **tower.jpg** - Grand Mission entrance tower (used in hero section)
- **aerial-community.jpg** - Aerial view of the community with amenities
- **amenities.jpg** - Community amenities and recreation areas
- **water-slides.jpg** - Water park facilities
- **aerial-homes.jpg** - Luxury homes in the community
- **monument.jpg** - Grand Mission monument landmark

These images are automatically used throughout the home page in the "Experience Grand Mission" showcase section. You can replace them with your own images while maintaining the same filenames, or update references in the page code.

## Website Features

Your website includes:

✓ **Premium Home Page** - Full-bleed hero with tower image, 4-image community showcase, stats section, news highlights, amenities grid, events list, and luxury CTA section
✓ **News Section** - Beautiful article cards with image overlays, list view and individual article pages
✓ **Amenities** - Elegant directory of community facilities with category badges and details
✓ **Events** - Upcoming community events with calendar integration
✓ **Gallery** - Photo showcase of your community
✓ **Documents** - Important PDFs and forms organized by category
✓ **Contacts** - Directory of key contacts and HOA information
✓ **Premium Design** - Serif typography, luxury color palette, smooth animations
✓ **Responsive Design** - Works beautifully on mobile, tablet, and desktop
✓ **Fast Loading** - Optimized for performance with image lazy-loading

## Troubleshooting

**"Configuration Needed" error appears?**
- Make sure `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` are set in your environment variables
- Verify the Base ID is correct (starts with `app`)

**Content not showing?**
- Check that your Airtable tables have the exact field names listed above
- Make sure your records have data in the required fields
- Wait 10-15 seconds for the page to reload with new data

**Images not displaying?**
- Ensure URLs in Airtable point to publicly accessible images
- Check that image URLs include the protocol (https://)

## Support

For help with Airtable:
- Visit [Airtable Support](https://support.airtable.com)
- Check the [Airtable API Documentation](https://airtable.com/developers/web/api)

For help with this website:
- Review the code in `/lib/airtable.ts` for API integration details
- Check component files in `/components` for styling and layout

---

**Next Steps:**
1. Create your Airtable base with the tables above
2. Add sample content to test
3. Set environment variables
4. Deploy to Vercel and share with residents!
