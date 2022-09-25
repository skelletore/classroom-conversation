from django import forms
from django.utils.translation import gettext_lazy as _
from django.core.files import File
from urllib.parse import quote
import re

from .models import Conversation, Illustration

from .validation import (
    has_invalid_image_sources,
    has_one_start_node,
    has_end_node,
    has_illegal_node_shapes,
    all_nodes_connected,
    broken_conversation,
    missing_edge_probability,
    wrong_probability_distribution,
    all_nodes_contains_labels,
)


class IllustrationForm(forms.ModelForm):
    class Meta:
        model = Illustration
        fields = (
            "name",
            "description",
            "image",
        )
        labels = {
            "name": _("form.label.name"),
            "description": _("form.label.description"),
            "image": _("form.label.image"),
        }

    def clean_name(self):
        name = self.cleaned_data.get("name")
        pattern = re.compile('[^a-zA-Z0-9_-]')
        name = pattern.sub('', name)
        name = quote(name)
        name = name.strip()

        return name


class ConversationForm(forms.ModelForm):
    class Meta:
        model = Conversation
        fields = (
            "name",
            "description",
            "document",
            "uniform_probability",
        )
        labels = {
            "name": _("form.label.name"),
            "description": _("form.label.description"),
            "document": _("form.label.document"),
            "uniform_probability": _("form.label.uniform_probability"),
        }

    def clean_document(self):
        document = self.cleaned_data.get("document")
        uniform = self.data.get("uniform_probability")
        file = File(document)

        is_valid, errors = all_nodes_connected(file)
        if not is_valid:
            error_type = _("validation.doc.all.nodes.connected")
            raise forms.ValidationError([error_type] + errors)

        is_invalid, errors = broken_conversation(file)
        if is_invalid:
            error_type = _("validation.doc.broken.conversation")
            raise forms.ValidationError([error_type] + errors)

        is_valid, errors = has_one_start_node(file)
        if not is_valid:
            error_type = _("validation.doc.one.star")
            raise forms.ValidationError([error_type] + errors)

        if not has_end_node(file):
            raise forms.ValidationError(_("validation.doc.end.node"))

        is_valid, errors = has_illegal_node_shapes(file)
        if not is_valid:
            error_type = _("validation.doc.illegal.shapes")
            raise forms.ValidationError([error_type] + errors)

        is_valid, errors = all_nodes_contains_labels(file)
        if not is_valid:
            error_type = _("validation.doc.missing.node.label")
            raise forms.ValidationError([error_type] + errors)

        if not uniform:
            if missing_edge_probability(file):
                raise forms.ValidationError(_("validation.doc.missing.probability"))

            if wrong_probability_distribution(file):
                raise forms.ValidationError(_("validation.doc.probability.sum"))

        is_invalid, errors = has_invalid_image_sources(file)
        if is_invalid:
            error_type = _("validation.doc.illustration.invalid_src")
            raise forms.ValidationError([error_type] + errors)

        return document
