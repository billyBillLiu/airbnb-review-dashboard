# Generated by Django 5.0.7 on 2024-08-16 19:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_listing_summary'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='summary',
            field=models.JSONField(default=dict),
        ),
    ]
