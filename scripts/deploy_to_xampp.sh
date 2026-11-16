#!/bin/bash
# ==============================================================================
# HireMatch AI - XAMPP Apache Deployment Script
# Builds the frontend for Apache and prepares htdocs deployment
# ==============================================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "======================================================================"
echo "  HireMatch AI -> XAMPP Apache Deployment"
echo "======================================================================"

# 1. Build Frontend for /hirematch/ subpath
echo "[+] Step 1: Building React frontend for Apache (/hirematch/)..."
cd "$PROJECT_ROOT/frontend"
npm run build -- --base=/hirematch/

# 2. Populate local xampp_htdocs folder inside the project
LOCAL_XAMPP_PKG="$PROJECT_ROOT/xampp_htdocs/hirematch"
echo "[+] Step 2: Packaging files into local $LOCAL_XAMPP_PKG..."
mkdir -p "$LOCAL_XAMPP_PKG"
cp -R "$PROJECT_ROOT/frontend/dist/"* "$LOCAL_XAMPP_PKG/"

# 3. Create Apache .htaccess
cat << 'EOF' > "$LOCAL_XAMPP_PKG/.htaccess"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /hirematch/

  # Optional: Forward API requests to Node backend if mod_proxy is enabled in Apache
  <IfModule mod_proxy.c>
    RewriteRule ^api/(.*) http://localhost:5001/api/$1 [P,L]
  </IfModule>

  # SPA Routing: Send all requests to index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>

<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS"
</IfModule>
EOF

echo "[+] Step 3: Apache .htaccess configured for React SPA routing."

# 4. Attempt to copy to system XAMPP htdocs if available
SYSTEM_HTDOCS=""
if [ -n "$XAMPP_HTDOCS" ] && [ -d "$XAMPP_HTDOCS" ]; then
  SYSTEM_HTDOCS="$XAMPP_HTDOCS"
elif [ -d "/Applications/XAMPP/xamppfiles/htdocs" ]; then
  SYSTEM_HTDOCS="/Applications/XAMPP/xamppfiles/htdocs"
elif [ -d "/opt/lampp/htdocs" ]; then
  SYSTEM_HTDOCS="/opt/lampp/htdocs"
elif [ -d "C:/xampp/htdocs" ]; then
  SYSTEM_HTDOCS="C:/xampp/htdocs"
elif [ -d "/c/xampp/htdocs" ]; then
  SYSTEM_HTDOCS="/c/xampp/htdocs"
fi

DEPLOYED_TO_SYSTEM=false
if [ -n "$SYSTEM_HTDOCS" ]; then
  echo "[+] Detected system XAMPP htdocs at: $SYSTEM_HTDOCS"
  if mkdir -p "$SYSTEM_HTDOCS/hirematch" 2>/dev/null && cp -R "$LOCAL_XAMPP_PKG/"* "$SYSTEM_HTDOCS/hirematch/" 2>/dev/null; then
    DEPLOYED_TO_SYSTEM=true
    echo "[✔] Successfully copied directly to $SYSTEM_HTDOCS/hirematch!"
  else
    echo "[!] $SYSTEM_HTDOCS is protected by administrator permissions."
    echo "    To copy automatically into XAMPP, run:"
    echo "      sudo cp -R \"$LOCAL_XAMPP_PKG\" \"$SYSTEM_HTDOCS/\""
  fi
fi

# 5. Check backend status
echo ""
echo "[+] Step 4: Verifying Node.js backend status..."
if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
  echo "    [✔] Backend is actively running on http://localhost:5001/api"
else
  echo "    [!] Backend is not running right now."
  echo "        Start it with: npm run dev:backend"
fi

echo ""
echo "======================================================================"
echo "  [SUCCESS] XAMPP Apache Package Ready!"
echo "======================================================================"
echo "  Local Package Folder: $LOCAL_XAMPP_PKG"
if [ "$DEPLOYED_TO_SYSTEM" = true ]; then
  echo "  XAMPP Live URL:       http://localhost/hirematch/"
else
  echo "  Next Step (One-Time Copy):"
  echo "    sudo cp -R \"$LOCAL_XAMPP_PKG\" \"$SYSTEM_HTDOCS/\""
  echo "    Then open in browser: http://localhost/hirematch/"
fi
echo "======================================================================"
