# -*- coding: utf-8 -*-

import sys
import os

main_path = sys.argv[1]

for item in os.listdir(main_path):
    if item.endswith(".ejs"):
        os.remove(os.path.join(main_path, item))

for filename in os.listdir(main_path):
    infilename = os.path.join(main_path, filename)
    if os.path.isfile(infilename):
        oldbase = os.path.splitext(filename)[-1]

        if oldbase == '.html':
            with open(infilename, 'r', encoding='utf-8') as file:
                data: str = file.read()

            with open(infilename, 'w', encoding='utf-8') as file:
                file.write(data.replace('HOST = "http://localhost:8000"', 'HOST = "http://<%- HOSTNAME %>:<%- PORT %>"', 1))

            newname = infilename.replace('.html', '.ejs')
            output = os.rename(infilename, newname)
