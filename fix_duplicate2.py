with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and remove the duplicate section that starts at line 17141
# This is a projects-tab-content div with id="all" that contains a projects-filter
duplicate_start = '''      <div class="projects-tab-content" id="all">
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

# Find the position of the first occurrence (the correct one)
first_pos = content.find(duplicate_start)
if first_pos != -1:
    # Find the second occurrence
    second_pos = content.find(duplicate_start, first_pos + 1)
    if second_pos != -1:
        # Remove the second occurrence
        content = content[:second_pos] + content[second_pos + len(duplicate_start):]
        print(f"Removed duplicate section at position {second_pos}")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed duplicate section in index.html")