#!/bin/bash
echo 'run after_install.sh: ' >> /home/ec2-user/w3g-project/web3-frontend/deploy.log
echo 'cd /home/ec2-user/w3g-project/web3-frontend/' >> /home/ec2-user/w3g-project/web3-frontend/deploy.log
cd /home/ec2-user/w3g-project/web3-frontend >> /home/ec2-user/w3g-project/web3-frontend/deploy.log
echo 'npm install' >> /home/ec2-user/w3g-project/web3-frontend/deploy.log
npm i --legacy-peer-deps >> /home/ec2-user/w3g-project/web3-frontend/deploy.log
echo 'pm2 stop w3g-server' >> /home/ec2-user/w3g-project/web3-frontend/deploy.log
sudo pm2 stop w3g-server >> /home/ec2-user/w3g-project/web3-frontend/deploy.log
echo 'npm build' >> /home/ec2-user/w3g-project/web3-frontend/deploy.log
npm run build >> /home/ec2-user/w3g-project/web3-frontend/deploy.log
echo 'pm2 start w3g-server' >> /home/ec2-user/w3g-project/web3-frontend/deploy.log
sudo pm2 start w3g-server >> /home/ec2-user/w3g-project/web3-frontend/deploy.log