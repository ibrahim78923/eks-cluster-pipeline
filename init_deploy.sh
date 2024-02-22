#!/bin/sh

# Author : Asad Sohail

# 1: Zipping the folder
tar -zcvf  dist.tar --exclude-from="exclude.txt" .

# 2: Delete Existing Project Files
ssh ubuntu@37.187.72.153 -i ./ssh_key 'rm -rf /var/www/html/api.ezpick.legaci.ai/*'

# 3: Copying file to remote server
scp -i ./ssh_key ./dist.tar ubuntu@37.187.72.153:/var/www/html/api.ezpick.legaci.ai/ 

# 4: Copy deploy script to remote server
scp -i ./ssh_key ./deploy.sh ubuntu@37.187.72.153:/var/www/html/api.ezpick.legaci.ai/

# 5: Run deploy command
ssh ubuntu@37.187.72.153 -i ./ssh_key 