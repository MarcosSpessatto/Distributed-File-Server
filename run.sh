#!/bin/bash
cd client
npm install
bower install
cd ..
cd server
npm install
cd ..
cd manager
npm install
ECHO "Dependencies were installed sucessfully"