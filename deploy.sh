#!/bin/sh

# Author : Asad Sohail

# 1: Unzip the file on the server
tar -zxvf ./dist.tar

# 2: Install Dependencies
yarn

# 3: Stop and Delete the Server
pm2 stop ezpick_api && pm2 delete ezpick_api

# 4: Install dependencies
yarn install

# 5: Start pm2 server
pm2 start main.js -n ezpick_api

# 4: Remove Dist
rm -f ./dist.tar