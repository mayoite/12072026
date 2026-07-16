import re

with open('e:/12072026/site/features/admin/svg-editor/AdminSvgEditorEditView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the panels
match = re.search(r'(<div className="admin-panel admin-svg-engine-shell__panel">\s*<div className="admin-panel__header">Draft preview.*?<\/article>)', content, re.DOTALL)
if not match:
    print('Panels not found!')
    exit(1)

panels = match.group(1)

# Remove the panels from their original location
content = content.replace(panels, '')

# Insert them before the closing </aside> of the left rail
left_rail_end = '''            )}
            Publish
          </button>
        </aside>'''

new_left_rail_end = '''            )}
            Publish
          </button>
          
          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
''' + panels + '''
          </div>
        </aside>'''

if left_rail_end in content:
    content = content.replace(left_rail_end, new_left_rail_end)
    with open('e:/12072026/site/features/admin/svg-editor/AdminSvgEditorEditView.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Successfully moved panels.')
else:
    print('Left rail end not found!')
