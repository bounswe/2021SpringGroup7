# Generated by Django 3.2.9 on 2021-12-25 18:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('user', '0015_spamstory'),
    ]

    operations = [
        migrations.CreateModel(
            name='SpamComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('text', models.CharField(max_length=500)),
                ('parent_comment_id', models.IntegerField(null=True)),
                ('story_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.story')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
