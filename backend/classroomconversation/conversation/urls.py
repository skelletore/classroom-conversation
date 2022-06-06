from django.urls import path, include
from rest_framework import routers

from . import views


router = routers.SimpleRouter(trailing_slash=False)
router.register(
    r"document", views.ConversationDetailAPIView,
)
router.register(
    r"completed", views.CompletedConversationDetailAPIView,
)
router.register(
    r"submit", views.CompletedConversationCreateAPIView
)

urlpatterns = [
    path("api/", include(router.urls)),
    path("upload/list", views.document_list, name="document_list"),
    path("upload", views.upload_document, name="upload_document"),
    path("upload/illustration", views.upload_illustration, name="upload_illustration"),
    path("illustration/list", views.illustration_list, name="illustration_list"),
    path("illustration/<image_name>", views.get_illustration_by_name, name="get_illustration_by_name"),
]
