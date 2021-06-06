# Practice App
Welcome to Practice App!

## Docker Commands
For start docker 

`docker-compose up -d`

For close docker 

`docker-compose down`

## Available Scripts

In the project directory, you can run:

#### Run Flask
For Ubuntu and OS 

`export FLASK_APP=app`<br />
`export FLASK_ENV=development`<br />
`python -m flask run`

For Windows:

`set FLASK_APP=app`<br />
`set FLASK_ENV=development`<br />
`python -m flask run`

#### Run Test
Launches the all tests <br />

`python -m unittest discover -s test -v`

Launches the test which is "test_XYZ.py" <br />

`python -m unittest discover test "test_XYZ.py"`

