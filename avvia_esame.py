
import os
import sys
import subprocess
import webbrowser
from config import * 

pythonPath = sys.executable

# start local http server
p1 = subprocess.Popen(pythonPath + " -m http.server " + webserverPort + " --bind " + webserverIp, shell=True)
webbrowser.open("http://" + webserverIp + ":" + webserverPort + "/map/index.html?port="+jupyterPort)

# start jupyter notebook
p2 = subprocess.Popen(pythonPath + " -m jupyter notebook stop " + jupyterPort, shell=True)
p3 = subprocess.Popen(pythonPath + " -m jupyter notebook --port " + jupyterPort, shell=True) 

try:
    p1.communicate()
    p2.communicate()
    p3.communicate()
except KeyboardInterrupt:
    print("\n----Closing program---\n")
    p4 = subprocess.Popen(pythonPath + " -m jupyter notebook stop " + jupyterPort, shell=True)

#During handling of the above exception, another exception occurred: