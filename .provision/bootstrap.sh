#!/bin/sh

# Variables
WEBROOT=/vagrant/

DBNAME=site
DBUSER=admin
DBPASS=password

PACKAGES="nginx php5-fpm php5-cli php5-mcrypt"
PACKAGES="$PACKAGES php5-apcu"
PACKAGES="$PACKAGES php5-sqlite"
PACKAGES="$PACKAGES php5-mysql mysql-server"
PACKAGES="$PACKAGES php5-pgsql postgresql"
PACKAGES="$PACKAGES redis-server"

# Install packages
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install --assume-yes $PACKAGES

# Attach the project directory to the server root
rm -rf /usr/share/nginx/html/
ln -s $WEBROOT /usr/share/nginx/html

# Nginx configuration
sed -i 's/sendfile on/sendfile off/' /etc/nginx/nginx.conf
cp /vagrant/.provision/nginx/sites-available/default /etc/nginx/sites-available/

# PHP configuration
sed -i 's/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/' /etc/php5/fpm/php.ini
php5enmod mcrypt

# Restart services
service nginx restart
service php5-fpm restart

# Install Composer
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chown vagrant:vagrant /usr/local/bin/composer

# Create the database
mysql -u root -e "CREATE DATABASE $DBNAME; USE $DBNAME; GRANT ALL PRIVILEGES ON $DBNAME.* TO '$DBUSER'@'localhost' IDENTIFIED BY '$DBPASS'; FLUSH PRIVILEGES;"

sudo -u postgres psql -c "CREATE USER $DBUSER WITH PASSWORD '$DBPASS'"
sudo -u postgres psql -c "CREATE DATABASE $DBNAME OWNER $DBUSER"
