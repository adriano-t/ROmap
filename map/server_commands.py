

map_save_path = "map_export.txt"

def handler_save_map(params): 
    
    if not "data" in params:
        return "error"

    data = params["data"][0]
    
    with open(map_save_path, "w") as f:
        f.write(data)

    return "done"

def handler_test(params):
    return "ciao " + str(params)

handlers = {
    "save" : handler_save_map,
    "test": handler_test
}

def handle_message(params):
    cmd_type = params['type'][0]
    if cmd_type in handlers:
        return handlers[cmd_type](params)
    return "error"
    
    