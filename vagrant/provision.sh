#!/usr/bin/env bash
sudo apt-get update

#install node js
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install nodejs  -y

# docker
sudo apt install docker.io -y
sudo apt install docker-compose -y
sudo usermod -aG docker vagrant

sudo npm install yarn -g

# force startup folder to vagrant project
echo "cd /vagrant/src" >> /home/vagrant/.bashrc
