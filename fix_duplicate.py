with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and remove the duplicate projects-filter section
# The pattern shows there's a duplicate after line 17141
duplicate_section = '''      <div class="projects-tab-content" id="all">
        <div class="projects-filter">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="web">Web</button>
          <button class="filter-btn" data-filter="ai">AI/ML</button>
          <button class="filter-btn" data-filter="mobile">Mobile</button>
          <button class="filter-btn" data-filter="systems">Systems</button>
          <button class="filter-btn" data-filter="graphics">Graphics</button>
          <button class="filter-btn" data-filter="desktop">Desktop</button>
        </div>
      </div>'''

# Remove the duplicate (the second occurrence)
content = content.replace(duplicate_section, '', 1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed duplicate section from index.html")