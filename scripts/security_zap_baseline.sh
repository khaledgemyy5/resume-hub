#!/bin/bash
# security_zap_baseline.sh
# Run OWASP ZAP baseline security scan against the running stack
# Outputs HTML and JSON reports to ./reports/

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPORTS_DIR="$PROJECT_ROOT/reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== OWASP ZAP Baseline Security Scan ===${NC}"
echo ""

# Create reports directory if it doesn't exist
mkdir -p "$REPORTS_DIR"

# Default target URL (can be overridden via environment)
TARGET_URL="${ZAP_TARGET_URL:-http://localhost:5173}"
API_URL="${ZAP_API_URL:-http://localhost:3001}"

echo -e "${YELLOW}Target URLs:${NC}"
echo "  Web: $TARGET_URL"
echo "  API: $API_URL"
echo ""

# Check if docker is available
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is required but not installed.${NC}"
    exit 1
fi

# Check if the stack is running
echo "Checking if services are available..."

check_service() {
    local url=$1
    local name=$2
    local max_attempts=5
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "^[23]"; then
            echo -e "  ${GREEN}✓${NC} $name is available"
            return 0
        fi
        echo "  Waiting for $name... (attempt $attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done

    echo -e "  ${RED}✗${NC} $name is not available at $url"
    return 1
}

# Check services (with fallback for SSH tunnels)
WEB_AVAILABLE=true
API_AVAILABLE=true

check_service "$TARGET_URL" "Web app" || WEB_AVAILABLE=false
check_service "$API_URL/health" "API" || API_AVAILABLE=false

if [ "$WEB_AVAILABLE" = false ] && [ "$API_AVAILABLE" = false ]; then
    echo ""
    echo -e "${RED}Error: No services are available.${NC}"
    echo "Make sure the stack is running:"
    echo "  docker compose up -d"
    echo ""
    echo "If using SSH tunnels, ensure they're active:"
    echo "  ssh -L 5173:localhost:5173 -L 3001:localhost:3001 user@your-ec2"
    exit 1
fi

echo ""
echo -e "${GREEN}Starting ZAP baseline scan...${NC}"
echo ""

# Run ZAP baseline scan against web app
if [ "$WEB_AVAILABLE" = true ]; then
    echo "Scanning web application..."
    
    docker run --rm \
        --network="host" \
        -v "$REPORTS_DIR:/zap/wrk:rw" \
        -t ghcr.io/zaproxy/zaproxy:stable \
        zap-baseline.py \
        -t "$TARGET_URL" \
        -r "zap_web_report_${TIMESTAMP}.html" \
        -J "zap_web_report_${TIMESTAMP}.json" \
        -I \
        --auto || true
    
    echo ""
fi

# Run ZAP baseline scan against API
if [ "$API_AVAILABLE" = true ]; then
    echo "Scanning API..."
    
    docker run --rm \
        --network="host" \
        -v "$REPORTS_DIR:/zap/wrk:rw" \
        -t ghcr.io/zaproxy/zaproxy:stable \
        zap-baseline.py \
        -t "$API_URL" \
        -r "zap_api_report_${TIMESTAMP}.html" \
        -J "zap_api_report_${TIMESTAMP}.json" \
        -I \
        --auto || true
    
    echo ""
fi

# Create a summary
echo -e "${GREEN}=== Scan Complete ===${NC}"
echo ""
echo "Reports saved to: $REPORTS_DIR/"
ls -la "$REPORTS_DIR/"*${TIMESTAMP}* 2>/dev/null || echo "  (No reports generated)"
echo ""

# Check for high-severity findings
echo "Checking for critical findings..."

if [ -f "$REPORTS_DIR/zap_web_report_${TIMESTAMP}.json" ]; then
    HIGH_ALERTS=$(cat "$REPORTS_DIR/zap_web_report_${TIMESTAMP}.json" | grep -o '"riskdesc":"High' | wc -l || echo "0")
    if [ "$HIGH_ALERTS" -gt 0 ]; then
        echo -e "${RED}⚠ Found $HIGH_ALERTS high-severity alerts in web scan!${NC}"
    else
        echo -e "${GREEN}✓ No high-severity alerts in web scan${NC}"
    fi
fi

if [ -f "$REPORTS_DIR/zap_api_report_${TIMESTAMP}.json" ]; then
    HIGH_ALERTS=$(cat "$REPORTS_DIR/zap_api_report_${TIMESTAMP}.json" | grep -o '"riskdesc":"High' | wc -l || echo "0")
    if [ "$HIGH_ALERTS" -gt 0 ]; then
        echo -e "${RED}⚠ Found $HIGH_ALERTS high-severity alerts in API scan!${NC}"
    else
        echo -e "${GREEN}✓ No high-severity alerts in API scan${NC}"
    fi
fi

echo ""
echo "Review the HTML reports for detailed findings."
