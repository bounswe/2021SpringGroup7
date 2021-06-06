# Practice App
Welcome to Practice App!

## Docker Commands to Run the Application
For start docker in the background 

`docker-compose up -d`

For start docker in the terminal and see the logs

`docker-compose up`

For close docker 

`docker-compose down`

#### Run Test
Launches the all tests <br />

`python -m unittest discover -s test -v`

Launches the test which is "test_XYZ.py" <br />

`python -m unittest discover test "test_XYZ.py"`
