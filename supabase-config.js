/**
 * Supabase Configuration & Database Layer
 * Handles all persistent storage for admin data using Supabase backend.
 * Falls back to localStorage cache, then to default JSON data.
 * 
 * Tables needed in Supabase:
 * - portfolio_education
 * - portfolio_education_cards
 * - portfolio_achievements
 * - portfolio_timeline
 * - portfolio_projects
 * - portfolio_project_stats
 * - portfolio_testimonials
 * - portfolio_testimonial_stats
 * - portfolio_blog
 * - portfolio_profile
 * - portfolio_cv
 * - portfolio_settings
 */

// ============================================================
// SUPABASE CONFIGURATION
// ============================================================
const SUPABASE_CONFIG = {
  url: 'https://wcryykfvbmobcaawxzbx.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjcnl5a2Z2Ym1vYmNhYXd4emJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MDk3MjMsImV4cCI6MjEwMDQ4NTcyM30.lQzfxkKddp07kRYAhy0EFNRAQ7SG7wO4ZMP4-4iUy0M'
};

// ============================================================
// SUPABASE CLIENT
// ============================================================
let supabaseClient = null;

function initSupabase() {
  try {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
      supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      console.log('%c[Supabase] Client initialized successfully', 'color: #4facfe; font-weight: bold;');
      return true;
    } else {
      console.warn('%c[Supabase] SDK not loaded yet, will retry', 'color: #ff9800;');
      return false;
    }
  } catch (error) {
    console.error('%c[Supabase] Failed to initialize:', 'color: #ff4444; font-weight: bold;', error);
    return false;
  }
}

// Try initializing immediately
initSupabase();

// Retry on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  if (!supabaseClient) {
    setTimeout(initSupabase, 1500);
  }
});

// ============================================================
// TABLE NAMES & CACHE KEYS
// ============================================================
const DB_TABLES = {
  EDUCATION: 'portfolio_education',
  EDUCATION_CARDS: 'portfolio_education_cards',
  ACHIEVEMENTS: 'portfolio_achievements',
  TIMELINE: 'portfolio_timeline',
  PROJECTS: 'portfolio_projects',
  PROJECT_STATS: 'portfolio_project_stats',
  TESTIMONIALS: 'portfolio_testimonials',
  TESTIMONIAL_STATS: 'portfolio_testimonial_stats',
  BLOG: 'portfolio_blog',
  PROFILE: 'portfolio_profile',
  CV: 'portfolio_cv',
  SETTINGS: 'portfolio_settings'
};

const CACHE_KEYS = {
  EDUCATION: 'portfolioEducationData',
  EDUCATION_CARDS: 'portfolioEducationCardData',
  ACHIEVEMENTS: 'portfolioAchievementData',
  TIMELINE: 'portfolioTimelineData',
  PROJECTS: 'portfolioProjectData',
  PROJECT_STATS: 'portfolioProjectStatsData',
  TESTIMONIALS: 'portfolioTestimonialData',
  TESTIMONIAL_STATS: 'portfolioTestimonialStatsData',
  BLOG: 'portfolioBlogData',
  PROFILE_IMAGE: 'profileImage',
  CV: 'portfolioAdminCV',
  CV_URL: 'portfolioAdminCVPublicUrl'
};

// ============================================================
// GENERIC DB OPERATIONS
// ============================================================

/**
 * Ensure Supabase client is ready, with retry
 */
async function ensureClient(maxRetries = 3) {
  if (supabaseClient) return true;
  
  for (let i = 0; i < maxRetries; i++) {
    await new Promise(r => setTimeout(r, 1000));
    if (initSupabase()) return true;
  }
  return false;
}

/**
 * Upsert a single record
 */
