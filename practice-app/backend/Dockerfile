FROM python:3.9.5

LABEL MAINTAINER="CMPE352 Group 7 Spring 2021"

ENV GROUP_ID=1001 \
    USER_ID=1001

WORKDIR /var/www/


#RUN groupadd --gid $GROUP_ID apper
#RUN useradd --uid $USER_ID --gid $GROUP_ID apper --shell /bin/sh
#RUN chown -R $USER_ID /home/www

USER root

ADD ./requirements.txt /var/www/requirements.txt
RUN pip3 install -r requirements.txt
ADD . /var/www/
ENV FLASK_APP=app
ENV FLASK_ENV=development

EXPOSE 5000

CMD ["python", "-m", "flask", "run"]
