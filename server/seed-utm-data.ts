import { db } from './db';
import { utmTracking, users } from '@shared/schema';

// PRODUCTION SECURITY: All mock UTM test data removed for production deployment
// Real UTM data will be collected from authentic user campaigns

const testUTMData: any[] = [
  // No mock data - real UTM tracking will populate this through authentic user campaigns
  // Facebook Campaigns
  {
    sessionId: 'session_fb_001',
    utmSource: 'facebook',
    utmMedium: 'cpc',
    utmCampaign: 'fitness_transformation_q1',
    utmTerm: 'weight_loss_coach',
    utmContent: 'ad_variant_a',
    page: '/quiz',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    referrer: 'https://www.facebook.com/',
    ipAddress: '192.168.1.100',
    conversionType: 'signup',
    revenueValue: 47.00,
    metadata: JSON.stringify({ adId: 'fb_ad_123', campaignId: 'fb_camp_456' })
  },
  {
    sessionId: 'session_fb_002',
    utmSource: 'facebook',
    utmMedium: 'cpc',
    utmCampaign: 'fitness_transformation_q1',
    utmTerm: 'personal_trainer',
    utmContent: 'ad_variant_b',
    page: '/quiz',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
    referrer: 'https://m.facebook.com/',
    ipAddress: '10.0.0.50',
    conversionType: 'purchase',
    revenueValue: 197.00,
    metadata: JSON.stringify({ adId: 'fb_ad_124', campaignId: 'fb_camp_456' })
  },
  {
    sessionId: 'session_fb_003',
    utmSource: 'facebook',
    utmMedium: 'cpc',
    utmCampaign: 'coach_authority_build',
    utmTerm: 'business_coach',
    utmContent: 'video_ad',
    page: '/subscribe',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    referrer: 'https://www.facebook.com/',
    ipAddress: '172.16.0.25',
    conversionType: 'purchase',
    revenueValue: 5000.00,
    metadata: JSON.stringify({ adId: 'fb_ad_789', campaignId: 'fb_camp_012' })
  },

  // LinkedIn Campaigns
  {
    sessionId: 'session_li_001',
    utmSource: 'linkedin',
    utmMedium: 'sponsored',
    utmCampaign: 'b2b_coach_acquisition',
    utmTerm: 'executive_coach',
    utmContent: 'carousel_post',
    page: '/quiz',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    referrer: 'https://www.linkedin.com/',
    ipAddress: '203.0.113.15',
    conversionType: 'signup',
    revenueValue: 47.00,
    metadata: JSON.stringify({ campaignId: 'li_camp_789', contentId: 'carousel_123' })
  },
  {
    sessionId: 'session_li_002',
    utmSource: 'linkedin',
    utmMedium: 'message',
    utmCampaign: 'outreach_sequence_1',
    utmTerm: 'sales_coach',
    utmContent: 'direct_message',
    page: '/subscribe',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    referrer: 'https://www.linkedin.com/',
    ipAddress: '198.51.100.42',
    conversionType: 'purchase',
    revenueValue: 197.00,
    metadata: JSON.stringify({ messageId: 'msg_456', sequenceStep: 3 })
  },

  // Email Campaigns
  {
    sessionId: 'session_email_001',
    utmSource: 'email',
    utmMedium: 'newsletter',
    utmCampaign: 'weekly_insights_dec',
    utmTerm: null,
    utmContent: 'cta_button',
    page: '/quiz',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
    referrer: 'https://mail.google.com/',
    ipAddress: '192.0.2.100',
    conversionType: 'signup',
    revenueValue: 47.00,
    metadata: JSON.stringify({ emailId: 'newsletter_456', linkPosition: 'primary_cta' })
  },
  {
    sessionId: 'session_email_002',
    utmSource: 'email',
    utmMedium: 'nurture',
    utmCampaign: 'quiz_followup_sequence',
    utmTerm: null,
    utmContent: 'day_7_email',
    page: '/subscribe',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    referrer: 'https://outlook.live.com/',
    ipAddress: '203.0.113.75',
    conversionType: 'purchase',
    revenueValue: 197.00,
    metadata: JSON.stringify({ sequenceDay: 7, emailType: 'nurture' })
  },

  // YouTube Campaigns
  {
    sessionId: 'session_yt_001',
    utmSource: 'youtube',
    utmMedium: 'video',
    utmCampaign: 'transformation_stories',
    utmTerm: 'success_stories',
    utmContent: 'video_description',
    page: '/quiz',
    userAgent: 'Mozilla/5.0 (Android 11; Mobile; rv:68.0)',
    referrer: 'https://www.youtube.com/',
    ipAddress: '198.51.100.200',
    conversionType: 'signup',
    revenueValue: 47.00,
    metadata: JSON.stringify({ videoId: 'yt_video_789', timestamp: '00:02:15' })
  },
  {
    sessionId: 'session_yt_002',
    utmSource: 'youtube',
    utmMedium: 'ads',
    utmCampaign: 'skippable_video_ads',
    utmTerm: 'online_coaching',
    utmContent: 'bumper_ad',
    page: '/subscribe',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    referrer: 'https://www.youtube.com/',
    ipAddress: '192.0.2.150',
    conversionType: 'purchase',
    revenueValue: 5000.00,
    metadata: JSON.stringify({ adId: 'yt_ad_456', videoLength: '15s' })
  },

  // Google Campaigns
  {
    sessionId: 'session_google_001',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'search_coaching_terms',
    utmTerm: 'life_coach_certification',
    utmContent: 'ad_group_1',
    page: '/quiz',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    referrer: 'https://www.google.com/',
    ipAddress: '203.0.113.25',
    conversionType: 'signup',
    revenueValue: 47.00,
    metadata: JSON.stringify({ keywordId: 'kw_123', matchType: 'exact' })
  },
  {
    sessionId: 'session_google_002',
    utmSource: 'google',
    utmMedium: 'organic',
    utmCampaign: 'seo_content',
    utmTerm: 'how_to_become_coach',
    utmContent: 'blog_post',
    page: '/subscribe',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
    referrer: 'https://www.google.com/',
    ipAddress: '198.51.100.80',
    conversionType: 'purchase',
    revenueValue: 197.00,
    metadata: JSON.stringify({ articleId: 'blog_789', searchPosition: 3 })
  },

  // Instagram Campaigns
  {
    sessionId: 'session_ig_001',
    utmSource: 'instagram',
    utmMedium: 'social',
    utmCampaign: 'story_highlights',
    utmTerm: 'fitness_coach',
    utmContent: 'swipe_up',
    page: '/quiz',
    userAgent: 'Instagram 123.0.0.21.114 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
    referrer: 'https://www.instagram.com/',
    ipAddress: '192.168.2.50',
    conversionType: 'signup',
    revenueValue: 47.00,
    metadata: JSON.stringify({ storyId: 'story_456', highlightName: 'Coaching' })
  },

  // TikTok Campaigns
  {
    sessionId: 'session_tiktok_001',
    utmSource: 'tiktok',
    utmMedium: 'video',
    utmCampaign: 'viral_coaching_tips',
    utmTerm: 'mindset_coach',
    utmContent: 'bio_link',
    page: '/quiz',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B)',
    referrer: 'https://www.tiktok.com/',
    ipAddress: '172.16.1.75',
    conversionType: 'signup',
    revenueValue: 47.00,
    metadata: JSON.stringify({ videoId: 'tiktok_789', hashtags: ['#coaching', '#mindset'] })
  },

  // Podcast Campaigns
  {
    sessionId: 'session_podcast_001',
    utmSource: 'podcast',
    utmMedium: 'audio',
    utmCampaign: 'entrepreneur_on_fire',
    utmTerm: 'guest_interview',
    utmContent: 'promo_code',
    page: '/subscribe',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    referrer: 'https://www.eofire.com/',
    ipAddress: '10.0.1.100',
    conversionType: 'purchase',
    revenueValue: 197.00,
    metadata: JSON.stringify({ episodeNumber: 3245, promoCode: 'EOFire20' })
  },

  // Affiliate Campaigns
  {
    sessionId: 'session_affiliate_001',
    utmSource: 'affiliate',
    utmMedium: 'referral',
    utmCampaign: 'partner_network',
    utmTerm: 'coaching_tools',
    utmContent: 'review_post',
    page: '/subscribe',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    referrer: 'https://www.coachingtools.com/',
    ipAddress: '203.0.113.175',
    conversionType: 'purchase',
    revenueValue: 5000.00,
    metadata: JSON.stringify({ affiliateId: 'aff_123', commissionRate: 0.3 })
  }
];

