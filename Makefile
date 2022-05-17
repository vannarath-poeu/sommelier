scraper-up:
	docker-compose -f scraper/docker/docker-compose.yaml up

scraper-down:
	docker-compose -f scraper/docker/docker-compose.yaml down --volumes --rmi all

jupyterlab-up:
	docker-compose -f jupyterlab/docker/docker-compose.yaml up

jupyterlab-down:
	docker-compose -f jupyterlab/docker/docker-compose.yaml down --volumes --rmi all

api-up:
	docker-compose -f api/docker/docker-compose.yaml up

api-down:
	docker-compose -f api/docker/docker-compose.yaml down --volumes --rmi all

app-up:
	docker-compose -f app/docker/docker-compose.yaml up

app-down:
	docker-compose -f app/docker/docker-compose.yaml down --volumes --rmi all