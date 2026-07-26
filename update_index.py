import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the projects-tabs section
old_tabs = '''      <div class="projects-tabs">
        <button class="projects-tab active" onclick="switchProjectsTab('featured')">Featured Projects</button>
        <button class="projects-tab" onclick="switchProjectsTab('web')">Web Development</button>
        <button class="projects-tab" onclick="switchProjectsTab('mobile')">Mobile & Apps</button>
        <button class="projects-tab" onclick="switchProjectsTab('systems')">Systems & Graphics</button>
        <button class="projects-tab" onclick="switchProjectsTab('all')">All</button>
      </div>'''

new_tabs = '''      <div class="projects-tabs">
        <button class="projects-tab active" onclick="switchProjectsTab('all')">All Projects</button>
      </div>'''

content = content.replace(old_tabs, new_tabs)

# Replace the featured projects tab content and other tabs with just the all tab
# Find the section from "<!-- Featured Projects Tab -->" to "<!-- All Projects Tab -->"
pattern = r'      <!-- Featured Projects Tab -->.*?      <!-- All Projects Tab -->'
replacement = '''      <!-- All Projects Tab -->
      <div class="projects-tab-content active" id="all">
        <div class="projects-filter">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="web">Web</button>
          <button class="filter-btn" data-filter="ai">AI/ML</button>
          <button class="filter-btn" data-filter="mobile">Mobile</button>
          <button class="filter-btn" data-filter="systems">Systems</button>
          <button class="filter-btn" data-filter="graphics">Graphics</button>
          <button class="filter-btn" data-filter="desktop">Desktop</button>
        </div>'''

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Remove the individual tab content sections (web, ai, mobile, systems)
# Keep only the "all" tab content
sections_to_remove = [
    r'      <!-- Web Development Tab -->\n      <div class="projects-tab-content" id="web">.*?</div>\n\n',
    r'      <!-- AI & Machine Learning Tab -->\n      <div class="projects-tab-content" id="ai">.*?</div>\n\n',
    r'      <!-- Mobile & Apps Tab -->\n      <div class="projects-tab-content" id="mobile">.*?</div>\n\n',
    r'      <!-- Systems & Graphics Tab -->\n      <div class="projects-tab-content" id="systems">.*?</div>\n\n',
]

for pattern in sections_to_remove:
    content = re.sub(pattern, '', content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html successfully")