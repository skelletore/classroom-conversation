from rest_framework import serializers

from .models import Conversation, Illustration


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = [
            "name",
            "description",
            "json",
            "document",
            "created",
            "updated",
            "uuid",
        ]


class IllustrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Illustration
        fields = [
            "name",
            "description",
            "image",
            "created",
            "updated",
            "uuid"
        ]
