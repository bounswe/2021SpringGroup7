# Generated by Django 3.2.9 on 2021-12-23 20:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0009_reportcomment_reporttag'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='public',
            field=models.BooleanField(default=True),
        ),
    ]
