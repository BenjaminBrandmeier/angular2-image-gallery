export MAGICK_THREAD_LIMIT=1
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install --yes nodejs
echo "yes" | sudo apt-get install imagemagick imagemagick-doc
npm install imagemagick
npm install mkdirp
