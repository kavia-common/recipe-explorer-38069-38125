#!/bin/bash
cd /home/kavia/workspace/code-generation/recipe-explorer-38069-38125/frontend_react_js
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

