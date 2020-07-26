import os
import sys
import subprocess
import webbrowser

conda_environment = "ROexam"
webserverPort = "8080"
webserverIp = "127.0.0.1"
jupyterPort = "8888"

if len(sys.argv) == 2:
    conda_environment = sys.argv[1]

conda_installed = True
try:
    subprocess.Popen("conda").terminate()
except:
    conda_installed = False

pythonPath = sys.executable

activate_environment = ""
if conda_installed:
    if  sys.platform == "win32":
        separator = " && "
    else:
        separator = " ; "
    pythonPath = "python"
    activate_environment = "conda activate " + conda_environment + separator
else:
    print("Conda is not installed using the pip version of jupyter notebook")


# start local http server
command = sys.executable + " map/server.py " + webserverPort + " --bind " + webserverIp 
print("> " + command)
p1 = subprocess.Popen(command, shell=True)
webbrowser.open("http://" + webserverIp + ":" + webserverPort + "/map/index.html?port="+jupyterPort)

# stop jupyter notebook
command =  activate_environment +  pythonPath + " -m notebook stop " + jupyterPort
print("> " + command)
p2 = subprocess.Popen(command, shell=True)

# start jupyter notebook
command = activate_environment +  pythonPath + " -m notebook --NotebookApp.token='' --port " + jupyterPort
print("> " + command)
p3 = subprocess.Popen(command, shell=True) 

try:
    p1.communicate()
    p2.communicate()
    p3.communicate()
except KeyboardInterrupt:
    print("\n----Closing program---\n")
    command = activate_environment + pythonPath + " -m notebook stop " + jupyterPort
    print("> " + command)
    p4 = subprocess.Popen(command, shell=True)
