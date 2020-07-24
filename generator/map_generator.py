import html

def generate(data):
    """Returns the generated html"""

    outHTML = ""

    #html header
    with open("templates/header.html", 'r') as f:
        outHTML += f.read()

    #html exercise template
    exercise_template = ""
    with open("templates/exercise.html", 'r') as f:
        exercise_template = f.read()

    #html task template
    task_template = ""
    with open("templates/task.html", 'r') as f:
        task_template = f.read()

    for exercise in data: 
        ex_tags = ""
        for tag in exercise["tags"]: 
            ex_tags += '<div class="competence">' + tag + '</div> '
        
        tot_points = exercise["tot_points"]

        tasks_html = ""
        task_idx = 1
        for task in exercise["tasks"]:

            task_values = ""
            for i in range(1, task["tot_points"] + 1):
                task_values += '<option value="'+str(i)+'">'+str(i)+'</option>\n'

            tasks_html += task_template.format(
                ex_task_name = "Task " + html.escape(str(task_idx)),
                ex_task_values = task_values,
                ex_task_max_points = str(task["tot_points"] ),
                ex_task_description = html.escape(task["description1"])
            ) + "\n"
            task_idx += 1
        
        outHTML += exercise_template.format(
            ex_title = html.escape(exercise["title"]),
            ex_tags = ex_tags,
            ex_tot_points = tot_points,
            ex_link = exercise["link"],
            ex_tasks = tasks_html
        )

    #html footer
    with open("templates/footer.html", 'r') as f:
        outHTML += f.read()

    return outHTML
