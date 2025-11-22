# Generated manually
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='session_id',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='ID da Sessão'),
        ),
    ]

