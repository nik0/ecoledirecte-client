#!/bin/bash
    
while true
do
    
    current_hour=$(date +"%H")
    # On ne verifie que le jour (entre 8 et 23h)
    if [ $current_hour -ge 8 ] && [ $current_hour -lt 23 ]; then
    	echo "$(date) ${0} boucle *****************************" >> /var/log/ed.log
	cd /home/pi/ed-notif
    	timeout 60 /usr/bin/node --experimental-fetch --trace-warnings index.js  2>&1 >> /var/log/ed.log
    	md5sum /home/pi/ed-notif/db/* 2>&1 >> /var/log/ed.log
    	ls -al /home/pi/ed-notif/db/* 2>&1 >> /var/log/ed.log
    	echo "Fin $?"   >> /var/log/ed.log
     fi
     sleep 1800

done
