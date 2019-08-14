
# DB for image classification 
61.28.227.159
postgres:123bonnam
db:heyhadar

/usr/local/opt/libpq/bin/pg_dump -h 61.28.227.159 -p 5432 -U postgres -W -F t heyhadar > classified-image-data-postgres.tar