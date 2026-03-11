#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONTAINER_NAME="marmite-feeds-demo"
DOCKER_IMAGE="ghcr.io/rochacbruno/marmite:latest"

sync_files() {
  mkdir -p "$SCRIPT_DIR/demo/static"
  cp "$SCRIPT_DIR/marmite-feeds.js"  "$SCRIPT_DIR/demo/static/marmite-feeds.js"
  cp "$SCRIPT_DIR/marmite-feeds.css" "$SCRIPT_DIR/demo/static/marmite-feeds.css"
  echo "synced marmite-feeds.js and .css → demo/static/"
}

cmd_start() {
  if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "already running — stop it first with: $0 stop"
    exit 1
  fi
  sync_files
  docker run -d --rm \
    --name "$CONTAINER_NAME" \
    -v "$SCRIPT_DIR/demo:/content:ro" \
    -p 8000:8000 \
    --entrypoint /bin/marmite \
    "$DOCKER_IMAGE" \
    --serve --watch /content /tmp/site > /dev/null
  echo "demo running at http://localhost:8000"
  echo "stop with: $0 stop  |  logs with: $0 logs"
}

cmd_stop() {
  if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    docker stop "$CONTAINER_NAME"
    echo "stopped."
  else
    echo "not running."
  fi
}

cmd_logs() {
  docker logs -f "$CONTAINER_NAME"
}

case "${1:-start}" in
  start) cmd_start ;;
  stop)  cmd_stop  ;;
  logs)  cmd_logs  ;;
  *)
    echo "usage: $0 [start|stop|logs]"
    exit 1
    ;;
esac
