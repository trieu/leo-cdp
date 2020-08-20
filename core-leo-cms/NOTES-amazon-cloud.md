# Infrastructure Cloud



## Notes

### DNS Domains: 
* https://domains.google.com/registrar/leocdp.net/dns

contenthub.leocdp.net  3.6.208.57
demo.leocdp.net  13.235.137.146
demodb.leocdp.net  13.235.137.146
demotrack.leocdp.net	  15.207.39.90

### ArangoDB: 

* https://www.arangodb.com/download-major/ubuntu/
* curl -OL https://download.arangodb.com/arangodb37/DEBIAN/Release.key
* sudo apt-key add - < Release.key
* echo 'deb https://download.arangodb.com/arangodb37/DEBIAN/ /' | sudo tee /etc/apt/sources.list.d/arangodb.list
* sudo apt-get install apt-transport-https
* sudo apt-get update
* sudo apt-get install arangodb3=3.7.1-1

### Nginx Proxy:

* sudo wget https://nginx.org/keys/nginx_signing.key
* sudo apt-key add nginx_signing.key
* sudo nano /etc/apt/sources.list

	deb https://nginx.org/packages/mainline/ubuntu/ bionic nginx
	deb-src https://nginx.org/packages/mainline/ubuntu/ bionic nginx

* sudo apt-get remove nginx-common
* sudo apt-get update && sudo apt-get install nginx
* sudo service nginx start

### SSL for Nginx Server

https://linuxconfig.org/how-to-setup-the-nginx-web-server-on-ubuntu-18-04-bionic-beaver-linux

* sudo add-apt-repository ppa:certbot/certbot
* sudo apt-get update
* sudo apt-get install python-certbot-nginx
* sudo certbot --nginx certonly

### Java JVM

https://docs.aws.amazon.com/corretto/latest/corretto-8-ug/generic-linux-install.html

	wget -O- https://apt.corretto.aws/corretto.key | sudo apt-key add - 
	sudo add-apt-repository 'deb https://apt.corretto.aws stable main'
	sudo apt-get update; sudo apt-get install -y java-1.8.0-amazon-corretto-jdk
	
### Redis

https://computingforgeeks.com/how-to-install-redis-on-ubuntu-18-04-debian-9/

	sudo add-apt-repository ppa:chris-lea/redis-server
	sudo apt-get update
	sudo apt -y install redis-server

### Master Node for LeoCDP license management system

	ssh -i /Users/mac/.ssh/id_rsa_myaws ubuntu@54.157.239.156

### Database: 
	ssh -i /Users/mac/.ssh/mumbai.pem ubuntu@ec2-3-7-254-178.ap-south-1.compute.amazonaws.com

### Admin
	ssh -i /Users/mac/.ssh/mumbai.pem ubuntu@demo.leocdp.net

### Observer
	ssh -i /Users/mac/.ssh/mumbai.pem ubuntu@demotrack.leocdp.net

### Content Hub
	ssh -i /Users/mac/.ssh/mumbai.pem ubuntu@contenthub.leocdp.net


## Amazon ECS 
* https://dzone.com/articles/deploying-springboot-in-ecs
* https://dzone.com/articles/deploying-spring-boot-to-ecs-part-2
* https://github.com/aws-samples/amazon-ecs-java-microservices/tree/master/1_ECS_Java_Spring_PetClinic
* https://aws.amazon.com/blogs/compute/deploying-java-microservices-on-amazon-ec2-container-service/
* https://medium.com/arhs-spikeseed/how-to-deploy-and-scale-your-app-in-minutes-with-containers-and-aws-ecs-e49dae446928

## Continuous Deployment
* https://medium.com/ucladevx/deploy-a-react-node-app-using-travisci-and-aws-b41e3b09110b
* https://medium.com/@aagamvadecha/set-up-a-continuous-delivery-pipeline-from-bitbucket-to-aws-ec2-using-aws-code-deploy-a9777a3cbcad
