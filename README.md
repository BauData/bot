How to

raspberry pi server

raspberry headless
https://www.thepolyglotdeveloper.com/2016/02/use-your-raspberry-pi-as-a-headless-system-without-a-monitor/
http://blog.smalleycreative.com/linux/setup-a-headless-raspberry-pi-with-raspbian-jessie-on-os-x/
https://www.raspberrypi.org/forums/viewtopic.php?t=74176

node
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
sudo npm i -g npm@latest

grunt
sudo npm install -g grunt-cli

dynamic dns
http://raspberrywebserver.com/serveradmin/get-your-raspberry-pi-web-site-on-line.html
https://diyhacking.com/raspberry-pi-web-server/

ffmpeg
https://owenashurst.com/?p=242
https://www.jeffreythompson.org/blog/2014/11/13/installing-ffmpeg-for-raspberry-pi/

imagemagick
https://www.imagemagick.org/script/install-source.php

Gifsicle
https://github.com/kohler/gifsicle

/usr/local/bin $ sudo chmod 0777 gifsicle 

Geckodriver

https://github.com/mozilla/geckodriver/releases

download geckodriver. Extract it and copy the driver to /usr/local/bin and finally make it executable (chmod +x geckodriver).

export PATH=$PATH:/usr/local/bin/geckodriver

crontab -e

tape I

0 */1 * * * cd ~/sites/baudata/bot/src/gradient ; python startingClientScript.py

tape esc
tape :x

!!!every hour
https://crontab.guru/every-4-hours

TMUX

https://askubuntu.com/questions/8653/how-to-keep-processes-running-after-ending-ssh-session

    ssh into the remote machine
    start tmux by typing tmux into the shell
    start the process you want inside the started tmux session
    leave/detach the tmux session by typing Ctrl+b and then d


