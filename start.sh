#!/bin/bash
echo "Starting Chromora application..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la
echo "Files in dist directory:"
ls -la dist/
echo "Starting Express server..."
node server.js