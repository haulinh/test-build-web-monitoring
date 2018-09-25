rm -rf database
mongodump --host 192.168.100.88 --port 27017 --db ilotusland_cem --username 'dev' --password "happy2code" --out database
mongorestore --host 27.74.251.0 --port 27018 --db ilotusland_cem --username 'dev' --password "happy2code" database/ilotusland_cem