async function dbUpsert(table, id, content) {
  try {
    if (!await ensureClient()) return { success: false, fallback: true };
    
    const { data, error } = await supabaseClient
      .from(table)
      .upsert({ 
        id: String(id), 
        content: content,
        updated_at: new Date().toISOString() 
      }, { onConflict: 'id' });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error(`[Supabase] Upsert error (${table}/${id}):`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Load all records from a table
 */
async function dbLoadAll(table) {
  try {
    if (!await ensureClient()) return { success: false, fallback: true, data: {} };
    
    const { data, error } = await supabaseClient
      .from(table)
      .select('id, content, updated_at')
      .order('id');
    
    if (error) throw error;
    
    const result = {};
    if (data) {
      data.forEach(row => {
        result[row.id] = row.content;
      });
    }
    return { success: true, data: result };
  } catch (error) {
    console.error(`[Supabase] Load error (${table}):`, error.message);
    return { success: false, error: error.message, data: {} };
  }
}

/**
 * Batch upsert multiple records
 */
async function dbBatchUpsert(table, recordsMap) {
  const ids = Object.keys(recordsMap);
  if (ids.length === 0) return { success: true };
  
  try {
    if (!await ensureClient()) return { success: false, fallback: true };
    
    const records = ids.map(id => ({
      id: String(id),
      content: recordsMap[id],
      updated_at: new Date().toISOString()
    }));
    
    const { data, error } = await supabaseClient
      .from(table)
      .upsert(records, { onConflict: 'id' });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error(`[Supabase] Batch upsert error (${table}):`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a record
 */
async function dbDelete(table, id) {
  try {
    if (!await ensureClient()) return { success: false, fallback: true };
    
    const { error } = await supabaseClient
      .from(table)
      .delete()
      .eq('id', String(id));
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error(`[Supabase] Delete error (${table}/${id}):`, error.message);
    return { success: false, error: error.message };
  }
}

// ============================================================
// LOCAL STORAGE HELPERS
// ============================================================

function saveLocalCache(key, dataMap) {
  try {
    localStorage.setItem(key, JSON.stringify(dataMap));
  } catch (e) {
    console.warn('[LocalCache] Save failed:', e.message);
  }
}

function loadLocalCache(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.warn('[LocalCache] Load failed:', e.message);
    return {};
  }
}

// ============================================================
// HIGH-LEVEL DATA FUNCTIONS
// These are called by the modified save/load functions in index.html
// ============================================================

/**
 * Save education timeline data to Supabase + localStorage cache
 */
async function supabaseSaveEducation(educationData) {
  const result = await dbBatchUpsert(DB_TABLES.EDUCATION, educationData);
  saveLocalCache(CACHE_KEYS.EDUCATION, educationData);
  return result;
}

/**
 * Load education timeline data - DB first, then localStorage fallback
 */
async function supabaseLoadEducation() {
  const result = await dbLoadAll(DB_TABLES.EDUCATION);
  if (result.success && Object.keys(result.data).length > 0) {
    saveLocalCache(CACHE_KEYS.EDUCATION, result.data);
    return result.data;
  }
  return loadLocalCache(CACHE_KEYS.EDUCATION);
}

async function supabaseSaveEducationCards(cardData) {
  const result = await dbBatchUpsert(DB_TABLES.EDUCATION_CARDS, cardData);
  saveLocalCache(CACHE_KEYS.EDUCATION_CARDS, cardData);
  return result;
}

async function supabaseLoadEducationCards() {
  const result = await dbLoadAll(DB_TABLES.EDUCATION_CARDS);
  if (result.success && Object.keys(result.data).length > 0) {
    saveLocalCache(CACHE_KEYS.EDUCATION_CARDS, result.data);
    return result.data;
  }
  return loadLocalCache(CACHE_KEYS.EDUCATION_CARDS);
}

async function supabaseSaveAchievements(achievementData) {
  const result = await dbBatchUpsert(DB_TABLES.ACHIEVEMENTS, achievementData);
  saveLocalCache(CACHE_KEYS.ACHIEVEMENTS, achievementData);
  return result;
}

async function supabaseLoadAchievements() {
  const result = await dbLoadAll(DB_TABLES.ACHIEVEMENTS);
  if (result.success && Object.keys(result.data).length > 0) {
    saveLocalCache(CACHE_KEYS.ACHIEVEMENTS, result.data);
    return result.data;
  }
  return loadLocalCache(CACHE_KEYS.ACHIEVEMENTS);
}

async function supabaseSaveTimeline(timelineData) {
  const result = await dbBatchUpsert(DB_TABLES.TIMELINE, timelineData);
  saveLocalCache(CACHE_KEYS.TIMELINE, timelineData);
  return result;
}

async function supabaseLoadTimeline() {
  const result = await dbLoadAll(DB_TABLES.TIMELINE);
  if (result.success && Object.keys(result.data).length > 0) {
    saveLocalCache(CACHE_KEYS.TIMELINE, result.data);
    return result.data;
  }
  return loadLocalCache(CACHE_KEYS.TIMELINE);
}

async function supabaseSaveProject(projectId, projectData) {
  const result = await dbUpsert(DB_TABLES.PROJECTS, projectId, projectData);
  const cache = loadLocalCache(CACHE_KEYS.PROJECTS);
  cache[projectId] = projectData;
  saveLocalCache(CACHE_KEYS.PROJECTS, cache);
  return result;
}

async function supabaseSaveProjectStat(statId, statData) {
  const result = await dbUpsert(DB_TABLES.PROJECT_STATS, statId, statData);
  const cache = loadLocalCache(CACHE_KEYS.PROJECT_STATS);
  cache[statId] = statData;
  saveLocalCache(CACHE_KEYS.PROJECT_STATS, cache);
  return result;
}

async function supabaseLoadProjects() {
  const result = await dbLoadAll(DB_TABLES.PROJECTS);
  if (result.success && Object.keys(result.data).length > 0) {
    saveLocalCache(CACHE_KEYS.PROJECTS, result.data);
    return result.data;
  }
  return loadLocalCache(CACHE_KEYS.PROJECTS);
}

async function supabaseLoadProjectStats() {
  const result = await dbLoadAll(DB_TABLES.PROJECT_STATS);
  if (result.success && Object.keys(result.data).length > 0) {
    saveLocalCache(CACHE_KEYS.PROJECT_STATS, result.data);
    return result.data;
  }
  return loadLocalCache(CACHE_KEYS.PROJECT_STATS);
}

async function supabaseSaveTestimonial(testimonialId, testimonialData) {
  const result = await dbUpsert(DB_TABLES.TESTIMONIALS, testimonialId, testimonialData);
  const cache = loadLocalCache(CACHE_KEYS.TESTIMONIALS);
  cache[testimonialId] = testimonialData;
  saveLocalCache(CACHE_KEYS.TESTIMONIALS, cache);
  return result;
}

async function supabaseSaveTestimonialStat(statId, statData) {
  const result = await dbUpsert(DB_TABLES.TESTIMONIAL_STATS, statId, statData);
  const cache = loadLocalCache(CACHE_KEYS.TESTIMONIAL_STATS);
  cache[statId] = statData;
  saveLocalCache(CACHE_KEYS.TESTIMONIAL_STATS, cache);
  return result;
}

async function supabaseLoadTestimonials() {
  const result = await dbLoadAll(DB_TABLES.TESTIMONIALS);
  if (result.success && Object.keys(result.data).length > 0) {
    saveLocalCache(CACHE_KEYS.TESTIMONIALS, result.data);
    return result.data;
  }
  return loadLocalCache(CACHE_KEYS.TESTIMONIALS);
}

async function supabaseLoadTestimonialStats() {
  const result = await dbLoadAll(DB_TABLES.TESTIMONIAL_STATS);
  if (result.success && Object.keys(result.data).length > 0) {
    saveLocalCache(CACHE_KEYS.TESTIMONIAL_STATS, result.data);
    return result.data;
  }
  return loadLocalCache(CACHE_KEYS.TESTIMONIAL_STATS);
}

async function supabaseSaveBlog(postId, blogData) {
  const result = await dbUpsert(DB_TABLES.BLOG, postId, blogData);
  const cache = loadLocalCache(CACHE_KEYS.BLOG);
  cache[postId] = blogData;
  saveLocalCache(CACHE_KEYS.BLOG, cache);
  return result;
}

async function supabaseLoadBlog() {
  const result = await dbLoadAll(DB_TABLES.BLOG);
  if (result.success && Object.keys(result.data).length > 0) {
    saveLocalCache(CACHE_KEYS.BLOG, result.data);
    return result.data;
  }
  return loadLocalCache(CACHE_KEYS.BLOG);
}

async function supabaseSaveProfileImage(imageData) {
  return await dbUpsert(DB_TABLES.PROFILE, 'profile_image', { data: imageData });
}

async function supabaseLoadProfileImage() {
  const result = await dbLoadAll(DB_TABLES.PROFILE);
  if (result.success && result.data['profile_image']) {
    return result.data['profile_image'].data || null;
  }
  return localStorage.getItem(CACHE_KEYS.PROFILE_IMAGE);
}

async function supabaseSaveCV(cvData) {
  return await dbUpsert(DB_TABLES.CV, 'admin_cv', { data: cvData });
}

async function supabaseLoadCV() {
  const result = await dbLoadAll(DB_TABLES.CV);
  if (result.success && result.data['admin_cv']) {
    return result.data['admin_cv'].data || null;
  }
  return localStorage.getItem(CACHE_KEYS.CV);
}

async function supabaseDeleteCV() {
  const result = await dbDelete(DB_TABLES.CV, 'admin_cv');
  localStorage.removeItem(CACHE_KEYS.CV);
  localStorage.removeItem(CACHE_KEYS.CV_URL);
  return result;
}

/**
 * Migrate existing localStorage data to Supabase
 * Call this once to move all existing data to the cloud
 */
async function migrateLocalStorageToSupabase() {
  console.log('%c[Supabase] Starting data migration from localStorage...', 'color: #ff9800; font-weight: bold;');
  
  const migrations = [
    { key: CACHE_KEYS.EDUCATION, table: DB_TABLES.EDUCATION },
    { key: CACHE_KEYS.EDUCATION_CARDS, table: DB_TABLES.EDUCATION_CARDS },
    { key: CACHE_KEYS.ACHIEVEMENTS, table: DB_TABLES.ACHIEVEMENTS },
    { key: CACHE_KEYS.TIMELINE, table: DB_TABLES.TIMELINE },
    { key: CACHE_KEYS.PROJECTS, table: DB_TABLES.PROJECTS },
    { key: CACHE_KEYS.PROJECT_STATS, table: DB_TABLES.PROJECT_STATS },
    { key: CACHE_KEYS.TESTIMONIALS, table: DB_TABLES.TESTIMONIALS },
    { key: CACHE_KEYS.TESTIMONIAL_STATS, table: DB_TABLES.TESTIMONIAL_STATS },
    { key: CACHE_KEYS.BLOG, table: DB_TABLES.BLOG }
  ];
  
  let migrated = 0;
  let errors = 0;
  
  for (const migration of migrations) {
    try {
      const data = loadLocalCache(migration.key);
      if (Object.keys(data).length > 0) {
        console.log(`[Supabase] Migrating ${migration.key} (${Object.keys(data).length} records)...`);
        const result = await dbBatchUpsert(migration.table, data);
        if (result.success) {
          migrated++;
          console.log(`%c[Supabase] ✓ ${migration.key} migrated`, 'color: #4caf50;');
        } else {
          errors++;
          console.warn(`[Supabase] ✗ ${migration.key} migration failed:`, result.error);
        }
      } else {
        console.log(`[Supabase] - ${migration.key}: no data to migrate`);
      }
    } catch (e) {
      errors++;
      console.error(`[Supabase] ✗ ${migration.key} migration error:`, e);
    }
  }
  
  // Migrate profile image
  const profileImage = localStorage.getItem(CACHE_KEYS.PROFILE_IMAGE);
  if (profileImage) {
    const result = await supabaseSaveProfileImage(profileImage);
    if (result.success) migrated++;
  }
  
  // Migrate CV
  const cvData = localStorage.getItem(CACHE_KEYS.CV);
  if (cvData) {
    const result = await supabaseSaveCV(cvData);
    if (result.success) migrated++;
  }
  
  console.log(`%c[Supabase] Migration complete: ${migrated} tables migrated, ${errors} errors`, 
    errors === 0 ? 'color: #4caf50; font-weight: bold;' : 'color: #ff9800; font-weight: bold;');
  
  return { migrated, errors };
}

// Export functions globally for use in index.html
window.SupabaseDB = {
  // Education
  saveEducation: supabaseSaveEducation,
  loadEducation: supabaseLoadEducation,
  saveEducationCards: supabaseSaveEducationCards,
  loadEducationCards: supabaseLoadEducationCards,
  
  // Achievements
  saveAchievements: supabaseSaveAchievements,
  loadAchievements: supabaseLoadAchievements,
  
  // Timeline
  saveTimeline: supabaseSaveTimeline,
  loadTimeline: supabaseLoadTimeline,
  
  // Projects
  saveProject: supabaseSaveProject,
  saveProjectStat: supabaseSaveProjectStat,
  loadProjects: supabaseLoadProjects,
  loadProjectStats: supabaseLoadProjectStats,
  
  // Testimonials
  saveTestimonial: supabaseSaveTestimonial,
  saveTestimonialStat: supabaseSaveTestimonialStat,
  loadTestimonials: supabaseLoadTestimonials,
  loadTestimonialStats: supabaseLoadTestimonialStats,
  
  // Blog
  saveBlog: supabaseSaveBlog,
  loadBlog: supabaseLoadBlog,
  
  // Profile
  saveProfileImage: supabaseSaveProfileImage,
  loadProfileImage: supabaseLoadProfileImage,
  
  // CV
  saveCV: supabaseSaveCV,
  loadCV: supabaseLoadCV,
  deleteCV: supabaseDeleteCV,
  
  // Utility
  migrate: migrateLocalStorageToSupabase,
  isReady: () => supabaseClient !== null
};