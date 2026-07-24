/**
 * Supabase Injector Script
 * Overrides existing save/load functions in index.html to add Supabase persistence.
 * Load this AFTER the main <script> block in index.html.
 * This avoids modifying the massive index.html file directly.
 */

console.log('%c[Supabase Injector] Initializing...', 'color: #4facfe; font-weight: bold;');

// Wait for DOM and main script to fully load
(function() {
  let retries = 0;
  const maxRetries = 20;
  
  const checkAndInject = setInterval(() => {
    retries++;
    
    // Check if the main functions exist and SupabaseDB is ready
    if (typeof window.SupabaseDB !== 'undefined' && 
        typeof saveEducationDataToStorage === 'function' &&
        typeof loadEducationDataFromStorage === 'function') {
      
      clearInterval(checkAndInject);
      console.log('%c[Supabase Injector] Functions found, injecting...', 'color: #4caf50;');
      injectOverrides();
    } else if (retries >= maxRetries) {
      clearInterval(checkAndInject);
      console.warn('[Supabase Injector] Timed out waiting for main functions');
    }
  }, 1000);
  
  function injectOverrides() {
    // ============================================================
    // Store original functions
    // ============================================================
    const originalSaveEducation = saveEducationDataToStorage;
    const originalLoadEducation = loadEducationDataFromStorage;
    const originalSaveEducationCards = saveEducationCardDataToStorage;
    const originalLoadEducationCards = loadEducationCardDataFromStorage;
    const originalSaveAchievements = saveAchievementDataToStorage;
    const originalLoadAchievements = loadAchievementDataFromStorage;
    const originalSaveTimeline = saveTimelineDataToStorage;
    const originalLoadTimeline = loadTimelineDataFromStorage;
    const originalLoadProjects = loadProjectDataFromStorage;
    const originalLoadTestimonials = loadTestimonialDataFromStorage;
    const originalLoadBlog = loadBlogDataFromStorage;
    
    // ============================================================
    // Override: Education Data
    // ============================================================
    window.saveEducationDataToStorage = function() {
      originalSaveEducation();
      
      if (window.SupabaseDB && window.SupabaseDB.saveEducation) {
        try {
          const educationData = {};
          const items = document.querySelectorAll('[data-education-id]');
          items.forEach(item => {
            educationData[item.getAttribute('data-education-id')] = extractEducationItemData(item);
          });
          window.SupabaseDB.saveEducation(educationData);
          console.log('[Supabase] Education data synced');
        } catch(e) {
          console.error('[Supabase] Education save error:', e.message);
        }
      }
    };
    
    window.loadEducationDataFromStorage = async function() {
      // Try Supabase first
      let loaded = false;
      if (window.SupabaseDB && window.SupabaseDB.loadEducation) {
        try {
          const data = await window.SupabaseDB.loadEducation();
          if (data && Object.keys(data).length > 0) {
            Object.keys(data).forEach(id => {
              const el = document.querySelector(`[data-education-id="${id}"]`);
              if (el) populateEducationItem(el, data[id]);
            });
            loaded = true;
            console.log('[Supabase] Education data loaded from cloud');
          }
        } catch(e) {
          console.warn('[Supabase] Education load error:', e.message);
        }
      }
      
      // Fallback to original (localStorage)
      if (!loaded) {
        originalLoadEducation();
      }
    };
    
    // ============================================================
    // Override: Education Cards
    // ============================================================
    window.saveEducationCardDataToStorage = function() {
      originalSaveEducationCards();
      
      if (window.SupabaseDB && window.SupabaseDB.saveEducationCards) {
        try {
          const cardData = {};
          const cards = document.querySelectorAll('[data-card-id]');
          cards.forEach(card => {
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
          }
        } catch(e) {
          console.warn('[Supabase] Cards load error:', e.message);
        }
      }
      if (!loaded) originalLoadEducationCards();
    };
    
    // ============================================================
    // Override: Achievements
    // ============================================================
    window.saveAchievementDataToStorage = function() {
      originalSaveAchievements();
      
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
          }
        } catch(e) {
          console.warn('[Supabase] Achievements load error:', e.message);
        }
      }
      if (!loaded) originalLoadAchievements();
    };
    
    // ============================================================
    // Override: Timeline
    // ============================================================
    window.saveTimelineDataToStorage = function() {
      originalSaveTimeline();
      
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
          }
        } catch(e) {
          console.warn('[Supabase] Timeline load error:', e.message);
        }
      }
      if (!loaded) originalLoadTimeline();
    };
    
    // ============================================================
    // Override: Projects
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
        } catch(e) {
          console.warn('[Supabase] Projects load error:', e.message);
        }
      }
      if (!loaded) originalLoadProjects();
    };
    
    // ============================================================
    // Override: Testimonials
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
        } catch(e) {
          console.warn('[Supabase] Testimonials load error:', e.message);
        }
      }
      if (!loaded) originalLoadTestimonials();
    };
    
    // ============================================================
    // Override: Blog
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
          }
        } catch(e) {
          console.warn('[Supabase] Blog load error:', e.message);
        }
      }
      if (!loaded) originalLoadBlog();
    };
    
    // ============================================================
    // Trigger initial data migration from localStorage to Supabase
    // ============================================================
    setTimeout(async () => {
      console.log('%c[Supabase] Starting data migration check...', 'color: #ff9800;');
      try {
        const result = await window.SupabaseDB.migrate();
        console.log(`%c[Supabase] Migration result: ${result.migrated} tables migrated, ${result.errors} errors`, 
          result.errors === 0 ? 'color: #4caf50;' : 'color: #ff9800;');
      } catch (e) {
        console.warn('[Supabase] Migration skipped (will retry on next save):', e.message);
      }
    }, 3000);
    
    console.log('%c[Supabase Injector] All overrides injected successfully!', 'color: #4caf50; font-weight: bold;');
  }
  
  // Helper: extract education item data (copied from index.html)
  function extractEducationItemData(item) {
    const data = {};
    const fields = item.querySelectorAll('.education-editable-field');
    fields.forEach(field => {
      const fieldType = field.getAttribute('data-field');
      switch(fieldType) {
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
})();