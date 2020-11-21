#!/bin/sh

echo 'Running yarn install!'
yarn install --network-timeout 60000

# Run dev server or tests.
if [ "$RUN_TESTS" = true ] ; then
    BROWSER=none yarn lint && yarn test && yarn audit && yarn test:coverage
else
    BROWSER=none yarn start;
fi
