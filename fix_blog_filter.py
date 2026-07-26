with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The blog section at line 17654 incorrectly uses "projects-filter" class
# It should be changed to "blog-filter" or similar
old_blog_filter = '''        <div class="projects-filter">
          <!-- Comprehensive Blog Interface -->'''

new_blog_filter = '''        <!-- Comprehensive Blog Interface -->'''

content = content.replace(old_blog_filter, new_blog_filter)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed blog section class name in index.html")