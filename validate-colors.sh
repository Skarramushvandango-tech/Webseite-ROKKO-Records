#!/bin/bash
# Color Policy Validation Script
# This script checks if the immutable interior color (#E0C290) has been maintained

echo "=================================================="
echo "ROKKO Records Color Policy Validation"
echo "=================================================="
echo ""

# Define the expected color value
EXPECTED_COLOR="#E0C290"
EXPECTED_VAR="--rokko-sand"
CSS_FILE="styles/override-rokko.css"

echo "Checking for immutable color: $EXPECTED_COLOR"
echo "Expected variable: $EXPECTED_VAR"
echo ""

# Check if the CSS file exists
if [ ! -f "$CSS_FILE" ]; then
    echo "❌ ERROR: CSS file not found: $CSS_FILE"
    exit 1
fi

# Check if the color variable is defined correctly
# Use grep with -e to treat pattern as a pattern, not an option
if grep -E -e "${EXPECTED_VAR}[[:space:]]*:[[:space:]]*${EXPECTED_COLOR}" "$CSS_FILE" > /dev/null 2>&1; then
    echo "✅ SUCCESS: Immutable color is correctly defined"
    echo "   Found: ${EXPECTED_VAR}: ${EXPECTED_COLOR}"
else
    echo "❌ FAILURE: Immutable color has been modified or is missing!"
    echo ""
    echo "Expected to find: ${EXPECTED_VAR}: ${EXPECTED_COLOR}"
    echo ""
    echo "Current definitions:"
    grep -e "${EXPECTED_VAR}" "$CSS_FILE" || echo "Variable not found!"
    echo ""
    echo "⚠️  This violates the ROKKO Records Color Policy!"
    echo "   See COLORS.md for the change management policy."
    exit 1
fi

# Check if the color appears in expected locations
echo ""
echo "Checking usage of var(--rokko-sand)..."
USAGE_COUNT=$(grep -c "var(--rokko-sand)" "$CSS_FILE" || echo "0")
echo "   Found $USAGE_COUNT usages of var(--rokko-sand)"

if [ "$USAGE_COUNT" -lt 5 ]; then
    echo "⚠️  WARNING: Expected more usages of the variable"
    echo "   This might indicate the color is being hardcoded instead"
fi

# Check for unauthorized hardcoded instances
echo ""
echo "Checking for unauthorized hardcoded instances..."
HARDCODED_COUNT=$(grep -c "#E0C290" "$CSS_FILE" || echo "0")
echo "   Found $HARDCODED_COUNT hardcoded instances of #E0C290"

if [ "$HARDCODED_COUNT" -gt 1 ]; then
    echo "⚠️  WARNING: Color should be used via var(--rokko-sand) not hardcoded"
    echo "   Hardcoded instances should be replaced with the CSS variable"
fi

echo ""
echo "=================================================="
echo "Validation Complete"
echo "=================================================="
echo ""
echo "Summary:"
echo "  ✅ Immutable color definition: PASS"
echo "  📊 Variable usages: $USAGE_COUNT"
echo "  📝 Hardcoded instances: $HARDCODED_COUNT"
echo ""
echo "For more information, see:"
echo "  - COLORS.md (Full color documentation)"
echo "  - .github/COLOR_POLICY.md (Policy details)"
echo ""
