with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("=== Verification of Changes ===\n")

# Check 1: Verify old buttons are removed
old_buttons = [
    "switchProjectsTab('featured')",
    "switchProjectsTab('web')",
    "switchProjectsTab('ai')",
    "switchProjectsTab('mobile')",
    "switchProjectsTab('systems')"
]

print("1. Checking if old category buttons are removed:")
for button in old_buttons:
    if button in content:
        print(f"   ❌ Found: {button}")
    else:
        print(f"   ✓ Removed: {button}")

# Check 2: Verify new structure exists
print("\n2. Checking if new 'All Projects' button exists:")
if 'switchProjectsTab(\'all\')' in content and 'All Projects' in content:
    print("   ✓ Found: All Projects button")
else:
    print("   ❌ Missing: All Projects button")

# Check 3: Verify filter buttons exist
print("\n3. Checking if filter buttons exist:")
filter_buttons = ['data-filter="all"', 'data-filter="web"', 'data-filter="ai"', 
                  'data-filter="mobile"', 'data-filter="systems"', 
                  'data-filter="graphics"', 'data-filter="desktop"']
for btn in filter_buttons:
    if btn in content:
        print(f"   ✓ Found: {btn}")
    else:
        print(f"   ❌ Missing: {btn}")

# Check 4: Count occurrences of projects-filter
filter_count = content.count('class="projects-filter"')
print(f"\n4. Number of projects-filter sections: {filter_count}")
if filter_count == 1:
    print("   ✓ Correct: Only one projects-filter section")
else:
    print(f"   ❌ Error: Expected 1, found {filter_count}")

# Check 5: Verify no duplicate "All Projects Tab" comments
all_projects_count = content.count('<!-- All Projects Tab -->')
print(f"\n5. Number of 'All Projects Tab' comments: {all_projects_count}")
if all_projects_count == 1:
    print("   ✓ Correct: Only one All Projects Tab section")
else:
    print(f"   ❌ Error: Expected 1, found {all_projects_count}")

print("\n=== Verification Complete ===")