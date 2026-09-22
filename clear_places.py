import json

# Empty places list
places = []

# Write empty list to js/places.js
with open("js/places.js", "w", encoding="utf-8") as file:
    file.write("const places = ")
    json.dump(places, file, indent=4)
    file.write(";")

print("places.js has been cleared successfully.")