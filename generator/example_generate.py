import sys
import yaml 
import map_generator

if len(sys.argv) != 3:
    print("Please specify a yaml file.\nExample: \n > python " + sys.argv[0] + " MapExample.yaml output.html")
    exit()

map_file = sys.argv[1]
output_file = sys.argv[2]

with open('map.yaml') as f:
    data = yaml.load(f, Loader=yaml.CLoader)

    outHTML =  map_generator.generate(data["esercizi"]) 

    #html output
    with open(output_file, 'w') as f:
        f.write(outHTML)