
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

p2a = subprocess.Popen(pythonPath + " -m notebook stop " + jupyterPort, shell=True)
p3a = subprocess.Popen(pythonPath + " -m notebook --port " + jupyterPort, shell=True) 


p2b = subprocess.Popen(pythonPath + " -m jupyter notebook stop " + jupyterPort, shell=True)
p3b = subprocess.Popen(pythonPath + " -m jupyter notebook --port " + jupyterPort, shell=True) 

try:
    p1.communicate()
    p2a.communicate()
    p3a.communicate()
    p2b.communicate()
    p3b.communicate()
except KeyboardInterrupt:
    print("\n----Closing program---\n")
    p4 = subprocess.Popen(pythonPath + " -m jupyter notebook stop " + jupyterPort, shell=True)

#During handling of the above exception, another exception occurred: