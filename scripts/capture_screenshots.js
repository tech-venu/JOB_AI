const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUTPUT_DIR = path.join(__dirname, '../docs/screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
    },
  });

  const page = await browser.newPage();

  // Helper to take screenshot
  async function snap(filename, delay = 1500) {
    await new Promise((r) => setTimeout(r, delay));
    const targetPath = path.join(OUTPUT_DIR, filename);
    await page.screenshot({ path: targetPath, fullPage: false });
    console.log(`Saved screenshot: ${filename}`);
  }

  try {
    // 1. Landing Page
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await snap('01_landing_page.png');

    // 2. About Page
    await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle0' });
    await snap('02_about_page.png');

    // 3. Features Page
    await page.goto('http://localhost:5173/features', { waitUntil: 'networkidle0' });
    await snap('03_features_page.png');

    // 4. How It Works Page
    await page.goto('http://localhost:5173/how-it-works', { waitUntil: 'networkidle0' });
    await snap('04_how_it_works.png');

    // 5. Job Listings Page
    await page.goto('http://localhost:5173/jobs', { waitUntil: 'networkidle0' });
    await snap('05_job_listings.png');

    // 6. Login Page
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await snap('06_login_page.png');

    // 7. Register Page
    await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle0' });
    await snap('07_register_page.png');

    // 8. Forgot Password Page
    await page.goto('http://localhost:5173/forgot-password', { waitUntil: 'networkidle0' });
    await snap('08_forgot_password.png');

    // 9. Job Seeker Login & Flow
    console.log('Logging in as Candidate...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'venu@example.com');
    await page.type('input[type="password"]', 'CandidatePassword123!');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await snap('09_jobseeker_dashboard.png', 2000);

    // 10. Resume Analyzer
    await page.goto('http://localhost:5173/jobseeker/resume', { waitUntil: 'networkidle0' });
    await snap('10_resume_analyzer.png', 2000);

    // 11. Recommendations
    await page.goto('http://localhost:5173/jobseeker/recommendations', { waitUntil: 'networkidle0' });
    await snap('11_job_recommendations.png', 2000);

    // 12. Skill Gap
    await page.goto('http://localhost:5173/jobseeker/skill-gap', { waitUntil: 'networkidle0' });
    await snap('12_skill_gap_analysis.png', 2000);

    // 13. AI Career Assistant
    await page.goto('http://localhost:5173/jobseeker/assistant', { waitUntil: 'networkidle0' });
    await snap('13_career_assistant.png', 2000);

    // 14. Application Tracking
    await page.goto('http://localhost:5173/jobseeker/applications', { waitUntil: 'networkidle0' });
    await snap('14_application_tracking.png', 2000);

    // 15. Jobseeker Profile & Settings
    await page.goto('http://localhost:5173/settings', { waitUntil: 'networkidle0' });
    await snap('15_jobseeker_profile_settings.png', 2000);

    // Clear session / logout
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // 16. Recruiter Login & Flow
    console.log('Logging in as Recruiter...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'recruiter@google.com');
    await page.type('input[type="password"]', 'RecruiterPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await snap('16_recruiter_dashboard.png', 2500);

    // 17. Post New Job
    await page.goto('http://localhost:5173/recruiter/jobs/create', { waitUntil: 'networkidle0' });
    await snap('17_post_new_job.png', 2000);

    // 18. Recruiter Candidates / Applicants
    // Click into first job's rankings if available
    const rankingsLink = await page.$('a[href*="/recruiter/jobs/"][href*="/applicants"]');
    if (rankingsLink) {
      await rankingsLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
      await snap('18_recruiter_candidate_ranking.png', 2000);
    } else {
      // Direct navigation to first job found in dashboard
      await page.goto('http://localhost:5173/recruiter/dashboard', { waitUntil: 'networkidle0' });
      await page.waitForSelector('a[href*="/applicants"]', { timeout: 3000 }).then(async (el) => {
        if (el) {
          await el.click();
          await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
          await snap('18_recruiter_candidate_ranking.png', 2000);
        }
      }).catch(async () => {
        await snap('18_recruiter_candidate_ranking.png', 1000);
      });
    }

    // 19. Recruitment Analytics
    await page.goto('http://localhost:5173/recruiter/analytics', { waitUntil: 'networkidle0' });
    await snap('19_recruitment_analytics.png', 2000);

    // Clear session / logout
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // 20. Super Admin Login & Flow
    console.log('Logging in as Admin...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'admin@hirematch.ai');
    await page.type('input[type="password"]', 'AdminPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await snap('20_admin_dashboard.png', 2500);

    // 21. Admin Settings
    await page.goto('http://localhost:5173/settings', { waitUntil: 'networkidle0' });
    await snap('21_admin_settings.png', 2000);

    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Screenshot capture error:', err);
  } finally {
    await browser.close();
  }
}

capture();
