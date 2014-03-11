$script = <<SCRIPT
# Install Ubuntu packages
DEBIAN_FRONTEND=noninteractive apt-get install --assume-yes git

# Remove orphaned dependencies
DEBIAN_FRONTEND=noninteractive apt-get autoremove --assume-yes
SCRIPT

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.hostname = nil
  config.vm.box = "chef/ubuntu-13.10"
  config.vm.network :forwarded_port, guest: 80, host: 8080, auto_correct: true
  config.vm.provision "shell", keep_color: true, inline: $script
end
