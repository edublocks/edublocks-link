#!/bin/bash

cd ~

if [ $(whoami) == "root" ]; then
  echo "Please do not run me as root"
  exit 1
fi

if [ -d /opt/edublocks-link ]; then
  sudo rm -rf /opt/edublocks-link
fi

if [ -d edublocks-link ]; then
  rm -rf edublocks-link
fi

echo
echo "Downloading Package..."
wget https://github.com/edublocks/edublocks-link/releases/latest/download/edublocks-link-armv7l.tar.gz

echo
echo "Extracting Package..."
mkdir edublocks-link
tar -xf edublocks-link-armv7l.tar.gz --directory edublocks-link

echo
echo "Installing EduBlocks Python Libraries..."
sudo pip3 install python-sonic blinkt explorerhat "ipython==6.0.0" cs20-microbitio

echo
echo "Installing EduBlocks Link..."
sudo mv ~/edublocks-link /opt
sudo cp /opt/edublocks-link/app/edublocks-link.png /usr/share/icons/hicolor/scalable/apps/edublocks-link.png
sudo cp /opt/edublocks-link/app/edublocks-link.desktop /usr/share/applications
sudo chmod +x /opt/edublocks-link/scripts/start.sh

if [ -f edublocks-link-armv7l.tar.gz ]; then
  echo
  echo "Removing temp download..."
  rm -f edublocks-link-armv7l.tar.gz
fi