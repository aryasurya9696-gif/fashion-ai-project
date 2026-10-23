
# Complete Deployment Guide for FashionAI Chatbot

## Overview
This guide will help you deploy your FashionAI chatbot application to production with live hosting and database setup.

## Prerequisites
- Node.js 18+ installed
- Git installed
- A hosting platform account (Vercel recommended)
- PostgreSQL database (Supabase recommended)

## Step 1: Prepare Your Project

### 1.1 Environment Setup
Create a `.env.local` file in your project root:

```env
# Database Configuration
POSTGREST_URL=your_postgrest_url_here
POSTGREST_SCHEMA=public
POSTGREST_API_KEY=your_api_key_here

# Next.js Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_secret_key_here

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### 1.2 Build Test
Before deploying, test your build locally:

```bash
npm run build
npm start
```

## Step 2: Database Setup

### 2.1 Create PostgreSQL Database
1. Go to [Supabase](https://supabase.com) and create a new project
2. Note down your database URL and API keys
3. Run the database schema (see `database-setup.sql`)

### 2.2 Configure PostgREST
Your Supabase project automatically provides PostgREST endpoints:
- URL: `https://your-project-id.supabase.co/rest/v1`
- API Key: Found in Project Settings > API

## Step 3: Hosting Options

### Option A: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add all variables from your `.env.local`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Option B: Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**
   - Add in Site Settings > Environment Variables

### Option C: Railway

1. **Connect GitHub Repository**
2. **Add Environment Variables**
3. **Deploy automatically on push**

## Step 4: Domain Configuration

### 4.1 Custom Domain (Optional)
1. Purchase domain from provider (Namecheap, GoDaddy, etc.)
2. Configure DNS settings in your hosting platform
3. Update `NEXTAUTH_URL` environment variable

### 4.2 SSL Certificate
Most hosting platforms provide automatic SSL certificates.

## Step 5: Post-Deployment Checklist

### 5.1 Test All Features
- [ ] Landing page loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard displays user data
- [ ] Chatbot functionality works
- [ ] Database connections are working
- [ ] All pages are accessible

### 5.2 Performance Optimization
- [ ] Enable compression
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Monitor Core Web Vitals

## Step 6: Monitoring and Maintenance

### 6.1 Error Monitoring
Consider adding:
- Sentry for error tracking
- Google Analytics for user analytics
- Uptime monitoring

### 6.2 Database Monitoring
- Monitor database performance
- Set up automated backups
- Monitor API rate limits

## Common Issues and Solutions

### Issue 1: Build Failures
**Problem**: Build fails during deployment
**Solution**: 
- Check TypeScript errors locally
- Ensure all dependencies are in package.json
- Verify environment variables are set

### Issue 2: Database Connection Errors
**Problem**: Cannot connect to database
**Solution**:
- Verify POSTGREST_URL is correct
- Check API key permissions
- Ensure database is accessible from hosting platform

### Issue 3: Authentication Issues
**Problem**: Users cannot login/register
**Solution**:
- Verify NEXTAUTH_URL matches your domain
- Check NEXTAUTH_SECRET is set
- Ensure database tables exist

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **API Keys**: Use environment variables for all API keys
3. **Database**: Enable Row Level Security (RLS) in Supabase
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Configure proper CORS settings

## Performance Tips

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Implement lazy loading for heavy components
3. **Caching**: Configure proper caching strategies
4. **Database**: Use database indexes for better performance

## Support and Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgREST Documentation](https://postgrest.org/en/stable/)

---

**Next Steps**: After successful deployment, test all functionality and monitor for any issues. Your chatbot will automatically track real user data once live!
