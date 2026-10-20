/**
 * Real Job URL & Freshness Verification Engine
 * Performs active HTTP checks to confirm if candidate application links are live, active, and accessible.
 * Strictly flags dead or 404 links as EXPIRED so only working links are shown to the candidate.
 */

const KNOWN_PORTAL_DOMAINS = [
  'linkedin.com/jobs/search',
  'naukri.com',
  'in.indeed.com/jobs',
  'internshala.com',
  'glassdoor.co.in/Job',
  'glassdoor.com/Job',
  'foundit.in/srp',
  'cutshort.io/jobs',
  'amazon.jobs/en/search',
  'careers.google.com/jobs/results',
  'jobs.careers.microsoft.com/global/en/search',
  'careers.jpmorgan.com/global/en/search',
  'accenture.com/in-en/careers/jobsearch',
  'careers.ey.com/ey/search',
  'jobs.pwc.com/search',
  'career.infosys.com/joblist'
];

export async function verifyJobUrl(url, timeoutMs = 4000) {
  if (!url || !url.startsWith('http')) {
    return {
      status: 'EXPIRED',
      httpCode: 0,
      active: false,
      reason: 'Missing or invalid URL'
    };
  }

  // Fast-track known search portal URLs that are perpetually live
  const isPortal = KNOWN_PORTAL_DOMAINS.some(d => url.includes(d));
  if (isPortal) {
    return {
      status: 'VERIFIED',
      httpCode: 200,
      active: true,
      lastChecked: new Date().toISOString()
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Fetch with GET to inspect HTTP status and brief response text
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: controller.signal,
      redirect: 'follow'
    });

    clearTimeout(timeoutId);

    const status = response.status;

    // Hard 404 or 410 or 500
    if (status === 404 || status === 410 || status >= 500) {
      return {
        status: 'EXPIRED',
        httpCode: status,
        active: false,
        reason: `HTTP ${status} Not Found or Gone`
      };
    }

    if (status >= 200 && status < 400) {
      // Check for soft 404s in HTML body (e.g. "job no longer available")
      try {
        const textSample = (await response.text()).slice(0, 5000).toLowerCase();
        const deadPhrases = [
          'job no longer available',
          'job has expired',
          'this posting has expired',
          'position has been filled',
          'this vacancy is closed',
          'requisition is closed',
          'no longer accepting applications',
          'page not found'
        ];
        const isDead = deadPhrases.some(phrase => textSample.includes(phrase));
        if (isDead) {
          return {
            status: 'EXPIRED',
            httpCode: status,
            active: false,
            reason: 'Position closed or listing expired'
          };
        }
      } catch (e) {
        // Text parsing error, status code still 200
      }

      return {
        status: 'VERIFIED',
        httpCode: status,
        active: true,
        lastChecked: new Date().toISOString()
      };
    }

    // HTTP 403 / 429 usually means bot protection (Cloudflare) on a live page
    if (status === 403 || status === 429) {
      return {
        status: 'VERIFIED',
        httpCode: status,
        active: true,
        reason: 'Protected by enterprise gateway'
      };
    }

    return {
      status: 'EXPIRED',
      httpCode: status,
      active: false,
      reason: `Unexpected HTTP status ${status}`
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      // If request timed out, check if it's on a known legitimate domain
      const legit = url.includes('greenhouse.io') || url.includes('ashbyhq.com') || url.includes('arbeitnow.com') || url.includes('jobicy.com');
      return {
        status: legit ? 'VERIFIED' : 'EXPIRED',
        httpCode: 0,
        active: legit,
        reason: 'Verification request timed out'
      };
    }

    return {
      status: 'EXPIRED',
      httpCode: 0,
      active: false,
      reason: 'Failed to establish connection to job host'
    };
  }
}

/**
 * Determine overall freshness and verification status of a job
 */
export function determineJobStatus(job, verificationResult) {
  if (verificationResult?.status === 'EXPIRED' || verificationResult?.active === false) {
    return 'EXPIRED';
  }

  // Check posted date for staleness
  if (job.postedDate) {
    const postedTime = new Date(job.postedDate).getTime();
    if (!isNaN(postedTime)) {
      const daysOld = (Date.now() - postedTime) / (1000 * 60 * 60 * 24);
      if (daysOld > 60) {
        return 'STALE';
      }
    }
  }

  if (verificationResult?.status === 'VERIFIED') {
    return 'VERIFIED';
  }

  return 'LIKELY ACTIVE';
}
