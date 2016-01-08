#!/bin/bash

dbuser="rpgbot"
dbname="rpgbot"
dbhost="localhost"
#dbpass is generated with /dev/urandom and 20 safe char long. This is a correct security level.
dbpass=`< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c${1:-20};echo;`

#########################################################################################
###########DO NOT CHANGE ANYTHING AFTER THIS UNLESS YOU KNOW WHAT ARE YOU DOING##########
#########################################################################################
echo ""
echo ""
echo "###################################################################"
echo "# This script will create or replace $dbuser user in the database #"
echo "#     It will modify .env file with correct password              #"
echo "###################################################################"
echo ""
echo ""

read -p " Continue? [Y/n]" -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Cancelling"
    exit 1
fi

MYSQL=`which mysql`
Q0="DROP USER '$dbuser'@'$dbhost';"
Q1="CREATE USER '$dbuser'@'$dbhost' IDENTIFIED BY '$dbpass';"
Q2="CREATE DATABASE IF NOT EXISTS $dbname;"
Q3="flush privileges;"
Q4="GRANT ALL PRIVILEGES ON $dbname.* TO $dbuser@$dbhost;"
SQL="${Q0}${Q1}${Q2}${Q3}${Q4}"

#echo $SQL
echo "Adding MySQL user : $dbuser, please provide your **MYSQL ROOT PASSWORD**"
$MYSQL -uroot -p -e "$SQL"
$MYSQL -u$dbuser -p$dbpass -h $dbhost $dbname < database.sql
sed -i -e "/DB_HOST=/ s/=.*/=$dbhost/" .env
sed -i -e "/DB_USER=/ s/=.*/=$dbuser/" .env
sed -i -e "/DB_PASS=/ s/=.*/=$dbpass/" .env


echo "Installation complete !"
echo "'node app.js' for starting the bot"
