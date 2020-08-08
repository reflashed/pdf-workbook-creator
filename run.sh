#!/bin/sh
if [ "$dev" = "true" ]; then
    npm run dev
else
    npm run prod
fi

