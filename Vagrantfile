$script = <<SCRIPT
SCRIPT

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = ""
  config.vm.box_url = ""
  config.vm.network :forwarded_port, guest: 80, host: 8080, auto_correct: true
  config.vm.provision "shell", inline: $script
end
