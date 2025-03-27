#!/bin/sh -l

set -e

# 設定 NODE_PATH 並執行 index.js
NODE_PATH=/var/task/node_modules node /var/task/index.js
