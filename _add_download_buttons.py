#!/usr/bin/env python3
"""Add Download Data Sheet buttons to products.html based on product mapping."""
import json
import os
import re

with open('asset/data-sheets/_product_mapping.json') as f:
    mapping = json.load(f)

with open('products.html', 'r') as f:
    html = f.read()

lines = html.split('\n')
new_lines = []
i = 0
modified_count = 0

while i < len(lines):
    line = lines[i]
    new_lines.append(line)

    # Detect a product card header with product name
    m = re.search(r'<h3 class="prod-name">(.*?)</h3>', line)
    if m:
        prod_name = m.group(1).strip()
        pdf_name = mapping.get(prod_name)
        if pdf_name:
            # Look ahead to find the shop-actions div for this card
            # We need to insert the download link inside the shop-actions div
            pass
    i += 1

# Alternative approach: process the whole HTML with string manipulation
# Use regex to find shop-actions divs that come after prod-name

# Split by shop-card divs and process each card
result = ''
remaining = html
count = 0

# Process card by card
while True:
    # Find start of shop-card
    card_start = remaining.find('<div class="shop-card">')
    if card_start == -1:
        result += remaining
        break
    
    result += remaining[:card_start]
    remaining = remaining[card_start:]
    
    # Find next shop-card or end
    next_card = remaining.find('<div class="shop-card">', 1)
    if next_card == -1:
        # Last card, find closing of containing div
        card_end = remaining.find('</div>', remaining.find('<div class="shop-card">'))
        # Actually let's find the proper end - look for the closing </div> of the cat-grid's outer wrapper
        # Better: find the shop-actions div and work with it
        card_end = len(remaining)
    
    if next_card != -1:
        card_html = remaining[:next_card]
        remaining = remaining[next_card:]
    else:
        card_html = remaining
        remaining = ''
    
    # Extract product name from this card
    name_match = re.search(r'<h3 class="prod-name">(.*?)</h3>', card_html)
    if name_match:
        prod_name = name_match.group(1).strip()
        pdf_name = mapping.get(prod_name)
        if pdf_name:
            # Find shop-actions div
            actions_match = re.search(r'(<div class="shop-actions">)', card_html)
            if actions_match:
                # Insert download link after Order Now, before Product Manual
                # Find the Product Manual link and insert before it
                pm_link = '<a href="#" class="btn-ghost">Product Manual</a>'
                dl_link = f'<a href="asset/data-sheets/{pdf_name}" class="btn-ghost" download>Download Data Sheet</a>\n                            '
                
                if pm_link in card_html:
                    card_html = card_html.replace(pm_link, dl_link + pm_link)
                    count += 1
                else:
                    # Fallback: insert at beginning of shop-actions
                    card_html = card_html.replace(
                        '<div class="shop-actions">',
                        f'<div class="shop-actions">\n                            {dl_link}'
                    )
                    count += 1

    result += card_html

with open('products.html', 'w') as f:
    f.write(result)

print(f"Added {count} download data sheet buttons")
