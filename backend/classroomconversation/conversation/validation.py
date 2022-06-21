from django.utils.translation import gettext_lazy as _
from typing import List, Tuple

from .const import DIAMOND, HEXAGON, OCTAGON, RECTANGLE, VALID_SHAPES
from .helpers import (
    get_tree_root_graph,
    get_all_nodes,
    get_all_edges,
    is_diamond,
    is_hexagon,
    get_node_shape,
    get_node_by_id,
    get_edge_label,
    get_all_rectangles,
    is_octagon,
    is_rectangle,
    is_star,
    get_node_label
)


def has_one_star_node(file) -> Tuple[bool, List[str]]:
    errors = []
    (tree, root, graph, graphml) = get_tree_root_graph(file)
    nodes = get_all_nodes(graph)

    star_nodes = [node for node in nodes if is_star(node, root)]
    if len(star_nodes) < 1:
        errors.append(_("validation.doc.no.star"))
    elif len(star_nodes) > 1:
        errors.append(_("validation.doc.multi.star"))
        for star_node in star_nodes:
            id = star_node.get("id")
            label = get_node_label(star_node, root)
            shape = get_node_shape(star_node, root)
            errors.append(f"- Node {id}: '{label}' ({shape})")

    if len(errors) > 0:
        return False, errors

    return True, errors


def has_octant_node(file) -> bool:
    (tree, root, graph, graphml) = get_tree_root_graph(file)
    nodes = get_all_nodes(graph)

    return len([node for node in nodes if is_octagon(node, root)]) > 0


def diamonds_connected_to_squares(file) -> Tuple[bool, List[str]]:
    # TODO: Rework to support many-to-many
    errors = []
    (tree, root, graph, graphml) = get_tree_root_graph(file)
    nodes = [node for node in get_all_nodes(graph) if is_diamond(node, root)]

    for node in nodes:
        id = node.get("id")
        sources = [
            edge.get("target")
            for edge in graph.findall(
                graphml.get("edge") + "[@source='" + str(id) + "']"
            )
        ]

        for source in sources:
            source_node = get_node_by_id(source, graph)
            if not is_rectangle(source_node, root) and not is_hexagon(source_node, root):
                source_id = source_node.get("id")
                source_label = get_node_label(source_node, root)
                source_shape = get_node_shape(source_node, root)
                label = get_node_label(node, root)
                shape = get_node_shape(node, root)
                msg = _("validation.doc.node.connected.to")
                errors.append(f"- Node {id}: '{label}' ({shape}) {msg} node {source_id}: '{source_label}' ({source_shape})")
                
    if len(errors) > 0:
        return False, errors

    return True, errors


def broken_conversation(file) -> Tuple[bool, List[str]]:
    errors = []
    (tree, root, graph, graphml) = get_tree_root_graph(file)
    nodes = [
        node
        for node in get_all_nodes(graph)
        if get_node_shape(node, root) in [DIAMOND, RECTANGLE]
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


def has_illegal_node_shapes(file) -> Tuple[bool, List[str]]:
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


def wrong_probability_distribution(file):
    (tree, root, graph, graphml) = get_tree_root_graph(file)
    edges = graph.findall(graphml.get("edge"))

    nodes = [
        node for node in get_all_nodes(graph) if is_rectangle(node, root)
    ]

    for node in nodes:
        lines = [
            edge
            for edge in edges
            if edge.get("source") == node.get("id")
            and is_diamond(get_node_by_id(edge.get("target"), graph), root)
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


def missing_edge_probability(file):
    (tree, root, graph, graphml) = get_tree_root_graph(file)

    edges = graph.findall(graphml.get("edge"))
    nodes = [node for node in get_all_nodes(graph) if is_diamond(node, root)]

    for node in nodes:
        lines = [edge for edge in edges if edge.get("target") == node.get("id")]

        for e in lines:
            label = get_edge_label(e, root)
            try:
                float(label)
            except ValueError:
                return True
    return False


def one_type_of_child_nodes(file) -> Tuple[bool, List[str]]:
    # TODO: Rework to support many-to-many
    errors = []
    (tree, root, graph, graphml) = get_tree_root_graph(file)

    edges = graph.findall(graphml.get("edge"))
    nodes = get_all_nodes(graph)

    for node in nodes:
        id = node.get("id")
        lines = set([
            get_node_shape(get_node_by_id(edge.get("target"), graph), root)
            for edge in edges
            if edge.get("source") == node.get("id")
        ])

        # fix for illustrations
        if HEXAGON in lines:
            lines.remove(HEXAGON)

        if len(lines) > 1:
            label = get_node_label(node, root)
            shape = get_node_shape(node, root)
            errors.append(f"- Node {id}: '{label}' ({shape})")

    if len(errors) > 0:
        return False, errors

    return True, errors


def get_children(node, edges):
    return [edge for edge in edges if edge.get("source") == node.get("id")]


def get_target_shapes(children, graph, root, exclude_illustrations=False, exclude_finish=False):
    targets = set([(get_node_shape(get_node_by_id(child.get("target"), graph), root)) for child in children])
    if exclude_illustrations and HEXAGON in targets:
        targets.remove(HEXAGON)
    if exclude_finish and OCTAGON in targets:
        targets.remove(OCTAGON)
    return list(targets)


def questions_have_questions(file) -> Tuple[bool, List[str]]:
    # TODO: Rework to support many-to-many
    errors = []
    (tree, root, graph, graphml) = get_tree_root_graph(file)

    edges = get_all_edges(graph)
    nodes = get_all_rectangles(graph, root)

    for node in nodes:
        children = get_children(node, edges)

        targets = get_target_shapes(children, graph, root, exclude_illustrations=True)
        if not targets or RECTANGLE in targets:
            id = node.get("id")
            label = get_node_label(node, root)
            shape = get_node_shape(node, root)
            errors.append(f"- Node {id}: '{label}' ({shape})")

    if len(errors) > 0:
        return True, errors

    return False, errors
        

def questions_have_answers(file) -> Tuple[bool, List[str]]:
    # TODO: Rework to support many-to-many?
    errors = []
    """ Ensure that each question (roundrectangle) has at least one answer
    """
    (tree, root, graph, graphml) = get_tree_root_graph(file)

    edges = get_all_edges(graph)
    nodes = get_all_rectangles(graph, root)

    for node in nodes:
        children = get_children(node, edges)

        targets = get_target_shapes(children, graph, root, exclude_illustrations=True)
        if DIAMOND not in targets:
            if len(targets) == 1 and targets[0] == OCTAGON:
                # finish (end node)
                pass
            else:
                id = node.get("id")
                label = get_node_label(node, root)
                shape = get_node_shape(node, root)
                errors.append(f"- Node {id}: '{label}' ({shape})")

    if len(errors) > 0:
        return False, errors

    return True, errors


def only_single_chained_questions(file):
    (tree, root, graph, graphml) = get_tree_root_graph(file)

    edges = get_all_edges(graph)
    nodes = get_all_rectangles(graph, root)

    for node in nodes:
        children = [edge for edge in edges if edge.get("source") == node.get("id")]
        
        if len(children) > 1:
            targets = set([(get_node_shape(get_node_by_id(child.get("target"), graph), root)) for child in children])
            if len(targets) > 1 or not DIAMOND in targets:
                return False

    return True


def all_nodes_contains_labels(file) -> Tuple[bool, List[str]]:
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
