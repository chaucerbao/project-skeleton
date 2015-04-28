#!/bin/sh

# Node packages
npm install -g js-beautify

# Init script
cat <<EOF >> /home/vagrant/init
#!/bin/sh

git clone https://github.com/chaucerbao/dotfiles.git ~/.dotfiles

# Vim config
echo "source ~/.dotfiles/vim/.vimrc" >> ~/.vimrc

# tmux config
echo "source-file ~/.dotfiles/tmux/.tmux.conf" >> ~/.tmux.conf

# Laravel/Lumen
composer global require "laravel/installer"
composer global require "laravel/lumen-installer"

# Self-destruct
rm /home/vagrant/init
EOF

chmod a+x /home/vagrant/init
chown vagrant:vagrant /home/vagrant/init
