from django.utils.translation import gettext_lazy as _
from typing import List, Tuple

from .const import END_NODE, CHOICE_NODE, RESPONSE_NODE, ILLUSTRATION_DEFAULT_NODE, ILLUSTRATION_CHOICE_NODE, VALID_SHAPES
from .helpers import (
    get_tree_root_graph,
    get_all_nodes,
    is_start_node,
    is_end_node,
    is_choice_node,
    is_response_node,
    get_node_shape,
    get_node_by_id,
    get_edge_label,
    get_node_label,
)


def get_children(node, edges):
    return [edge for edge in edges if edge.get("source") == node.get("id")]


def get_target_shapes(children, graph, root, exclude_illustrations=False, exclude_finish=False):
    targets = set([(get_node_shape(get_node_by_id(child.get("target"), graph), root)) for child in children])
    if exclude_illustrations:
        if ILLUSTRATION_DEFAULT_NODE in targets:
            targets.remove(ILLUSTRATION_DEFAULT_NODE)
        if ILLUSTRATION_CHOICE_NODE in targets:
            targets.remove(ILLUSTRATION_CHOICE_NODE)
    if exclude_finish and END_NODE in targets:
        targets.remove(END_NODE)
    return list(targets)


def all_nodes_connected(file) -> Tuple[bool, List[str]]:
    errors = []
    (tree, root, graph, graphml) = get_tree_root_graph(file)
    nodes = get_all_nodes(graph)

    for node in nodes:
        id = node.get("id")
        source = graph.findall(graphml.get("edge") + "[@source='" + str(id) + "']")
        target = graph.findall(graphml.get("edge") + "[@target='" + str(id) + "']")
        if len(source) == 0 and len(target) == 0:
            label = get_node_label(node, root)
            shape = get_node_shape(node, root)
            errors.append(f"- Node {id}: '{label}' ({shape})")
    if len(errors) > 0:
        return False, errors
    return True, errors


def broken_conversation(file) -> Tuple[bool, List[str]]:
    errors = []
    (tree, root, graph, graphml) = get_tree_root_graph(file)
    nodes = [
        node
        for node in get_all_nodes(graph)
        if get_node_shape(node, root) in [CHOICE_NODE, RESPONSE_NODE]
    ]

    for node in nodes:
        id = node.get("id")

        sources = [
            edge.get("target")
            for edge in graph.findall(
                graphml.get("edge") + "[@source='" + str(id) + "']"
            )
        ]

        if len(sources) == 0:
            label = get_node_label(node, root)
            shape = get_node_shape(node, root)
            errors.append(f"- Node {id}: '{label}' ({shape})")

    if len(errors) > 0:
        return True, errors

    return False, errors


def has_one_start_node(file) -> Tuple[bool, List[str]]:
    """
    Check that the graph contains exactly one 'start' node (star)
    """
    errors = []
    (tree, root, graph, graphml) = get_tree_root_graph(file)
    nodes = get_all_nodes(graph)

    start_nodes = [node for node in nodes if is_start_node(node, root)]
    if len(start_nodes) < 1:
        errors.append(_("validation.doc.no.star"))
    elif len(start_nodes) > 1:
        errors.append(_("validation.doc.multi.star"))
        for star_node in start_nodes:
            id = star_node.get("id")
            label = get_node_label(star_node, root)
            shape = get_node_shape(star_node, root)
            errors.append(f"- Node {id}: '{label}' ({shape})")

    if len(errors) > 0:
        return False, errors

    return True, errors


def has_end_node(file) -> bool:
    """
    Check that the graph contains at least one 'end' node (octagon)
    """
    (tree, root, graph, graphml) = get_tree_root_graph(file)
    nodes = get_all_nodes(graph)

    return len([node for node in nodes if is_end_node(node, root)]) > 0


def has_illegal_node_shapes(file) -> Tuple[bool, List[str]]:
    """
    Check that the graph contains only valid shapes
    """
    errors = []
    (tree, root, graph, graphml) = get_tree_root_graph(file)
    nodes = get_all_nodes(graph)

    for node in nodes:
        id = node.get('id')
        shape = get_node_shape(node, root)
        if shape not in VALID_SHAPES:
            label = get_node_label(node, root)
            shape = get_node_shape(node, root)
            errors.append(f"- Node {id}: '{label}' ({shape})")

    if len(errors) > 0:
        return False, errors

    return True, errors


def all_nodes_contains_labels(file) -> Tuple[bool, List[str]]:
    """
    Check that all nodes contain a label
    """
    errors = []
    (tree, root, graph, graphml) = get_tree_root_graph(file)
    
    nodes = get_all_nodes(graph)

    for node in nodes:
        if not get_node_label(node, root):
            id = node.get("id")
            shape = get_node_shape(node, root)
            errors.append(f"- Node {id} ({shape})")

    if len(errors) > 0:
        return False, errors

    return True, errors


def missing_edge_probability(file):
    """
    Check that all edges contain a probability label
    """
    (tree, root, graph, graphml) = get_tree_root_graph(file)

    edges = graph.findall(graphml.get("edge"))
    nodes = [node for node in get_all_nodes(graph) if is_response_node(node, root)]

    for node in nodes:
        lines = [edge for edge in edges if edge.get("target") == node.get("id")]

        for e in lines:
            label = get_edge_label(e, root)
            try:
                float(label)
            except ValueError:
                return True
    return False


def wrong_probability_distribution(file):
    """
    Check that all probabilities sum up to 1.00
    """
    (tree, root, graph, graphml) = get_tree_root_graph(file)
    edges = graph.findall(graphml.get("edge"))

    nodes = [
        node for node in get_all_nodes(graph) if is_choice_node(node, root)
    ]

    for node in nodes:
        lines = [
            edge
            for edge in edges
            if edge.get("source") == node.get("id")
            and is_response_node(get_node_by_id(edge.get("target"), graph), root)
        ]

        sum = 0

        if len(lines) > 0:
            for edge in lines:
                label = get_edge_label(edge, root)
                try:
                    sum = sum + float(label)
                except ValueError:
                   pass
            if sum != 1:
                return True

    return False
