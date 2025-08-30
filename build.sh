#!/bin/bash

echo "🚀 Building Fineo for Render..."

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Build frontend
echo "🏗️ Building frontend..."
npm run build

echo "✅ Build complete!"
