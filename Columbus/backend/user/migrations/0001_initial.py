# Generated by Django 3.2.9 on 2021-12-29 17:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('admin_username', models.CharField(max_length=500)),
                ('admin_password', models.CharField(max_length=500)),
                ('login_hash', models.CharField(max_length=500, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('text', models.CharField(max_length=500)),
                ('parent_comment_id', models.IntegerField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Story',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('text', models.CharField(default='', max_length=3000)),
                ('createDateTime', models.DateTimeField(auto_now_add=True)),
                ('lastUpdate', models.DateTimeField(auto_now=True)),
                ('numberOfLikes', models.IntegerField(default=0)),
                ('numberOfComments', models.IntegerField(default=0)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag', models.CharField(max_length=100)),
                ('story_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.story')),
            ],
        ),
        migrations.CreateModel(
            name='SpamTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag', models.CharField(max_length=100)),
                ('story_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.story')),
            ],
        ),
        migrations.CreateModel(
            name='SpamStory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('text', models.CharField(default='', max_length=3000)),
                ('createDateTime', models.DateTimeField(auto_now_add=True)),
                ('lastUpdate', models.DateTimeField(auto_now=True)),
                ('numberOfLikes', models.IntegerField(default=0)),
                ('numberOfComments', models.IntegerField(default=0)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
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
        migrations.CreateModel(
            name='ReportUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('report', models.CharField(max_length=500)),
                ('reported_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reported_id', to=settings.AUTH_USER_MODEL)),
                ('reporter_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reporter_id', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ReportTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('report', models.CharField(max_length=500)),
                ('reporter_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('tag_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.tag')),
            ],
        ),
        migrations.CreateModel(
            name='ReportComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('report', models.CharField(max_length=500)),
                ('comment_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.comment')),
                ('reporter_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('report', models.CharField(max_length=500)),
                ('reporter_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('story_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.story')),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo_url', models.CharField(max_length=500, null=True)),
                ('biography', models.CharField(max_length=500, null=True)),
                ('birthday', models.DateField(null=True)),
                ('public', models.BooleanField(default=True)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PinnedComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.comment')),
                ('story_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.story')),
            ],
        ),
        migrations.CreateModel(
            name='Pin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.comment')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Multimedia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.CharField(max_length=100)),
                ('story_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.story')),
            ],
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', models.CharField(max_length=100)),
                ('latitude', models.FloatField(default=0)),
                ('longitude', models.FloatField(default=0)),
                ('type', models.CharField(default='', max_length=100)),
                ('story_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.story')),
            ],
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('story_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.story')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='FollowRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('follow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='request_reciever', to=settings.AUTH_USER_MODEL)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='request_owner', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Following',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('follow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follow', to=settings.AUTH_USER_MODEL)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_id', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Date',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.IntegerField(null=True)),
                ('year', models.IntegerField(null=True)),
                ('month', models.IntegerField(null=True)),
                ('day', models.IntegerField(null=True)),
                ('hour', models.IntegerField(null=True)),
                ('minute', models.IntegerField(null=True)),
                ('type', models.CharField(default='', max_length=100)),
                ('start_end_type', models.CharField(default='', max_length=100)),
                ('story_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.story')),
            ],
        ),
        migrations.AddField(
            model_name='comment',
            name='story_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.story'),
        ),
        migrations.AddField(
            model_name='comment',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Blocking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('block', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='block', to=settings.AUTH_USER_MODEL)),
                ('user_id_block', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_id_block', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ActivityStream',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=30)),
                ('date', models.DateTimeField()),
                ('actor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actor', to=settings.AUTH_USER_MODEL)),
                ('comment', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='user.comment')),
                ('story', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='user.story')),
                ('tag', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='user.tag')),
                ('target', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='target', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'activity_stream',
            },
        ),
    ]
