import { useEffect } from "react";
import { useLocation } from "wouter";

interface UTMData {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  term: string | null;
  content: string | null;
  timestamp: number;
  page: string;
  userAgent: string;
  referrer: string;
}

export const useTrackUTM = () => {
  const [location] = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const utmData: UTMData = {
      source: urlParams.get("utm_source"),
      medium: urlParams.get("utm_medium"),
      campaign: urlParams.get("utm_campaign"),
      term: urlParams.get("utm_term"),
      content: urlParams.get("utm_content"),
      timestamp: Date.now(),
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    // Only track if at least one UTM parameter is present
    if (utmData.source || utmData.medium || utmData.campaign) {
      console.log('UTM tracking data:', utmData);
      
      // Store in localStorage for attribution persistence
      localStorage.setItem('utm_attribution', JSON.stringify(utmData));
      
      // Send to backend for storage
      fetch("/api/track-utm", {
        method: "POST",
        body: JSON.stringify(utmData),
        headers: { 
          "Content-Type": "application/json",
          "X-Track-Attribution": "true"
        },
      }).catch(error => {
        console.warn('UTM tracking failed:', error);
      });
    }

    // Also track direct traffic without UTM parameters
    if (!utmData.source && !localStorage.getItem('utm_attribution')) {
      const directTraffic = {
        ...utmData,
        source: 'direct',
        medium: 'none',
        campaign: 'direct_traffic'
      };
      
      localStorage.setItem('utm_attribution', JSON.stringify(directTraffic));
      
      fetch("/api/track-utm", {
        method: "POST",
        body: JSON.stringify(directTraffic),
        headers: { 
          "Content-Type": "application/json",
          "X-Track-Attribution": "true"
        },
      }).catch(error => {
        console.warn('Direct traffic tracking failed:', error);
      });
    }
  }, [location]);
};

// Get current attribution data
export const getUTMAttribution = (): UTMData | null => {
  const stored = localStorage.getItem('utm_attribution');
  return stored ? JSON.parse(stored) : null;
};

// Clear attribution (useful for testing)
export const clearUTMAttribution = () => {
  localStorage.removeItem('utm_attribution');
};

// Track conversion events
export const trackConversion = async (event: string, value?: number) => {
  const attribution = getUTMAttribution();
  if (!attribution) return;

  try {
    await fetch('/api/track-utm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Track-Attribution': 'true',
        'X-Conversion-Event': event
      },
      body: JSON.stringify({
        ...attribution,
        conversionEvent: event,
        conversionValue: value,
        timestamp: Date.now()
      })
    });
  } catch (error) {
    console.error('Conversion tracking failed:', error);
  }
};

// Generate UTM link utility
export const generateUTMLink = (baseUrl: string, params: {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}): string => {
  const url = new URL(baseUrl);
  
  url.searchParams.set('utm_source', params.source);
  url.searchParams.set('utm_medium', params.medium);
  url.searchParams.set('utm_campaign', params.campaign);
  
  if (params.term) {
    url.searchParams.set('utm_term', params.term);
  }
  
  if (params.content) {
    url.searchParams.set('utm_content', params.content);
  }
  
  return url.toString();
};

// Campaign Template Generator for VaultForge
export const generateCampaignTemplates = () => {
  const baseUrl = window.location.origin;
  
  return {
    facebook: {
      awareness: generateUTMLink(baseUrl, {
        source: 'facebook',
        medium: 'social',
        campaign: 'vault_awareness',
        content: 'feed_post'
      }),
      conversion: generateUTMLink(baseUrl, {
        source: 'facebook',
        medium: 'cpc',
        campaign: 'vault_conversion',
        content: 'lead_gen'
      }),
      retargeting: generateUTMLink(baseUrl, {
        source: 'facebook',
        medium: 'cpc',
        campaign: 'vault_retargeting',
        content: 'warm_audience'
      })
    },
    linkedin: {
      organic: generateUTMLink(baseUrl, {
        source: 'linkedin',
        medium: 'social',
        campaign: 'thought_leadership',
        content: 'native_post'
      }),
      sponsored: generateUTMLink(baseUrl, {
        source: 'linkedin',
        medium: 'cpc',
        campaign: 'b2b_professionals',
        content: 'sponsored_content'
      }),
      message: generateUTMLink(baseUrl, {
        source: 'linkedin',
        medium: 'message',
        campaign: 'direct_outreach',
        content: 'personalized_dm'
      })
    },
    email: {
      newsletter: generateUTMLink(baseUrl, {
        source: 'newsletter',
        medium: 'email',
        campaign: 'weekly_insights',
        content: 'main_cta'
      }),
      nurture: generateUTMLink(baseUrl, {
        source: 'email',
        medium: 'email',
        campaign: 'nurture_sequence',
        content: 'day_5'
      }),
      launch: generateUTMLink(baseUrl, {
        source: 'email',
        medium: 'email',
        campaign: 'vault_launch',
        content: 'early_access'
      })
    },
    affiliate: {
      partner: generateUTMLink(baseUrl, {
        source: 'partner_promo',
        medium: 'affiliate',
        campaign: 'july_launch',
        term: 'high_ticket'
      }),
      influencer: generateUTMLink(baseUrl, {
        source: 'influencer_collab',
        medium: 'affiliate',
        campaign: 'creator_spotlight',
        term: 'coaching'
      })
    },
    youtube: {
      organic: generateUTMLink(baseUrl, {
        source: 'youtube',
        medium: 'video',
        campaign: 'channel_content',
        content: 'description'
      }),
      ads: generateUTMLink(baseUrl, {
        source: 'youtube',
        medium: 'cpc',
        campaign: 'video_ads',
        content: 'pre_roll'
      })
    }
  };
};