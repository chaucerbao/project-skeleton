VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.hostname = nil
  config.vm.box = "ubuntu/trusty64"
  config.vm.synced_folder ".", "/vagrant", :group => "www-data", :mount_options => ["dmode=775","fmode=664"]
  config.vm.network :forwarded_port, guest: 80, host: 8080, auto_correct: true
  config.vm.provision "shell", keep_color: true, path: ".provision/bootstrap.sh"
  config.vm.provider "virtualbox" do |v|
    v.memory = 1024
  end
end
