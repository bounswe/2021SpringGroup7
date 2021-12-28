# Generated by Django 3.2.9 on 2021-12-26 18:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('user', '0018_activitystream_tag'),
    ]

    operations = [
        migrations.CreateModel(
            name='FollowRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('follow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='request_reciever', to=settings.AUTH_USER_MODEL)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='request_owner', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]