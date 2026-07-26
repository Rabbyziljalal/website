with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Find the duplicate block starting at position 614680
# It starts with the second projects-filter and ends before the blog interface
duplicate_start = 614680

# Find where this duplicate block ends (before the blog interface)
blog_start = c.find('<!-- Comprehensive Blog Interface -->')
print(f'Blog interface starts at: {blog_start}')

# Find the end of the duplicate projects section (right before blog)
# Look for the closing divs of the duplicate projects section
duplicate_section = c[duplicate_start:blog_start]
print(f'Duplicate section length: {len(duplicate_section)}')
print('Last 200 chars of duplicate section:')
print(duplicate_section[-200:])

# Remove the duplicate section
new_content = c[:duplicate_start] + c[blog_start:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f'\nRemoved duplicate section from position {duplicate_start} to {blog_start}')
print(f'Original file size: {len(c)}')
print(f'New file size: {len(new_content)}')
print(f'Removed {len(c) - len(new_content)} characters')