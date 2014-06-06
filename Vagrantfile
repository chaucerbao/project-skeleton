$script = <<SCRIPT
# Install Ubuntu packages
DEBIAN_FRONTEND=noninteractive apt-get install --assume-yes apache2 libapache2-mod-php5 php5-mcrypt php-apc php5-mysql mysql-server mysql-client php5-sqlite

# Remove orphaned dependencies
DEBIAN_FRONTEND=noninteractive apt-get autoremove --assume-yes

# Install Composer
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chown vagrant:vagrant /usr/local/bin/composer

# Attach the public directory to Apache's server root
rm -rf /var/www/html/
ln -fs /vagrant/ /var/www/html

# Enable modules for Apache2 and PHP
a2enmod rewrite
php5enmod mcrypt
sed -i '$iServerName localhost' /etc/apache2/apache2.conf
service apache2 restart

# Create the database
mysql -u root -e "CREATE DATABASE name;"
SCRIPT

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.hostname = nil
  config.vm.box = "ubuntu/trusty64"
  config.vm.synced_folder ".", "/vagrant", :group => "www-data", :mount_options => ["dmode=775","fmode=775"]
  config.vm.network :forwarded_port, guest: 80, host: 8080, auto_correct: true
  config.vm.provision :shell, keep_color: true, inline: $script
  config.vm.provider "virtualbox" do |v|
    v.memory = 1024
  end
end
