#!/bin/bash

# Run each resilience test individually using ts-node instead of Jest
echo "Running circuit-breaker.test.ts..."
ts-node --project ../../../../tsconfig.json -r tsconfig-paths/register circuit-breaker.test.ts || exit 1

echo "Running rate-limiter.resilience.test.ts..."
ts-node --project ../../../../tsconfig.json -r tsconfig-paths/register rate-limiter.resilience.test.ts || exit 1

echo "Running retry-strategy.test.ts..."
ts-node --project ../../../../tsconfig.json -r tsconfig-paths/register retry-strategy.test.ts || exit 1

echo "All tests passed!"
exit 0