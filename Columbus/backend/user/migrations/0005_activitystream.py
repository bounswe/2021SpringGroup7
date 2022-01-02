# Generated by Django 3.2.9 on 2021-12-18 12:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('user', '0004_comment_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='ActivityStream',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=30)),
                ('date', models.DateTimeField()),
                ('actor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actor', to=settings.AUTH_USER_MODEL)),
                ('comment', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='user.comment')),
                ('story', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='user.story')),
                ('target', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='target', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'activity_stream',
            },
        ),
    ]