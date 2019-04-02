import sys
import datetime

last_tag = sys.argv[1]
project_code = last_tag.split('/')[0]

today = datetime.datetime.now().strftime('%Y.%m.%d')
if last_tag.startswith(project_code + '/' + today):
    last_tag_number = int(last_tag[len(project_code + '/' + today):])
    new_tag = project_code + '/' + today + str((last_tag_number + 1)).zfill(3)
else:
    new_tag = project_code + '/' + today + '001'

print(new_tag, end='')
