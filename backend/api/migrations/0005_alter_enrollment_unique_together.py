# Generated by Django 4.1.3 on 2022-11-17 13:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_alter_storage_unique_together"),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="enrollment",
            unique_together={("user", "lecture")},
        ),
    ]
