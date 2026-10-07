#!/usr/bin/env bash

set +e

SITE_URL="https://www.portpetals.com"
INDEXNOW_KEY_FILE="${SITE_URL}/a7982a1642fc4dbe8f592ed4319e5578.txt"

echo "========================================"
echo "PORT PETALS PRODUCTION DEPLOY"
echo "========================================"

echo ""
echo "===== BUILD ====="

npm run build
BUILD_EXIT=$?

if [ "$BUILD_EXIT" -ne 0 ]; then
  echo ""
  echo "Build failed. Deployment cancelled."
  exit "$BUILD_EXIT"
fi

echo ""
echo "===== DEPLOY TO VERCEL ====="

vercel --prod
DEPLOY_EXIT=$?

if [ "$DEPLOY_EXIT" -ne 0 ]; then
  echo ""
  echo "Vercel deployment failed."
  exit "$DEPLOY_EXIT"
fi

echo ""
echo "===== WAIT FOR PRODUCTION ====="

READY=0

for i in $(seq 1 30); do
  HTTP_CODE="$(
    curl -s \
      -o /dev/null \
      -w "%{http_code}" \
      "$SITE_URL"
  )"

  if [ "$HTTP_CODE" = "200" ]; then
    READY=1
    echo "Production site is responding."
    break
  fi

  echo "Waiting for production... attempt $i/30"
  sleep 2
done

if [ "$READY" -ne 1 ]; then
  echo ""
  echo "Production did not become ready in time."
  echo "Deployment may still have succeeded."
  echo "IndexNow submission was skipped."
  exit 1
fi

echo ""
echo "===== VERIFY INDEXNOW KEY ====="

KEY_RESPONSE="$(
  curl -s "$INDEXNOW_KEY_FILE"
)"

if [ "$KEY_RESPONSE" != "a7982a1642fc4dbe8f592ed4319e5578" ]; then
  echo "IndexNow key verification failed."
  echo "IndexNow submission was skipped."
  exit 1
fi

echo "IndexNow key verified."

echo ""
echo "===== SUBMIT INDEXNOW ====="

node scripts/indexnow-submit.mjs
INDEXNOW_EXIT=$?

if [ "$INDEXNOW_EXIT" -ne 0 ]; then
  echo ""
  echo "Deployment succeeded, but IndexNow submission failed."
  exit "$INDEXNOW_EXIT"
fi

echo ""
echo "========================================"
echo "DEPLOYMENT COMPLETE"
echo "========================================"
echo "Production: $SITE_URL"
echo "IndexNow: submitted"
