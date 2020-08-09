#!/bin/sh
if [ "$dev" = "true" ]; then
    npm run dev
    exit 0
else
    npm run prod
    exit 0
fi

