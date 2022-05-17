scraper-up:
	docker-compose -f scraper/docker/docker-compose.yaml up

scraper-down:
	docker-compose -f scraper/docker/docker-compose.yaml down --volumes --rmi all

jupyterlab-up:
	docker-compose -f jupyterlab/docker/docker-compose.yaml up

jupyterlab-down:
	docker-compose -f jupyterlab/docker/docker-compose.yaml down --volumes --rmi all