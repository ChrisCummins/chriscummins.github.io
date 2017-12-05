#!/usr/bin/env python3
#
# Print a JSON file as a list of lines.
#

import json
import sys


def json2txt(data, depth=0):

    def stringify(val):
        return '\t' * depth + '- ' + str(val)

    if isinstance(data, dict):
        for k, v in data.items():
            yield stringify(k)
            yield from json2txt(v, depth + 1)
    elif isinstance(data, list):
        for item in data:
            yield from json2txt(item, depth + 1)
    else:
        yield stringify(data)


if __name__ == "__main__":
    for line in json2txt(json.load(sys.stdin)):
        print(line)
