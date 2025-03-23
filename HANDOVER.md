# ArtStore Project Handover Document

## Project Overview
ArtStore is a digital art marketplace platform built with Next.js, TypeScript, and Supabase. The platform allows artists to sell their artwork and buyers to purchase and collect digital art.

## Tech Stack
- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage

## Database Structure

### Core Tables
1. **profiles**
   - Base user information
   - Contains role-based access control
   - Fields: id, email, username, full_name, avatar_url, bio, website, role, is_verified

2. **buyer_profiles**
   - Buyer-specific information
   - Fields: favorite_artists, purchase_history, saved_artworks

3. **seller_profiles**
   - Seller-specific information
   - Fields: artist_bio, portfolio_url, social_links, total_sales, total_revenue

4. **artworks**
   - Artwork listings
   - Fields: title, description, price, image_url, category, tags, license_options, user_id

### Supporting Tables
- **follows**: Artist following relationships
- **sales**: Purchase transactions
- **likes**: Artwork likes
- **comments**: Artwork comments
- **cart_items**: Shopping cart items
- **invitations**: Admin-created user invitations

## Authentication & Authorization

### User Roles
1. **buyer**
   - Can purchase artwork
   - Can follow artists
   - Can like and comment on artwork
   - Can save artworks to favorites

2. **seller**
   - Can upload and manage artwork
   - Can receive payments
   - Has seller-specific profile
   - Can manage portfolio

3. **admin**
   - Full system access
   - Can manage users and content
   - Can create invitations

### Auth Flow
1. **Sign Up**
   - User selects role (buyer/seller)
   - Auth user created with role metadata
   - Database trigger creates base profile
   - Role-specific profile created
   - Email verification required

2. **Sign In**
   - Email/password authentication
   - Role-based access control
   - Session management via Supabase

## Known Issues & Development Quirks

### Database
1. **Profile Creation**
   - There's a race condition between auth user creation and profile creation
   - Added 1-second delay in signup process to handle this
   - Database trigger acts as fallback for profile creation

2. **Role Management**
   - Role changes require both auth metadata and profile updates
   - Role-specific profile tables must be manually created/deleted

### Authentication
1. **Session Management**
   - Supabase session tokens expire after 1 hour
   - Refresh token handling is automatic
   - Profile data is fetched on session refresh

2. **Profile Data**
   - Profile data is fetched separately from auth data
   - Fallback to basic user data if profile fetch fails
   - Role-specific data is loaded on demand

### Frontend
1. **State Management**
   - Auth context handles both auth and profile state
   - Profile updates require manual state refresh
   - Role changes require page reload

2. **File Upload**
   - Artwork images are stored in Supabase Storage
   - Thumbnails are generated automatically
   - File size limits: 5MB for images

## Development Guidelines

### Code Structure
1. **Components**
   - Located in `src/components`
   - Follow atomic design principles
   - Use TypeScript for type safety

2. **Pages**
   - Located in `src/pages`
   - Use Next.js App Router
   - Implement proper loading states

3. **Context**
   - Located in `src/contexts`
   - Handle global state
   - Implement proper cleanup

### Database Operations
1. **Queries**
   - Use Supabase client for all database operations
   - Implement proper error handling
   - Use RLS policies for security

2. **Migrations**
   - Run migrations in Supabase SQL editor
   - Test migrations in development first
   - Backup data before production migrations

### Security Considerations
1. **RLS Policies**
   - All tables have RLS enabled
   - Policies are role-based
   - Test policies thoroughly

2. **File Access**
   - Storage buckets have proper policies
   - File URLs are signed when needed
   - Implement proper file type validation

## Future Improvements
1. **Performance**
   - Implement proper caching
   - Optimize image loading
   - Add pagination for lists

2. **Features**
   - Add payment processing
   - Implement artwork licensing
   - Add artist verification

3. **User Experience**
   - Improve error handling
   - Add loading states
   - Implement proper form validation

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run development server: `npm run dev`

## Important Notes
1. Always test role-based features thoroughly
2. Monitor database trigger execution
3. Keep track of RLS policy changes
4. Document any new features or changes
5. Test file uploads with various formats
6. Verify email verification flow
7. Check profile creation in all scenarios

## Support
For any issues or questions:
1. Check the Supabase dashboard for database issues
2. Review the browser console for frontend errors
3. Check the server logs for backend issues
4. Consult the documentation for implementation details 