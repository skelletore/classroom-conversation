# Generated by Django 4.0.3 on 2022-09-25 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conversation', '0005_alter_completedconversation_conversation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='illustration',
            name='name',
            field=models.CharField(max_length=48, unique=True),
        ),
    ]
