# Generated by Django 3.2.9 on 2021-12-26 13:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0017_spamtag'),
    ]

    operations = [
        migrations.AddField(
            model_name='activitystream',
            name='tag',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='user.tag'),
        ),
    ]
