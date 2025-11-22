from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer para o model Message.
    Usado para serializar/deserializar mensagens na API.
    """
    class Meta:
        model = Message
        fields = ['id', 'user', 'user_message', 'bot_response', 'session_id', 'created_at']
        read_only_fields = ['id', 'bot_response', 'created_at']


class MessageCreateSerializer(serializers.Serializer):
    """
    Serializer para criação de mensagens.
    Recebe apenas o usuário e a mensagem do usuário.
    """
    user = serializers.ChoiceField(choices=['A', 'B'])
    user_message = serializers.CharField(max_length=1000)
    session_id = serializers.CharField(max_length=100, required=False, allow_blank=True)

