NODE_VERSION="v16.17.0"
TMP_PATH=/tmp
ARCH="armv7l"

yarn install
yarn build
cp -R node_modules build
cp -R build-assets/app build/app
cp build-assets/start.sh build/scripts
curl https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-linux-$ARCH.tar.xz | tar -xJ -C $TMP_PATH
mv $TMP_PATH/node-$NODE_VERSION-linux-$ARCH/bin/node build
tar -zxvf build-assets/node-pty.zip -C build/node_modules/node-pty/
mkdir dist
cd build 
tar -zcvf ../dist/edublocks-link-$ARCH.tar.gz *