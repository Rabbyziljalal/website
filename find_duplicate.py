with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Find what's around the second active filter button (the old duplicate)
pos = 614680
print('Context around second All tab:')
print(c[pos-100:pos+12000])