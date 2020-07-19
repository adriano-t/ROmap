
import os
import sys
import subprocess
import webbrowser
from config import *

pythonPath = sys.executable

# start local http server
p1 = subprocess.Popen(pythonPath + " -m http.server " + webserverPort + " --bind " + webserverIp, shell=True)
webbrowser.open("http://" + webserverIp + ":" + webserverPort + "/map/index.html")

# start jupyter notebook
p2 = subprocess.Popen(pythonPath + " -m jupyter notebook --no-browser --port " + jupyterPort, shell=True) 
