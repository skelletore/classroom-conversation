from .const import DIAMOND, OCTAGON, RECTANGLE, STAR

from .helpers import (
    get_node_label,
    get_edge_label,
    get_node_shape,
    get_tree_root_graph,
    get_node_by_id,
    find_answers,
    find_alternatives,
    find_illustrations,
)


def graphml_to_json(file, uniform):
    errors = []
    (tree, root, graph, graphml) = get_tree_root_graph(file)
    nodes = graph.findall(graphml.get("node"))

    out = {
        "uniform": uniform,
        "start": "",
        "end": "",
        "questions": {},
        "answers": {},
        "illustrations": {},
        "nodes": {},
    }

    for node in nodes:
        id = node.get("id")
        shape = get_node_shape(node, root)

        if shape is None:
            continue

        label = get_node_label(node, root)
        edges = graph.findall(graphml.get("edge") + "[@source='" + id + "']")

        out["nodes"][id] = {"id": id, "shape": shape}

        illustrations, _errors = find_illustrations(edges, root, graph)
        if _errors:
            errors += _errors
        if illustrations:
            out["illustrations"][id] = illustrations

        if shape == RECTANGLE:
            answers = find_answers(edges, uniform, root, graph)
            out["questions"][id] = {
                "id": id,
                "shape": shape,
                "label": label,
                "answers": answers,
            }
        elif shape == DIAMOND:            
            out["answers"][id] = {
                "id": id,
                "shape": shape,
                "label": label,
                "alternatives": find_alternatives(edges, root, graph)
            }
        elif STAR in shape:
            out["start"] = {
                "id": id,
                "label": label,
                "type": shape,
                "firstQuestion": edges[0].get("target"),
            }
        elif shape == OCTAGON:
            out["end"] = id

    return out, errors
