from django import forms
from django.utils.translation import gettext_lazy as _
from django.core.files import File

from .models import Conversation, Illustration

from .validation import (
    has_one_star_node,
    has_illegal_node_shapes,
    has_octant_node,
    all_nodes_connected,
    diamonds_connected_to_squares,
    broken_conversation,
    missing_edge_probability,
    wrong_probability_distribution,
    one_type_of_child_nodes,
    all_nodes_contains_labels,
    questions_have_questions,
    questions_have_answers,
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

        is_valid, errors = has_one_star_node(file)
        if not is_valid:
            error_type = _("validation.doc.one.star")
            raise forms.ValidationError([error_type] + errors)

        if not has_octant_node(file):
            raise forms.ValidationError(_("validation.doc.end.node"))

        is_valid, errors = has_illegal_node_shapes(file)
        if not is_valid:
            error_type = _("validation.doc.illegal.shapes")
            raise forms.ValidationError([error_type] + errors)

        is_valid, errors = diamonds_connected_to_squares(file)
        if not is_valid:
            error_type = _("validation.doc.diamonds.connections")
            raise forms.ValidationError([error_type] + errors)

        is_valid, errors = one_type_of_child_nodes(file)
        if not is_valid:
            error_type = _("validation.doc.child.nodes.type")
            raise forms.ValidationError([error_type] + errors)

        is_invalid, errors = questions_have_questions(file)
        if is_invalid:
            error_type = _("validation.doc.question.has.question")
            raise forms.ValidationError([error_type] + errors)

        is_valid, errors = questions_have_answers(file)
        if not is_valid:
            error_type = _("validation.doc.question.needs.answer")
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

        return document
