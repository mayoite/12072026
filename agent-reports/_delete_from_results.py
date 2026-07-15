import shutil
import os

p = r"E:\12072026\agent-reports\from-results"
if os.path.isdir(p):
    shutil.rmtree(p)
    print("deleted", p)
else:
    print("already gone", p)
print("agent-reports remaining:", os.listdir(r"E:\12072026\agent-reports"))
