sudo docker run --name gobarber_postgres \
 -e POSTGRES_PASSWORD=docker \
 -p 5432:5432 \
 -d postgres

sudo docker run --name redis -p 6379:6379 -d -t redis:alpine

sudo docker run --name mongodb -p 27017:27017 -d -t mongo
