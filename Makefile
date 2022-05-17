scrape:
	docker-compose -f scraper/docker/docker-compose.yaml up

scrape-down:
	docker-compose -f scraper/docker/docker-compose.yaml down --volumes --rmi all