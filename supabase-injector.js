 /**
 * Supabase Injector Script
 * OVERRIDES existing save/load functions in index.html to use Supabase as PRIMARY storage.
 * localStorage is used ONLY as a cache/fallback.
 * 
 * IMPORTANT: This script must override functions BEFORE they are called on page load.
 * It uses a MutationObserver to detect when the main script has loaded and the DOM is ready.
 */

console.log('%c[Supabase Injector] Initializing...', 'color: #4facfe; font-weight: bold;');

(function() {
  let retries = 0;
  const maxRetries = 30;
  
  function tryInject() {
    retries++;
    
    // Check if SupabaseDB is ready and the main functions exist
    if (typeof window.SupabaseDB !== 'undefined' && 
        typeof window.SupabaseDB.isReady === 'function') {
      
      // Check if the main script's functions are defined
      if (typeof saveEducationDataToStorage === 'function' &&
          typeof loadEducationDataFromStorage === 'function') {
        
        console.log('%c[Supabase Injector] Functions found, injecting overrides...', 'color: #4caf50; font-weight: bold;');
        injectOverrides();
        return;
      }
    }
    
    if (retries < maxRetries) {
      setTimeout(tryInject, 500);
    } else {
      console.warn('[Supabase Injector] Timed out waiting for dependencies');
    }
  }
  
  function injectOverrides() {
    // ============================================================
    // Store original functions (localStorage versions)
    // ============================================================
    const originals = {
      saveEducation: saveEducationDataToStorage,
      loadEducation: loadEducationDataFromStorage,
      saveEducationCards: saveEducationCardDataToStorage,
      loadEducationCards: loadEducationCardDataFromStorage,
      saveAchievements: saveAchievementDataToStorage,
      loadAchievements: loadAchievementDataFromStorage,
      saveTimeline: saveTimelineDataToStorage,
      loadTimeline: loadTimelineDataFromStorage,
      loadProjects: loadProjectDataFromStorage,
      loadTestimonials: loadTestimonialDataFromStorage,
      loadBlog: loadBlogDataFromStorage
    };
    
    // ============================================================
    // OVERRIDE: Education Data
    // ============================================================
    window.saveEducationDataToStorage = function() {
      // Still save to localStorage as cache
      originals.saveEducation();
      
      // Also save to Supabase (async)
      if (window.SupabaseDB && window.SupabaseDB.saveEducation) {
        try {
          const educationData = {};
          document.querySelectorAll('[data-education-id]').forEach(item => {
            educationData[item.getAttribute('data-education-id')] = extractEducationItemData(item);
          });
          window.SupabaseDB.saveEducation(educationData).then(r => {
            if (r.success) console.log('%c[Supabase] Education saved to cloud', 'color: #4caf50;');
            else if (r.fallback) console.warn('[Supabase] Education: cloud unavailable, using localStorage');
            else console.error('[Supabase] Education save error:', r.error);
          });
        } catch(e) {
          console.error('[Supabase] Education save error:', e.message);
        }
      }
    };
    
    window.loadEducationDataFromStorage = async function() {
      let loaded = false;
      
      // Try Supabase FIRST (primary storage)
      if (window.SupabaseDB && window.SupabaseDB.loadEducation) {
        try {
          const data = await window.SupabaseDB.loadEducation();
          if (data && Object.keys(data).length > 0) {
            Object.keys(data).forEach(id => {
              const el = document.querySelector(`[data-education-id="${id}"]`);
              if (el) populateEducationItem(el, data[id]);
            });
            loaded = true;
            console.log('%c[Supabase] Education loaded from cloud', 'color: #4caf50; font-weight: bold;');
          }
        } catch(e) {
          console.warn('[Supabase] Education cloud load failed:', e.message);
        }
      }
      
      // Fallback to localStorage cache
      if (!loaded) {
        console.log('[Supabase] Education: cloud empty/unavailable, using localStorage');
        originals.loadEducation();
      }
    };
    
    // ============================================================
    // OVERRIDE: Education Cards
    // ============================================================
    window.saveEducationCardDataToStorage = function() {
      originals.saveEducationCards();
      
      if (window.SupabaseDB && window.SupabaseDB.saveEducationCards) {
        try {
          const cardData = {};
          document.querySelectorAll('[data-card-id]').forEach(card => {
            cardData[card.getAttribute('data-card-id')] = extractCardData(card);
          });
          window.SupabaseDB.saveEducationCards(cardData);
        } catch(e) {
          console.error('[Supabase] Cards save error:', e.message);
        }
      }
    };
    
    window.loadEducationCardDataFromStorage = async function() {
      let loaded = false;
      
      if (window.SupabaseDB && window.SupabaseDB.loadEducationCards) {
        try {
          const data = await window.SupabaseDB.loadEducationCards();
          if (data && Object.keys(data).length > 0) {
            Object.keys(data).forEach(id => {
              const el = document.querySelector(`[data-card-id="${id}"]`);
              if (el) populateCardData(el, data[id]);
            });
            loaded = true;
            console.log('%c[Supabase] Education cards loaded from cloud', 'color: #4caf50;');
          }
        } catch(e) {
          console.warn('[Supabase] Cards cloud load failed:', e.message);
        }
      }
      if (!loaded) originals.loadEducationCards();
    };
    
    // ============================================================
    // OVERRIDE: Achievements
    // ============================================================
    window.saveAchievementDataToStorage = function() {
      originals.saveAchievements();
      
      if (window.SupabaseDB && window.SupabaseDB.saveAchievements) {
        try {
          const achievementData = {};
          document.querySelectorAll('[data-achievement-id]').forEach(item => {
            achievementData[item.getAttribute('data-achievement-id')] = extractAchievementItemData(item);
          });
          document.querySelectorAll('[data-stat-id]').forEach(item => {
            achievementData[item.getAttribute('data-stat-id')] = extractStatItemData(item);
          });
          window.SupabaseDB.saveAchievements(achievementData);
        } catch(e) {
          console.error('[Supabase] Achievements save error:', e.message);
        }
      }
    };
    
    window.loadAchievementDataFromStorage = async function() {
      let loaded = false;
      
      if (window.SupabaseDB && window.SupabaseDB.loadAchievements) {
        try {
          const data = await window.SupabaseDB.loadAchievements();
          if (data && Object.keys(data).length > 0) {
            Object.keys(data).forEach(id => {
              const item = document.querySelector(`[data-achievement-id="${id}"]`);
              const stat = document.querySelector(`[data-stat-id="${id}"]`);
              if (item) populateAchievementItem(item, data[id]);
              if (stat) populateStatItem(stat, data[id]);
            });
            loaded = true;
            console.log('%c[Supabase] Achievements loaded from cloud', 'color: #4caf50;');
          }
        } catch(e) {
          console.warn('[Supabase] Achievements cloud load failed:', e.message);
        }
      }
      if (!loaded) originals.loadAchievements();
    };
    
    // ============================================================
    // OVERRIDE: Timeline
    // ============================================================
    window.saveTimelineDataToStorage = function() {
      originals.saveTimeline();
      
      if (window.SupabaseDB && window.SupabaseDB.saveTimeline) {
        try {
          const timelineData = {};
          document.querySelectorAll('[data-timeline-id]').forEach(entry => {
            timelineData[entry.getAttribute('data-timeline-id')] = extractTimelineEntryData(entry);
          });
          window.SupabaseDB.saveTimeline(timelineData);
        } catch(e) {
          console.error('[Supabase] Timeline save error:', e.message);
        }
      }
    };
    
    window.loadTimelineDataFromStorage = async function() {
      let loaded = false;
      
      if (window.SupabaseDB && window.SupabaseDB.loadTimeline) {
        try {
          const data = await window.SupabaseDB.loadTimeline();
          if (data && Object.keys(data).length > 0) {
            Object.keys(data).forEach(id => {
              const el = document.querySelector(`[data-timeline-id="${id}"]`);
              if (el) populateTimelineEntry(el, data[id]);
            });
            loaded = true;
            console.log('%c[Supabase] Timeline loaded from cloud', 'color: #4caf50;');
          }
        } catch(e) {
          console.warn('[Supabase] Timeline cloud load failed:', e.message);
        }
      }
      if (!loaded) originals.loadTimeline();
    };
    
    // ============================================================
    // OVERRIDE: Projects
    // ============================================================
    window.saveProjectDataToStorage = function(projectId, data) {
      if (window.SupabaseDB && window.SupabaseDB.saveProject) {
        window.SupabaseDB.saveProject(projectId, data);
      }
    };
    
    window.saveProjectStatDataToStorage = function(statId, data) {
      if (window.SupabaseDB && window.SupabaseDB.saveProjectStat) {
        window.SupabaseDB.saveProjectStat(statId, data);
      }
    };
    
    window.loadProjectDataFromStorage = async function() {
      let loaded = false;
      
      if (window.SupabaseDB && window.SupabaseDB.loadProjects) {
        try {
          const data = await window.SupabaseDB.loadProjects();
          if (data && Object.keys(data).length > 0) {
            Object.keys(data).forEach(id => {
              const el = document.querySelector(`[data-project-id="${id}"]`);
              if (el) populateProjectCard(el, data[id]);
            });
            loaded = true;
          }
          const stats = await window.SupabaseDB.loadProjectStats();
          if (stats && Object.keys(stats).length > 0) {
            Object.keys(stats).forEach(id => {
              const el = document.querySelector(`[data-stat-id="${id}"]`);
              if (el) populateProjectStat(el, stats[id]);
            });
            loaded = true;
          }
          if (loaded) console.log('%c[Supabase] Projects loaded from cloud', 'color: #4caf50;');
        } catch(e) {
          console.warn('[Supabase] Projects cloud load failed:', e.message);
        }
      }
      if (!loaded) originals.loadProjects();
    };
    
    // ============================================================
    // OVERRIDE: Testimonials
    // ============================================================
    window.saveTestimonialDataToStorage = function(testimonialId, data) {
      if (window.SupabaseDB && window.SupabaseDB.saveTestimonial) {
        window.SupabaseDB.saveTestimonial(testimonialId, data);
      }
    };
    
    window.saveTestimonialStatDataToStorage = function(statId, data) {
      if (window.SupabaseDB && window.SupabaseDB.saveTestimonialStat) {
        window.SupabaseDB.saveTestimonialStat(statId, data);
      }
    };
    
    window.loadTestimonialDataFromStorage = async function() {
      let loaded = false;
      
      if (window.SupabaseDB && window.SupabaseDB.loadTestimonials) {
        try {
          const data = await window.SupabaseDB.loadTestimonials();
          if (data && Object.keys(data).length > 0) {
            Object.keys(data).forEach(id => {
              const el = document.querySelector(`[data-testimonial-id="${id}"]`);
              if (el) populateTestimonialCard(el, data[id]);
            });
            loaded = true;
          }
          const stats = await window.SupabaseDB.loadTestimonialStats();
          if (stats && Object.keys(stats).length > 0) {
            Object.keys(stats).forEach(id => {
              const el = document.querySelector(`[data-testimonial-stat-id="${id}"]`);
              if (el) populateTestimonialStat(el, stats[id]);
            });
            loaded = true;
          }
          if (loaded) console.log('%c[Supabase] Testimonials loaded from cloud', 'color: #4caf50;');
        } catch(e) {
          console.warn('[Supabase] Testimonials cloud load failed:', e.message);
        }
      }
      if (!loaded) originals.loadTestimonials();
    };
    
    // ============================================================
    // OVERRIDE: Blog
    // ============================================================
    window.saveBlogDataToStorage = function(postId, data) {
      if (window.SupabaseDB && window.SupabaseDB.saveBlog) {
        window.SupabaseDB.saveBlog(postId, data);
      }
    };
    
    window.loadBlogDataFromStorage = async function() {
      let loaded = false;
      
      if (window.SupabaseDB && window.SupabaseDB.loadBlog) {
        try {
          const data = await window.SupabaseDB.loadBlog();
          if (data && Object.keys(data).length > 0) {
            Object.keys(data).forEach(id => {
              const el = document.querySelector(`[data-blog-id="${id}"]`);
              if (el) populateBlogPost(el, data[id]);
            });
            loaded = true;
            console.log('%c[Supabase] Blog loaded from cloud', 'color: #4caf50;');
          }
        } catch(e) {
          console.warn('[Supabase] Blog cloud load failed:', e.message);
        }
      }
      if (!loaded) originals.loadBlog();
    };
    
    // ============================================================
    // RE-TRIGGER DATA LOADING from Supabase
    // Since the original DOMContentLoaded already called the old functions,
    // we need to call the NEW overridden functions to load from Supabase
    // ============================================================
    setTimeout(async () => {
      console.log('%c[Supabase] Re-loading all data from cloud...', 'color: #ff9800; font-weight: bold;');
      
      try {
        await window.loadEducationDataFromStorage();
        await window.loadEducationCardDataFromStorage();
        await window.loadAchievementDataFromStorage();
        await window.loadTimelineDataFromStorage();
        await window.loadProjectDataFromStorage();
        await window.loadTestimonialDataFromStorage();
        await window.loadBlogDataFromStorage();
        console.log('%c[Supabase] All data re-loaded from cloud successfully!', 'color: #4caf50; font-weight: bold;');
      } catch (e) {
        console.error('[Supabase] Error re-loading data:', e);
      }
    }, 2000);
    
    // ============================================================
    // MIGRATE existing localStorage data to Supabase
    // ============================================================
    setTimeout(async () => {
      console.log('%c[Supabase] Checking for localStorage data to migrate...', 'color: #ff9800;');
      try {
        const result = await window.SupabaseDB.migrate();
        console.log(`%c[Supabase] Migration: ${result.migrated} tables migrated, ${result.errors} errors`, 
          result.errors === 0 ? 'color: #4caf50;' : 'color: #ff9800;');
      } catch (e) {
        console.warn('[Supabase] Migration check:', e.message);
      }
    }, 5000);
    
    console.log('%c[Supabase Injector] All overrides injected successfully!', 'color: #4caf50; font-weight: bold;');
  }
  
  // ============================================================
  // HELPER FUNCTIONS (copied from index.html for data extraction)
  // ============================================================
  function extractEducationItemData(item) {
    const data = {};
    const fields = item.querySelectorAll('.education-editable-field');
    fields.forEach(field => {
      const ft = field.getAttribute('data-field');
      switch(ft) {
        case 'year': data.year = field.querySelector('.education-timeline-year')?.textContent || ''; break;
        case 'title': data.title = field.querySelector('.education-timeline-title')?.textContent || ''; break;
        case 'institution': data.institution = field.querySelector('.education-timeline-institution')?.textContent || ''; break;
        case 'description': data.description = field.querySelector('.education-timeline-description')?.textContent || ''; break;
        case 'highlights':
          data.highlights = Array.from(field.querySelectorAll('.education-timeline-highlights li')).map(li => li.textContent.trim()).filter(t => t);
          break;
      }
    });
    return data;
  }
  
  function extractCardData(card) {
    const data = {};
    const fields = card.querySelectorAll('.education-card-editable-field');
    fields.forEach(field => {
      const ft = field.getAttribute('data-field');
      if (ft === 'icon') data.icon = field.querySelector('.education-card-icon')?.textContent || '';
      else if (ft === 'title') data.title = field.querySelector('.education-card-title')?.textContent || '';
      else if (ft === 'content') data.content = field.querySelector('.education-card-content')?.innerHTML || '';
    });
    return data;
  }
  
  function extractAchievementItemData(item) {
    const data = {};
    const fields = item.querySelectorAll('.achievement-editable-field');
    fields.forEach(field => {
      const ft = field.getAttribute('data-field');
      if (ft === 'icon') data.icon = field.querySelector('.achievement-showcase-icon')?.textContent || '';
      else if (ft === 'title') data.title = field.querySelector('.achievement-showcase-title, h3')?.textContent || '';
      else if (ft === 'category') data.category = field.querySelector('.achievement-showcase-category')?.textContent || '';
      else if (ft === 'description') data.description = field.querySelector('.achievement-showcase-description, p')?.textContent || '';
      else if (ft === 'details') data.details = Array.from(field.querySelectorAll('.achievement-showcase-details li')).map(li => li.textContent.trim()).filter(t => t);
    });
    return data;
  }
  
  function extractStatItemData(item) {
    const data = {};
    const fields = item.querySelectorAll('.achievement-stat-editable-field');
    fields.forEach(field => {
      const ft = field.getAttribute('data-field');
      if (ft === 'number') data.number = field.querySelector('.achievement-stat-number')?.textContent || '';
      else if (ft === 'label') data.label = field.querySelector('.achievement-stat-label')?.textContent || '';
    });
    return data;
  }
  
  function extractTimelineEntryData(entry) {
    const data = {};
    const fields = entry.querySelectorAll('.timeline-editable-field');
    fields.forEach(field => {
      const ft = field.getAttribute('data-field');
      if (ft === 'date') data.date = field.querySelector('.timeline-date')?.textContent || '';
      else if (ft === 'title') data.title = field.querySelector('.timeline-title')?.textContent || '';
      else if (ft === 'company') data.company = field.querySelector('.timeline-company')?.textContent || '';
      else if (ft === 'description') data.description = field.querySelector('.timeline-description')?.textContent || '';
    });
    return data;
  }
  
  // Start trying to inject
  tryInject();
})();