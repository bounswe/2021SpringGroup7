FROM python:3.9.5

LABEL MAINTAINER="CMPE352 Group 7 Spring 2021"

ENV GROUP_ID=1001 \
    USER_ID=1001

WORKDIR /var/www/

USER root

ADD ./requirements.txt /var/www/requirements.txt
RUN pip3 install -r requirements.txt
ADD . /var/www/
ENV FLASK_APP=app
ENV FLASK_ENV=development

EXPOSE 5000

CMD ["python3", "-m", "flask", "run", "-h", "0.0.0.0"]
