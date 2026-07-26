with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Remove the AI & Machine Learning tab from main tabs
c = c.replace(
    '        <button class="projects-tab" onclick="switchProjectsTab(\'ai\')">AI & Machine Learning</button>\n',
    ''
)

# 2. Update the All Projects tab label to just "All"
c = c.replace(
    "        <button class=\"projects-tab\" onclick=\"switchProjectsTab('all')\">All Projects</button>",
    "        <button class=\"projects-tab\" onclick=\"switchProjectsTab('all')\">All</button>"
)

# Save the updated content
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated labels and removed AI tab')
print('\nNew tabs section:')
tabs_start = c.find('<div class="projects-tabs">')
tabs_end = c.find('</div>', tabs_start) + 6
print(c[tabs_start:tabs_end])