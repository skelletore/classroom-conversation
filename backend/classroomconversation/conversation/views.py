import uuid

from rest_framework.permissions import AllowAny
from rest_framework import viewsets

from django.shortcuts import render, redirect
from django.core.files import File

from django.contrib.auth.decorators import login_required, permission_required

from .forms import ConversationForm, IllustrationForm
from .models import Conversation, Illustration
from .serializers import ConversationSerializer, IllustrationSerializer
from .parser import graphml_to_json


### API ###
class ConversationDetailAPIView(viewsets.ReadOnlyModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [AllowAny]
    lookup_field = "uuid"


class IllustrationDetailAPIView(viewsets.ReadOnlyModelViewSet):
    queryset = Illustration.objects.all()
    serializer_class = IllustrationSerializer
    permission_classes = [AllowAny]
    lookup_field = "uuid"


### VIEWS ###
@login_required(login_url="/account/login/")
@permission_required("user.is_staff", raise_exception=True)
def upload_document(request):
    if request.method == "POST":
        form = ConversationForm(request.POST, request.FILES)

        if form.is_valid():
            conversation = form.save(commit=False)
            conversation.uuid = str(uuid.uuid4())
            conversation.json, conversation.errors = graphml_to_json(
                File(conversation.document), conversation.uniform_probability
            )
            conversation.save()
            return redirect("document_list")
        else:
            # TODO: pass errors
            return render(request, "upload_document.html", {"form": form})

    form = ConversationForm()
    return render(request, "upload_document.html", {"form": form})


@login_required(login_url="/account/login/")
@permission_required("user.is_staff", raise_exception=True)
def document_list(request):
    conversations = Conversation.objects.all().order_by("-created")
    return render(request, "document_list.html", {"conversations": conversations})


@login_required(login_url="/account/login/")
@permission_required("user.is_staff", raise_exception=True)
def upload_illustration(request):
    if request.method == "POST":
        form = IllustrationForm(request.POST, request.FILES)

        try:
            illustration = form.save(commit=False)
            illustration.uuid = str(uuid.uuid4())
            illustration.image = File(illustration.image)
            illustration.save()
            return redirect("illustration_list")
        except Exception as error:
            print(error)
            # TODO: Identify proper error responses
            raise ValueError("An error occurded while uploading the file")
        
    form = IllustrationForm()
    return render(request, "upload_illustration.html", {"form": form})


@login_required(login_url="/account/login/")
@permission_required("user.is_staff", raise_exception=True)
def illustration_list(request):
    illustrations = Illustration.objects.all().order_by("-created")
    return render(request, "illustration_list.html", {"illustrations": illustrations})
