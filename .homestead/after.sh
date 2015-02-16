#!/bin/sh

# Pygments style
curl -s -o /usr/local/lib/python2.7/dist-packages/pygments/styles/solarized256.py "https://raw.githubusercontent.com/gthank/solarized-dark-pygments/master/solarized256.py"

# Node packages
npm install -g csslint js-beautify jshint jsonlint

# Init script
cat <<EOF >> /home/vagrant/init
#!/bin/sh

git clone https://github.com/chaucerbao/dotfiles.git ~/.dotfiles

# Vim config
echo "source ~/.dotfiles/vim/.vimrc" >> ~/.vimrc

# tmux config
echo "source-file ~/.dotfiles/tmux/.tmux.conf" >> ~/.tmux.conf

# Laravel
composer global require "laravel/installer"
composer global update

# Self-destruct
rm /home/vagrant/init
EOF

chmod a+x /home/vagrant/init
chown vagrant:vagrant /home/vagrant/init
