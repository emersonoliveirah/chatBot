from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Message
from .serializers import MessageSerializer, MessageCreateSerializer


def get_bot_response(user):
    """
    Retorna uma resposta mockada diferente para cada usuário.
    """
    responses = {
        'A': 'Obrigado por seu contato, Usuário A. Em breve responderemos.',
        'B': 'Obrigado por seu contato, Usuário B. Nossa equipe entrará em contato em breve.',
    }
    return responses.get(user, 'Obrigado por seu contato. Em breve responderemos.')


@api_view(['POST'])
def send_message(request):
    """
    Endpoint para enviar uma mensagem.
    Recebe o usuário e a mensagem, salva no banco e retorna a resposta mockada.
    """
    serializer = MessageCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        user_message = serializer.validated_data['user_message']
        
        # Gera resposta mockada
        bot_response = get_bot_response(user)
        
        # Salva no banco de dados
        message = Message.objects.create(
            user=user,
            user_message=user_message,
            bot_response=bot_response
        )
        
        # Retorna a mensagem completa
        response_serializer = MessageSerializer(message)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_history(request):
    """
    Endpoint para buscar o histórico de mensagens de um usuário específico.
    Recebe o parâmetro 'user' na query string (A ou B).
    """
    user = request.query_params.get('user', None)
    
    if not user or user not in ['A', 'B']:
        return Response(
            {'error': 'Parâmetro "user" é obrigatório e deve ser "A" ou "B".'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Busca todas as mensagens do usuário, ordenadas por data (mais recentes primeiro)
    messages = Message.objects.filter(user=user).order_by('-created_at')
    serializer = MessageSerializer(messages, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

