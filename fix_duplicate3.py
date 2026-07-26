with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line numbers where "projects-filter" appears
filter_lines = []
for i, line in enumerate(lines):
    if 'projects-filter' in line and i > 17100:  # Only in the projects section
        filter_lines.append(i)

print(f"Found projects-filter at lines: {filter_lines}")

# If there are duplicates (more than one in the projects section), remove the second one
if len(filter_lines) >= 2:
    # Find the start of the second duplicate section
    second_filter_line = filter_lines[1]
    
    # Find where this section starts (look backwards for the div with id="all")
    section_start = None
    for i in range(second_filter_line, max(0, second_filter_line - 20), -1):
        if 'id="all"' in lines[i]:
            section_start = i
            break
    
    if section_start:
        print(f"Second duplicate section starts at line {section_start}")
        # Find the end of this section (closing div tag)
        section_end = None
        for i in range(second_filter_line, min(len(lines), second_filter_line + 20)):
            if '</div>' in lines[i] and i > second_filter_line + 5:
                section_end = i + 1
                break
        
        if section_end:
            print(f"Second duplicate section ends at line {section_end}")
            print(f"Removing lines {section_start} to {section_end}")
            # Remove the duplicate section
            del lines[section_start:section_end]

with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Fixed duplicate section in index.html")