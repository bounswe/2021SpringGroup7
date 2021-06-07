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
`docker volume prune`

This process deletes all the volumes in currently
unused containers. If you have some older images
that you do not want to lose its cached volumes,
use

`docker compose down`
`docker volume ls`
`docker volume rm practice-app_appdata`
`docker volume rm practice-app_mongodbdata`

We are most likely to do not care about them, so the
first option is more efficient. It is also faster and
saves more space.

#### Run Test
Launches the all tests <br />

`python -m unittest discover -s test -v`

Launches the test which is "test_XYZ.py" <br />

`python -m unittest discover test "test_XYZ.py"`