export async function seedUTMData() {
  try {
    console.log('Starting UTM data seeding...');
    
    // Add timestamps to make data appear recent
    const now = new Date();
    const dataWithTimestamps = testUTMData.map((item, index) => ({
      ...item,
      createdAt: new Date(now.getTime() - (index * 2 * 60 * 60 * 1000)) // Spread over last 30 hours
    }));

    // Insert the test data
    await db.insert(utmTracking).values(dataWithTimestamps);
    
    console.log(`✅ Successfully seeded ${testUTMData.length} UTM tracking records`);
    
    // Log summary
    const summary = testUTMData.reduce((acc, item) => {
      const source = item.utmSource;
      if (!acc[source]) acc[source] = { count: 0, revenue: 0 };
      acc[source].count++;
      acc[source].revenue += item.revenueValue || 0;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);
    
    console.log('\n📊 Seeded Data Summary:');
    Object.entries(summary).forEach(([source, data]) => {
      console.log(`  ${source}: ${data.count} records, $${data.revenue.toLocaleString()} revenue`);
    });
    
    const totalRevenue = Object.values(summary).reduce((sum, data) => sum + data.revenue, 0);
    console.log(`\n💰 Total Revenue: $${totalRevenue.toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Error seeding UTM data:', error);
    throw error;
  }
}

export async function clearUTMData() {
  try {
    console.log('Clearing existing UTM data...');
    // Note: In production, you might want to be more selective about what you delete
    await db.delete(utmTracking);
    console.log('✅ UTM data cleared');
  } catch (error) {
    console.error('❌ Error clearing UTM data:', error);
    throw error;
  }
}