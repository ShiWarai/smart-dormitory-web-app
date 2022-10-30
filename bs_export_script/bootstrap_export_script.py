# -*- coding: utf-8 -*-

import sys
import os

main_path = sys.argv[1]

for item in os.listdir(main_path):
    if item.endswith(".ejs"):
        os.remove(os.path.join(main_path, item))

for filename in os.listdir(main_path):
    infilename = os.path.join(main_path, filename)
    if not os.path.isfile(infilename):
        continue
    oldbase = os.path.splitext(filename)
    newname = infilename.replace('.html', '.ejs')
    output = os.rename(infilename, newname)
