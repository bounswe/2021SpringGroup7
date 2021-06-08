# Practice App
Welcome to Practice App!

## Docker Commands to Run the Application
To start docker in the background 

`docker compose up -d`

To start docker in the terminal and see the logs

`docker compose up`

This is useful for debugging, flask container shows
all the requests and errors.

To close docker 

`docker compose down`

If you have changed any files but the application
continues working according to your old files,

`docker compose down`
`docker compose build --no-cache`
`docker compose up -d --force-recreate`

#### Run Test
Launches the all tests <br />

`python -m unittest discover -s test -v`

Launches the test which is "test_XYZ.py" <br />

`python -m unittest discover test "test_XYZ.py"`
