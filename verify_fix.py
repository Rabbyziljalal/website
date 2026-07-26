with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

print('=== VERIFICATION ===')
print(f'File size: {len(c)} characters')

# Check for duplicate filter buttons
import re
filter_buttons = re.findall(r'<button class="filter-btn active" data-filter="all">All</button>', c)
print(f'\nActive "All" filter buttons found: {len(filter_buttons)}')
if len(filter_buttons) == 1:
    print('✓ Only one active All button (duplicate removed)')
else:
    print('✗ Still have duplicates!')

# Check for the new tabbed interface
if 'class="projects-tabs"' in c:
    print('✓ Tabbed interface exists')
else:
    print('✗ Tabbed interface missing')

if 'data-filter="systems"' in c or 'data-filter="backend"' in c:
    print('✓ Systems/Backend filter exists')
else:
    print('✗ Systems/Backend filter missing')

# Check for blog interface
if '<!-- Comprehensive Blog Interface -->' in c:
    print('✓ Blog interface exists')
else:
    print('✗ Blog interface missing')

# Count total filter buttons
all_filters = re.findall(r'<button class="filter-btn[^"]*" data-filter="([^"]+)">([^<]+)</button>', c)
print(f'\nTotal filter buttons: {len(all_filters)}')
for filter_type, label in all_filters:
    print(f'  - {label} ({filter_type})')

print('\n=== VERIFICATION COMPLETE ===')