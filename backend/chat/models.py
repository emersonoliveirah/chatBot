from django.db import models


class Message(models.Model):
    """
    Model para armazenar mensagens do chat.
    Cada mensagem está vinculada a um usuário (A ou B) e contém
    tanto a mensagem enviada pelo usuário quanto a resposta do sistema.
    """
    USER_CHOICES = [
        ('A', 'Usuário A'),
        ('B', 'Usuário B'),
    ]
    
    user = models.CharField(max_length=1, choices=USER_CHOICES, verbose_name='Usuário')
    user_message = models.TextField(verbose_name='Mensagem do Usuário')
    bot_response = models.TextField(verbose_name='Resposta do Bot')
    session_id = models.CharField(max_length=100, verbose_name='ID da Sessão', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Data de Criação')
    
    class Meta:
        verbose_name = 'Mensagem'
        verbose_name_plural = 'Mensagens'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.user} - {self.created_at.strftime("%d/%m/%Y %H:%M")}'

