#!/usr/bin/env bash
#
# rebuild-docker.sh — Build the Protoforge Docker image from source.
#
# Builds the client, RTS, server, generates metadata, and assembles
# everything into a Docker image tagged "protoforge".
#
# Usage:
#   ./rebuild-docker.sh                  # full rebuild
#   ./rebuild-docker.sh --skip-client    # skip client build
#   ./rebuild-docker.sh --skip-server    # skip server build
#   ./rebuild-docker.sh --skip-tests     # skip server tests (default)
#   ./rebuild-docker.sh --run-tests      # run server tests
#

set -o errexit
set -o nounset
set -o pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
IMAGE_NAME="protoforge"
BASE_IMAGE="appsmith/base-ce:release"

skip_client=false
skip_server=false
skip_tests=true

for arg in "$@"; do
  case "$arg" in
    --skip-client) skip_client=true ;;
    --skip-server) skip_server=true ;;
    --skip-tests)  skip_tests=true ;;
    --run-tests)   skip_tests=false ;;
    --help|-h)
      sed -n '2,/^$/s/^# \?//p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg" >&2
      exit 1
      ;;
  esac
done

#
# Preflight checks
#
check_command() {
  if ! command -v "$1" &>/dev/null; then
    echo "ERROR: '$1' is not installed or not in PATH." >&2
    exit 1
  fi
}

check_command docker
check_command node
check_command yarn
check_command java
check_command mvn
check_command jq

node_major="$(node --version | sed 's/^v//' | cut -d. -f1)"
if (( node_major < 20 )); then
  echo "ERROR: Node.js >= 20 is required (found v$(node --version))." >&2
  exit 1
fi

java_major="$(java -version 2>&1 | head -1 | sed 's/.*"\([0-9]*\)\..*/\1/')"
if (( java_major < 17 )); then
  echo "ERROR: Java >= 17 is required (found $java_major)." >&2
  exit 1
fi

echo "============================================"
echo "  Protoforge Docker Image Build"
echo "============================================"
echo ""
echo "  Image name:   $IMAGE_NAME"
echo "  Base image:   $BASE_IMAGE"
echo "  Skip client:  $skip_client"
echo "  Skip server:  $skip_server"
echo "  Skip tests:   $skip_tests"
echo ""

build_start="$SECONDS"

#
# Step 1: Build the client
#
if [[ "$skip_client" == false ]]; then
  echo "--------------------------------------------"
  echo "  [1/6] Building client..."
  echo "--------------------------------------------"
  cd "$REPO_ROOT/app/client"
  yarn install --immutable
  ./build.sh

  echo ""
  echo "  [1b/6] Building RTS..."
  cd "$REPO_ROOT/app/client/packages/rts"
  ./build.sh
else
  echo "  [1/6] Skipping client build (--skip-client)"
  if [[ ! -d "$REPO_ROOT/app/client/build" ]]; then
    echo "ERROR: app/client/build/ does not exist. Cannot skip client build." >&2
    exit 1
  fi
  if [[ ! -d "$REPO_ROOT/app/client/packages/rts/dist" ]]; then
    echo "ERROR: app/client/packages/rts/dist/ does not exist. Cannot skip client build." >&2
    exit 1
  fi
fi

#
# Step 2: Build the server
#
if [[ "$skip_server" == false ]]; then
  echo ""
  echo "--------------------------------------------"
  echo "  [2/6] Building server..."
  echo "--------------------------------------------"
  cd "$REPO_ROOT/app/server"

  maven_args=()
  if [[ "$skip_tests" == true ]]; then
    maven_args+=("-DskipTests")
  fi

  ./build.sh "${maven_args[@]}"
else
  echo "  [2/6] Skipping server build (--skip-server)"
  if [[ ! -d "$REPO_ROOT/app/server/dist" ]]; then
    echo "ERROR: app/server/dist/ does not exist. Cannot skip server build." >&2
    exit 1
  fi
fi

#
# Step 3: Generate info.json
#
echo ""
echo "--------------------------------------------"
echo "  [3/6] Generating info.json..."
echo "--------------------------------------------"
cd "$REPO_ROOT"
scripts/generate_info_json.sh

#
# Step 4: Prepare server artifacts
#
echo ""
echo "--------------------------------------------"
echo "  [4/6] Preparing server artifacts..."
echo "--------------------------------------------"
cd "$REPO_ROOT"
scripts/prepare_server_artifacts.sh

#
# Step 5: Build Docker image
#
echo ""
echo "--------------------------------------------"
echo "  [5/6] Building Docker image..."
echo "--------------------------------------------"
cd "$REPO_ROOT"

commit_sha="$(git rev-parse HEAD)"
version="$(jq -r .version deploy/docker/fs/opt/appsmith/info.json)"

# Docker tags must match [a-zA-Z0-9_.-] and not start with '.' or '-'.
# If generate_info_json.sh produced a bad version (e.g. no remote tags exist),
# fall back to a short-sha based tag.
if [[ -z "$version" || "$version" == "null" || ! "$version" =~ ^[a-zA-Z0-9] ]]; then
  version="0.0.0-g$(git rev-parse --short HEAD)"
  echo "  Warning: no valid version from info.json, using $version"
fi

docker build \
  --build-arg "BASE=$BASE_IMAGE" \
  --label "org.opencontainers.image.title=$IMAGE_NAME" \
  --label "org.opencontainers.image.revision=$commit_sha" \
  --label "org.opencontainers.image.version=$version" \
  -t "$IMAGE_NAME" \
  -t "$IMAGE_NAME:$version" \
  .

#
# Step 6: Done
#
elapsed=$(( SECONDS - build_start ))
minutes=$(( elapsed / 60 ))
seconds=$(( elapsed % 60 ))

echo ""
echo "============================================"
echo "  Build complete!"
echo "============================================"
echo ""
echo "  Image:    $IMAGE_NAME"
echo "  Tags:     $IMAGE_NAME:latest  $IMAGE_NAME:$version"
echo "  Elapsed:  ${minutes}m ${seconds}s"
echo ""
echo "  Run with:"
echo ""
echo "    docker run -d -p 8080:80 \\"
echo "      -e APPSMITH_ENCRYPTION_PASSWORD=changeme \\"
echo "      -e APPSMITH_ENCRYPTION_SALT=changeme \\"
echo "      -v ./stacks:/appsmith-stacks \\"
echo "      $IMAGE_NAME"
echo ""
