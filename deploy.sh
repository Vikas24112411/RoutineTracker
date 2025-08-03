#!/bin/bash

echo "🚀 Deploying Routine Tracker to Netlify..."

# Build the project
echo "📦 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 To deploy to Netlify:"
    echo "1. Go to https://app.netlify.com/"
    echo "2. Click 'Add new site' → 'Deploy manually'"
    echo "3. Drag and drop the 'dist' folder"
    echo "4. Or use Netlify CLI: netlify deploy --prod --dir=dist"
    echo ""
    echo "📁 Build output is in the 'dist' folder"
else
    echo "❌ Build failed!"
    exit 1
fi 