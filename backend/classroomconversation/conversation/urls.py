from django.urls import path, include
from rest_framework import routers

from . import views


router = routers.SimpleRouter(trailing_slash=False)
router.register(
    r"document", views.ConversationDetailAPIView,
)

urlpatterns = [
    path("api/", include(router.urls)),
    path("upload/list", views.document_list, name="document_list"),
    path("upload", views.upload_document, name="upload_document"),
    path("upload/illustration", views.upload_illustration, name="upload_illustration"),
    path("illustration/list", views.illustration_list, name="illustration_list"),
]
