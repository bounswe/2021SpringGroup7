# Generated by Django 3.2.9 on 2021-12-24 20:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0011_comment_parent_comment_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='PinnedComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.comment')),
                ('story_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.story')),
            ],
        ),
    ]